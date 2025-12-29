import './globals.css';
import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo-service';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { FavoritesProvider } from '@/lib/favorites-context';

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const defaultMetadata: Metadata = {
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

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await getSeoMetadata('/');
    if (!seo) return defaultMetadata;

    const ogImages = seo.og_image ? [{ url: seo.og_image, alt: seo.title }] : defaultMetadata.openGraph?.images;

    // Return metadata merged with defaults, including robots settings
    return {
      title: seo.title || defaultMetadata.title,
      description: seo.description || defaultMetadata.description,
      keywords: seo.keywords || defaultMetadata.keywords,
      metadataBase: defaultMetadata.metadataBase,
      alternates: defaultMetadata.alternates,
      openGraph: {
        title: seo.title || defaultMetadata.openGraph?.title,
        description: seo.description || defaultMetadata.openGraph?.description,
        url: `${defaultMetadata.metadataBase?.toString()?.replace(/\/$/, '')}/`,
        siteName: defaultMetadata.openGraph?.siteName,
        images: ogImages as any,
        locale: defaultMetadata.openGraph?.locale,
      },
      twitter: {
        title: seo.title || defaultMetadata.twitter?.title,
        description: seo.description || defaultMetadata.twitter?.description,
        images: seo.og_image ? [seo.og_image] : defaultMetadata.twitter?.images,
      },
      robots: defaultMetadata.robots,
    } as Metadata;
  } catch (err) {
    console.error('Error generating metadata:', err);
    return defaultMetadata;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Optional non-blocking preload for a production CSS file.
            Set NEXT_PUBLIC_CRITICAL_CSS to the full path (example: /_next/static/css/c5bfc2e475fd76c0.css)
            You can find the generated CSS filename in Chrome DevTools -> Network after building the app.
        */}
        {process.env.NEXT_PUBLIC_CRITICAL_CSS ? (
          <>
            <script dangerouslySetInnerHTML={{ __html: `(function(){var href='${process.env.NEXT_PUBLIC_CRITICAL_CSS}';var l=document.createElement('link');l.rel='preload';l.as='style';l.href=href;l.onload=function(){this.rel='stylesheet'};document.head.appendChild(l)})();` }} />
            <noscript>
              <link rel="stylesheet" href={process.env.NEXT_PUBLIC_CRITICAL_CSS} />
            </noscript>
          </>
        ) : null}
      </head>
      <body className={`${inter.variable} font-sans`}>
        <AuthProvider>
          <FavoritesProvider>
          {children}
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
