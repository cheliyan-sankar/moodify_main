import type { Metadata } from 'next';
import StructuredData from '@/components/structured-data';

export const metadata: Metadata = {
  title: 'Dashboard - Track Your Emotional Wellness Progress | MoodLift',
  description: 'Monitor your emotional wellness journey with personalized insights, activity tracking, mood patterns, and progress analytics on your MoodLift dashboard.',
  keywords: 'emotional wellness dashboard, mood tracking, progress analytics, mental health insights, activity tracking, wellness metrics',
  openGraph: {
    title: 'Dashboard - Track Your Emotional Wellness Progress | MoodLift',
    description: 'Monitor your emotional wellness journey with personalized insights, activity tracking, mood patterns, and progress analytics.',
    url: 'https://moodlift.com/dashboard',
    siteName: 'MoodLift',
    images: [
      {
        url: 'https://moodlift.com/images/og-dashboard.jpg',
        width: 1200,
        height: 630,
        alt: 'MoodLift Dashboard - Emotional Wellness Progress Tracking',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard - Track Your Emotional Wellness Progress | MoodLift',
    description: 'Monitor your emotional wellness journey with personalized insights, activity tracking, mood patterns, and progress analytics.',
    images: ['https://moodlift.com/images/og-dashboard.jpg'],
  },
  alternates: {
    canonical: '/dashboard',
  },
};

export default function DashboardLayout({
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
          "name": "Dashboard - MoodLift",
          "description": "Track your emotional wellness progress with personalized insights and analytics.",
          "url": "/dashboard",
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