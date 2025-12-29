import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo-service';
import StructuredData from '@/components/structured-data';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://moodlift.hexpertify.com';

function buildCanonicalFromSeo(rawCanonical: string | undefined | null, fallbackPath: string): string {
  const origin = SITE_URL.replace(/\/$/, '');

  if (!rawCanonical) {
    return `${origin}${fallbackPath}`;
  }

  const trimmed = rawCanonical.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return `${origin}${trimmed}`;
  }

  if (/^[^\/\s]+\.[^\/\s]+/.test(trimmed)) {
    return `https://${trimmed.replace(/\/$/, '')}/`;
  }

  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${origin}${path}`;
}

const defaultMetadata: Metadata = {
  title: 'Mood Assessment - Take Your Emotional Wellness Test | MoodLift',
  description: 'Take scientifically validated mood assessments including PANAS, PHQ-9, and GAD-7 to understand your emotional state and get personalized wellness recommendations.',
  keywords: 'mood assessment, emotional wellness test, PANAS, PHQ-9, GAD-7, mental health assessment, mood tracking, emotional health',
  openGraph: {
    title: 'Mood Assessment - Take Your Emotional Wellness Test | MoodLift',
    description: 'Take scientifically validated mood assessments including PANAS, PHQ-9, and GAD-7 to understand your emotional state and get personalized wellness recommendations.',
    url: `${SITE_URL}/assessment`,
    siteName: 'MoodLift',
    images: [
      {
        url: `${SITE_URL}/images/og-assessment.jpg`,
        width: 1200,
        height: 630,
        alt: 'Mood Assessment - Emotional Wellness Testing',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mood Assessment - Take Your Emotional Wellness Test | MoodLift',
    description: 'Take scientifically validated mood assessments including PANAS, PHQ-9, and GAD-7 to understand your emotional state and get personalized wellness recommendations.',
    images: [`${SITE_URL}/images/og-assessment.jpg`],
  },
  alternates: {
    canonical: '/assessment',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await getSeoMetadata('/assessment');
    if (!seo) return defaultMetadata;

    const canonicalUrl = buildCanonicalFromSeo(seo.canonical_url, '/assessment');

    const ogImages = seo.og_image ? [{ url: seo.og_image, alt: seo.title }] : defaultMetadata.openGraph?.images;

    return {
      title: seo.title || defaultMetadata.title,
      description: seo.description || defaultMetadata.description,
      keywords: seo.keywords || defaultMetadata.keywords,
      metadataBase: new URL(SITE_URL),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: seo.title || defaultMetadata.openGraph?.title,
        description: seo.description || defaultMetadata.openGraph?.description,
        url: canonicalUrl,
        siteName: defaultMetadata.openGraph?.siteName,
        images: ogImages as any,
        locale: defaultMetadata.openGraph?.locale,
      },
      twitter: {
        title: seo.title || defaultMetadata.twitter?.title,
        description: seo.description || defaultMetadata.twitter?.description,
        images: seo.og_image ? [seo.og_image] : defaultMetadata.twitter?.images,
      },
    } as Metadata;
  } catch (err) {
    console.error('Error generating metadata:', err);
    return defaultMetadata;
  }
}

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData
        script={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Mood Assessment - MoodLift",
          "description": "Take scientifically validated mood assessments to understand your emotional state and get personalized wellness recommendations.",
          "url": "/assessment",
          "publisher": {
            "@type": "Organization",
            "name": "MoodLift",
            "url": "https://moodlift.com"
          }
        }}
      />
      {children}
    </>
  );
}