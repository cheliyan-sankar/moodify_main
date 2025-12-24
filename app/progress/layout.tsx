import type { Metadata } from 'next';
import StructuredData from '@/components/structured-data';

export const metadata: Metadata = {
  title: 'Progress & Profile - Track Your Emotional Wellness Journey | MoodLift',
  description: 'View your emotional wellness progress, track mood patterns, manage your profile, and monitor your mental health journey with detailed analytics.',
  keywords: 'emotional wellness progress, mood tracking, mental health profile, wellness analytics, progress tracking, mood patterns',
  openGraph: {
    title: 'Progress & Profile - Track Your Emotional Wellness Journey | MoodLift',
    description: 'View your emotional wellness progress, track mood patterns, manage your profile, and monitor your mental health journey with detailed analytics.',
    url: 'https://moodlift.com/progress',
    siteName: 'MoodLift',
    images: [
      {
        url: 'https://moodlift.com/images/og-progress.jpg',
        width: 1200,
        height: 630,
        alt: 'Emotional Wellness Progress Tracking - MoodLift',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Progress & Profile - Track Your Emotional Wellness Journey | MoodLift',
    description: 'View your emotional wellness progress, track mood patterns, manage your profile, and monitor your mental health journey with detailed analytics.',
    images: ['https://moodlift.com/images/og-progress.jpg'],
  },
  alternates: {
    canonical: '/progress',
  },
};

export default function ProgressLayout({
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
          "name": "Progress & Profile - MoodLift",
          "description": "Track your emotional wellness progress and manage your mental health journey.",
          "url": "/progress",
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