import type { Metadata } from 'next';
import StructuredData from '@/components/structured-data';

export const metadata: Metadata = {
  title: 'Rewards & Achievements - Earn Points for Emotional Wellness | MoodLift',
  description: 'Earn points, unlock achievements, and track your progress as you complete emotional wellness activities and maintain healthy mental health habits.',
  keywords: 'emotional wellness rewards, mental health achievements, wellness points, habit tracking, mental health badges, wellness milestones',
  openGraph: {
    title: 'Rewards & Achievements - Earn Points for Emotional Wellness | MoodLift',
    description: 'Earn points, unlock achievements, and track your progress as you complete emotional wellness activities and maintain healthy mental health habits.',
    url: 'https://moodlift.com/rewards',
    siteName: 'MoodLift',
    images: [
      {
        url: 'https://moodlift.com/images/og-rewards.jpg',
        width: 1200,
        height: 630,
        alt: 'Emotional Wellness Rewards & Achievements - MoodLift',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rewards & Achievements - Earn Points for Emotional Wellness | MoodLift',
    description: 'Earn points, unlock achievements, and track your progress as you complete emotional wellness activities and maintain healthy mental health habits.',
    images: ['https://moodlift.com/images/og-rewards.jpg'],
  },
  alternates: {
    canonical: '/rewards',
  },
};

export default function RewardsLayout({
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
          "name": "Rewards & Achievements - MoodLift",
          "description": "Earn points and unlock achievements for completing emotional wellness activities.",
          "url": "/rewards",
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