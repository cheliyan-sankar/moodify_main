import Link from 'next/link';
import type { Metadata } from 'next';

import { AppFooter } from '@/components/app-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteHeader } from '@/components/site-header';
import StructuredData from '@/components/structured-data';

export const metadata: Metadata = {
  title: 'Contact MoodLift - Get in Touch for Emotional Wellness Support',
  description: 'Contact MoodLift for questions about our AI-powered emotional wellness platform. Reach out for support, feedback, or partnership inquiries.',
  keywords: 'contact MoodLift, emotional wellness support, mental health contact, wellness platform support, customer service',
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
            "email": "support@moodlift.com",
            "telephone": "+91-89405-06900",
            "url": "https://moodlift.com"
          }
        }}
      />
      <SiteHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Card className="border-2 border-accent/30 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-primary">Contact Us</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 text-sm text-muted-foreground">
            <p>We would love to hear from you! You can reach us through any of the following methods:</p>

            <div className="space-y-2">
              <h2 className="text-base font-semibold text-primary">Email Us</h2>
              <a href="mailto:support@moodlift.com" className="hover:text-primary transition-colors">
                support@moodlift.com
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
