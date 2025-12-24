import type { Metadata } from 'next';
import StructuredData from '@/components/structured-data';

export const metadata: Metadata = {
  title: 'Mood Assessment - Take Your Emotional Wellness Test | MoodLift',
  description: 'Take scientifically validated mood assessments including PANAS, PHQ-9, and GAD-7 to understand your emotional state and get personalized wellness recommendations.',
  keywords: 'mood assessment, emotional wellness test, PANAS, PHQ-9, GAD-7, mental health assessment, mood tracking, emotional health',
  openGraph: {
    title: 'Mood Assessment - Take Your Emotional Wellness Test | MoodLift',
    description: 'Take scientifically validated mood assessments including PANAS, PHQ-9, and GAD-7 to understand your emotional state and get personalized wellness recommendations.',
    url: 'https://moodlift.com/assessment',
    siteName: 'MoodLift',
    images: [
      {
        url: 'https://moodlift.com/images/og-assessment.jpg',
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
    images: ['https://moodlift.com/images/og-assessment.jpg'],
  },
  alternates: {
    canonical: '/assessment',
  },
};

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