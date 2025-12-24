import Link from 'next/link';
import type { Metadata } from 'next';

import { AppFooter } from '@/components/app-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteHeader } from '@/components/site-header';
import StructuredData from '@/components/structured-data';

export const metadata: Metadata = {
  title: 'About MoodLift - AI-Powered Emotional Wellness Platform',
  description: 'Learn about MoodLift, an AI-powered mental wellness platform designed to help people understand, regulate, and improve their mood through engaging activities and games.',
  keywords: 'mood tracking, emotional wellness, mental health, AI wellness, mood improvement, mindfulness, CBT, breathing exercises',
  openGraph: {
    title: 'About MoodLift - AI-Powered Emotional Wellness Platform',
    description: 'Discover how MoodLift uses AI-powered wellness games and activities to help improve emotional well-being and mental health.',
    url: 'https://moodlift.com/about',
    siteName: 'MoodLift',
    images: [
      {
        url: 'https://moodlift.com/images/og-about.jpg',
        width: 1200,
        height: 630,
        alt: 'MoodLift - AI-Powered Emotional Wellness',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About MoodLift - AI-Powered Emotional Wellness Platform',
    description: 'Discover how MoodLift uses AI-powered wellness games and activities to help improve emotional well-being and mental health.',
    images: ['https://moodlift.com/images/og-about.jpg'],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/20 to-accent/10">
      <StructuredData
        script={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About MoodLift",
          "description": "Learn about MoodLift, an AI-powered mental wellness platform designed to help people understand, regulate, and improve their mood through engaging activities and games.",
          "url": "/about",
          "publisher": {
            "@type": "Organization",
            "name": "MoodLift",
            "url": "https://moodlift.com"
          }
        }}
      />
      <SiteHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Card className="border-2 border-accent/30 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-primary">About Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-muted-foreground">
            <div className="text-sm text-muted-foreground space-y-4">
              <p>
                Moodify is a Mental wellness platform owned by <a href="https://hexpertify.com" target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline">Hexpertify</a> designed to help people understand, regulate,
                and improve their mood through simple, engaging activities.
              </p>

              <p>
                We believe emotional well-being doesn’t always need long sessions or complicated tools. Sometimes,
                small moments of awareness, reflection, and play can make a real difference. Moodify brings together
                <span className="font-semibold"> mood check-ins</span>, <span className="font-semibold">calming exercises</span>, and <span className="font-semibold">science-inspired wellness games</span> to help users feel more balanced
                in their daily lives.
              </p>

              <p>
                Our activities are designed to support emotions like stress, anxiety, sadness, and low motivation, using
                approaches inspired by <span className="font-semibold">Cognitive Behavioral Techniques</span>, <span className="font-semibold">Mindfulness</span>, and <span className="font-semibold">Nervous system regulation</span> presented in a way that feels light, friendly, and easy to use.
              </p>

              <p>
                Moodify is <span className="font-semibold">not a replacement</span> for therapy. It is a supportive self-care space for anyone who wants to
                pause, check in with themselves, and build healthier emotional habits over time.
              </p>
            </div>

            <div>
              <Link href="/discover" className="inline-block">
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
