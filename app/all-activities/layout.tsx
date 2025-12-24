import type { Metadata } from 'next';
import StructuredData from '@/components/structured-data';

export const metadata: Metadata = {
  title: 'All Activities - Complete Collection of Emotional Wellness Tools | MoodLift',
  description: 'Explore our complete collection of emotional wellness activities, games, and exercises designed to improve mental health and emotional well-being.',
  keywords: 'emotional wellness activities, mental health exercises, wellness games, mindfulness activities, CBT tools, breathing exercises',
  openGraph: {
    title: 'All Activities - Complete Collection of Emotional Wellness Tools | MoodLift',
    description: 'Explore our complete collection of emotional wellness activities, games, and exercises designed to improve mental health and emotional well-being.',
    url: 'https://moodlift.com/all-activities',
    siteName: 'MoodLift',
    images: [
      {
        url: 'https://moodlift.com/images/og-activities.jpg',
        width: 1200,
        height: 630,
        alt: 'Complete Collection of Emotional Wellness Activities - MoodLift',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Activities - Complete Collection of Emotional Wellness Tools | MoodLift',
    description: 'Explore our complete collection of emotional wellness activities, games, and exercises designed to improve mental health and emotional well-being.',
    images: ['https://moodlift.com/images/og-activities.jpg'],
  },
  alternates: {
    canonical: '/all-activities',
  },
};

export default function AllActivitiesLayout({
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
          "name": "All Activities - MoodLift",
          "description": "Complete collection of emotional wellness activities and mental health exercises.",
          "url": "/all-activities",
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