import type { MetadataRoute } from 'next';
import { getAllSeoMetadata } from '@/lib/seo-service';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://moodlift.hexpertify.com';

function getSiteOrigin() {
  return SITE_URL.replace(/\/$/, '');
}

function normalizeToPath(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return '';

  // If an absolute URL was stored, keep only the pathname.
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      return new URL(trimmed).pathname || '/';
    } catch {
      // fall through
    }
  }

  // Strip any query/hash if present.
  const withoutQueryOrHash = trimmed.split('#')[0].split('?')[0];
  return withoutQueryOrHash.startsWith('/') ? withoutQueryOrHash : `/${withoutQueryOrHash}`;
}

function encodePathnameForSitemap(pathname: string) {
  // Encode each segment so reserved XML characters (like '&') become safe in the final XML.
  // Example: /games&activities -> /games%26activities
  return pathname
    .split('/')
    .map((segment, idx) => (idx === 0 ? '' : encodeURIComponent(segment)))
    .join('/');
}

function toSitemapUrl(origin: string, rawPathOrUrl: string) {
  const pathname = normalizeToPath(rawPathOrUrl);
  if (!pathname) return '';

  const encodedPath = encodePathnameForSitemap(pathname);
  return new URL(encodedPath, origin).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteOrigin();

  // Core static routes that are always part of the product
  const staticPaths: string[] = [
    '/',
    '/about',
    '/blog',
    '/books',
    '/contact',
    '/discover',
    '/games',
    '/games&activities',
    '/mood-assessment',
    '/all-activities',
    '/dashboard',
    '/progress',
    '/rewards',
    '/privacy-policy',
  ];

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: toSitemapUrl(origin, path === '/' ? '/' : path),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1.0 : 0.7,
  }));

  // Dynamically include any pages that have SEO metadata
  // This makes the sitemap auto-update as you add new SEO records.
  let seoEntries: MetadataRoute.Sitemap = [];
  try {
    const allSeo = await getAllSeoMetadata();

    const seen = new Set<string>();

    const mappedSeo = allSeo
      .map((seo) => {
        const rawPathOrUrl = (seo.page_url || '').trim();
        if (!rawPathOrUrl) return null;

        const fullUrl = toSitemapUrl(origin, rawPathOrUrl);
        if (!fullUrl) return null;

        const path = new URL(fullUrl).pathname;

        if (seen.has(fullUrl)) return null;
        seen.add(fullUrl);

        return {
          url: fullUrl,
          // We don't currently track per-page lastModified; use now as a sane default
          lastModified: now,
          changeFrequency: 'weekly' as const,
          priority: path === '/' ? 1.0 : 0.7,
        } as MetadataRoute.Sitemap[number];
      })
      .filter((entry): entry is MetadataRoute.Sitemap[number] => entry !== null);

    seoEntries = mappedSeo;
  } catch (error) {
    console.error('Error building SEO-based sitemap entries:', error);
  }

  // Merge static + SEO-based entries, preferring SEO list for duplicates
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const entry of staticEntries) {
    byUrl.set(entry.url, entry);
  }

  for (const entry of seoEntries) {
    byUrl.set(entry.url, entry);
  }

  return Array.from(byUrl.values());
}
