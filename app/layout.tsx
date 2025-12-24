import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { FavoritesProvider } from '@/lib/favorites-context';
import StructuredData from '@/components/structured-data';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'MoodLift - AI-Powered Emotional Wellness Games & Activities',
  description: 'Transform your mood with AI-powered wellness games designed to boost emotional well-being. Take mood assessments, play interactive activities, and track your mental health journey.',
  keywords: 'emotional wellness, mental health games, mood tracking, AI wellness, mindfulness activities, CBT exercises, breathing techniques, mental health platform',
  authors: [{ name: 'MoodLift Team' }],
  creator: 'MoodLift',
  publisher: 'MoodLift',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://moodlift.com'),
  alternates: {
    canonical: 'https://moodlift.com',
  },
  openGraph: {
    title: 'MoodLift - AI-Powered Emotional Wellness Games & Activities',
    description: 'Transform your mood with AI-powered wellness games designed to boost emotional well-being. Take mood assessments, play interactive activities, and track your mental health journey.',
    url: 'https://moodlift.com',
    siteName: 'MoodLift',
    images: [
      {
        url: 'https://moodlift.com/images/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'MoodLift - AI-Powered Emotional Wellness Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoodLift - AI-Powered Emotional Wellness Games & Activities',
    description: 'Transform your mood with AI-powered wellness games designed to boost emotional well-being. Take mood assessments, play interactive activities, and track your mental health journey.',
    images: ['https://moodlift.com/images/og-home.jpg'],
    creator: '@moodlift',
  },
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
  verification: {
    google: 'your-google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <AuthProvider>
          <FavoritesProvider>
          {/* Base WebSite schema for all pages */}
          <StructuredData
            script={{
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "MoodLift",
              "url": "https://your-production-url.example.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://your-production-url.example.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }}
          />
          {children}
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
