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
  title: 'Contact MoodLift - Get in Touch for Emotional Wellness Support',
  description: 'Contact MoodLift for questions about our AI-powered emotional wellness platform. Reach out for support, feedback, or partnership inquiries.',
  keywords: 'contact MoodLift, emotional wellness support, mental health contact, wellness platform support, customer service',
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
    title: 'Contact MoodLift - Get in Touch for Emotional Wellness Support',
    description: 'Contact MoodLift for questions about our AI-powered emotional wellness platform. Reach out for support, feedback, or partnership inquiries.',
    url: 'https://moodlift.com/contact',
    siteName: 'MoodLift',
    images: [
      {
        url: 'https://moodlift.com/images/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact MoodLift - Emotional Wellness Support',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact MoodLift - Get in Touch for Emotional Wellness Support',
    description: 'Contact MoodLift for questions about our AI-powered emotional wellness platform. Reach out for support, feedback, or partnership inquiries.',
    images: ['https://moodlift.com/images/og-contact.jpg'],
  },
  alternates: {
    canonical: '/contact',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await getSeoMetadata('/contact');
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
        url: 'https://moodlift.com/contact',
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

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/20 to-accent/10">
      <StructuredData
        script={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact MoodLift",
          "description": "Get in touch with MoodLift for support and inquiries about our emotional wellness platform.",
          "url": "/contact",
          "mainEntity": {
            "@type": "Organization",
            "name": "MoodLift",
            "email": "hexpertifyapp@gmail.com",
            "telephone": "+91-89405-06900",
            "url": "https://moodlift.com"
          }
        }}
      />
      <HomeNavbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Card className="border-2 border-accent/30 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-primary">Contact Us</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 text-sm text-muted-foreground">
            <p>We would love to hear from you! You can reach us through any of the following methods:</p>

            <div className="space-y-2">
              <h2 className="text-base font-semibold text-primary">Email Us</h2>
              <a href="mailto:hexpertifyapp@gmail.com" className="hover:text-primary transition-colors">
                hexpertifyapp@gmail.com
              </a>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-semibold text-primary">Phone</h2>
              <a href="tel:+918940506900" className="hover:text-primary transition-colors">
                +91 89405 06900
              </a>
            </div>
          </CardContent>
        </Card>
      </main>

      <AppFooter />
    </div>
  );
}
