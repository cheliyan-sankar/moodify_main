import type { Metadata } from 'next';
import StructuredData from '@/components/structured-data';

export const metadata: Metadata = {
  title: 'Games & Activities - Interactive Emotional Wellness Tools | MoodLift',
  description: 'Play interactive emotional wellness games and activities including breathing exercises, CBT challenges, grounding techniques, and mindfulness activities.',
  keywords: 'emotional wellness games, breathing exercises, CBT activities, grounding techniques, mindfulness games, mental health activities',
  openGraph: {
    title: 'Games & Activities - Interactive Emotional Wellness Tools | MoodLift',
    description: 'Play interactive emotional wellness games and activities including breathing exercises, CBT challenges, grounding techniques, and mindfulness activities.',
    url: 'https://moodlift.com/games',
    siteName: 'MoodLift',
    images: [
      {
        url: 'https://moodlift.com/images/og-games.jpg',
        width: 1200,
        height: 630,
        alt: 'Interactive Emotional Wellness Games - MoodLift',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Games & Activities - Interactive Emotional Wellness Tools | MoodLift',
    description: 'Play interactive emotional wellness games and activities including breathing exercises, CBT challenges, grounding techniques, and mindfulness activities.',
    images: ['https://moodlift.com/images/og-games.jpg'],
  },
  alternates: {
    canonical: '/games',
  },
};

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData
        script={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Games & Activities - MoodLift",
          "description": "Interactive emotional wellness games and activities for mental health and well-being.",
          "url": "/games",
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