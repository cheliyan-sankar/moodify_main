import type { Metadata } from 'next';
import StructuredData from '@/components/structured-data';

export const metadata: Metadata = {
  title: 'Discover - Explore Emotional Wellness Activities & Resources | MoodLift',
  description: 'Discover personalized emotional wellness activities, games, books, and resources tailored to your mood and mental health needs.',
  keywords: 'emotional wellness activities, mental health games, wellness resources, mood-based activities, mindfulness exercises, CBT activities',
  openGraph: {
    title: 'Discover - Explore Emotional Wellness Activities & Resources | MoodLift',
    description: 'Discover personalized emotional wellness activities, games, books, and resources tailored to your mood and mental health needs.',
    url: 'https://moodlift.com/discover',
    siteName: 'MoodLift',
    images: [
      {
        url: 'https://moodlift.com/images/og-discover.jpg',
        width: 1200,
        height: 630,
        alt: 'Discover Emotional Wellness Activities - MoodLift',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover - Explore Emotional Wellness Activities & Resources | MoodLift',
    description: 'Discover personalized emotional wellness activities, games, books, and resources tailored to your mood and mental health needs.',
    images: ['https://moodlift.com/images/og-discover.jpg'],
  },
  alternates: {
    canonical: '/discover',
  },
};

export default function DiscoverLayout({
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
          "name": "Discover - MoodLift",
          "description": "Explore personalized emotional wellness activities, games, and resources.",
          "url": "/discover",
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