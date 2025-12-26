import Link from 'next/link';
import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo-service';

import { AppFooter } from '@/components/app-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HomeNavbar } from '@/components/home-navbar';
import StructuredData from '@/components/structured-data';

export const dynamic = 'force-dynamic';

const defaultMetadata: Metadata = {
  title: 'MoodLift Blog - Mental Health Tips & Wellness Insights',
  description: 'Read our latest articles on mental health, emotional wellness, mindfulness practices, and AI-powered wellness techniques to improve your mood and well-being.',
  keywords: 'mental health blog, wellness tips, mindfulness, emotional wellness, mood improvement, mental health articles, wellness insights',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'MoodLift Blog - Mental Health Tips & Wellness Insights',
    description: 'Read our latest articles on mental health, emotional wellness, mindfulness practices, and AI-powered wellness techniques.',
    url: 'https://moodlift.com/blog',
    siteName: 'MoodLift',
    images: [
      {
        url: 'https://moodlift.com/images/og-blog.jpg',
        width: 1200,
        height: 630,
        alt: 'MoodLift Blog - Mental Health & Wellness Articles',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoodLift Blog - Mental Health Tips & Wellness Insights',
    description: 'Read our latest articles on mental health, emotional wellness, mindfulness practices, and AI-powered wellness techniques.',
    images: ['https://moodlift.com/images/og-blog.jpg'],
  },
  alternates: {
    canonical: '/blog',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await getSeoMetadata('/blog');
    if (!seo) return defaultMetadata;

    const ogImages = seo.og_image ? [{ url: seo.og_image, alt: seo.title }] : defaultMetadata.openGraph?.images;

    return {
      title: seo.title || defaultMetadata.title,
      description: seo.description || defaultMetadata.description,
      keywords: seo.keywords || defaultMetadata.keywords,
      metadataBase: new URL('https://moodlift.com'),
      alternates: defaultMetadata.alternates,
      openGraph: {
        title: seo.title || defaultMetadata.openGraph?.title,
        description: seo.description || defaultMetadata.openGraph?.description,
        url: 'https://moodlift.com/blog',
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

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/20 to-accent/10">
      <StructuredData
        script={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "MoodLift Blog",
          "description": "Mental health tips, wellness insights, and articles about emotional well-being and mindfulness practices.",
          "url": "/blog",
          "publisher": {
            "@type": "Organization",
            "name": "MoodLift",
            "url": "https://moodlift.com"
          }
        }}
      />
      <HomeNavbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Card className="border-2 border-accent/30 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-primary">Updates & articles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Blog content will appear here soon.</p>
            <div>
              <Link href="/discover" className="inline-block" title="Discover personalized wellness recommendations">
                <Button variant="outline">Go to Discover</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <AppFooter />
    </div>
  );
}
