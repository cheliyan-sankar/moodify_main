'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Gamepad2, Heart } from 'lucide-react';
import Link from 'next/link';
import { GamesSection } from '@/components/games-section';
import { FAQSection } from '@/components/faq-section';
import { AppFooter } from '@/components/app-footer';
import StructuredData from '@/components/structured-data';
import { HomeNavbar } from '@/components/home-navbar';

function GamesHubContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/20 to-accent/10">
      <StructuredData
        script={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "MoodLift Games & Activities",
          "description": "Breathing exercises, grounding techniques and short wellness games to improve emotional health",
          "url": "https://your-production-url.example.com/games"
        }}
      />
      {/* ItemList of featured activities (using visible site content) */}
      <StructuredData script={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Featured Activities",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "url": "https://your-production-url.example.com/games/box-breathing", "name": "Box Breathing" },
          { "@type": "ListItem", "position": 2, "url": "https://your-production-url.example.com/games/diaphragmatic-breathing", "name": "Diaphragmatic Breathing" },
          { "@type": "ListItem", "position": 3, "url": "https://your-production-url.example.com/games/four-seven-eight-breathing", "name": "4-7-8 Breathing" }
        ]
      }} />
      <HomeNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="flex items-center justify-start mb-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/">Back to home</Link>
          </Button>
        </div>

        <section className="mb-8 sm:mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="section-title font-bold text-primary">All Activities & Games</h1>
              <p className="text-muted-foreground">
                Breathing exercises and grounding techniques for your wellness
              </p>
            </div>
          </div>
          <GamesSection />
        </section>

        <Card className="bg-gradient-to-r from-primary to-accent text-white border-2 border-secondary/80 shadow-2xl">
          <CardContent className="p-6 sm:p-8 md:p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="section-title font-bold mb-4">Pin Your Favorites</h2>
            <p className="text-base sm:text-lg mb-4 sm:mb-6 text-white/90 max-w-2xl mx-auto">
              Click the pin icon on any game to save it to your favorites. Track your progress and create a personalized wellness collection.
            </p>
            <Link href="/discover">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Explore More Resources
              </Button>
            </Link>
          </CardContent>
        </Card>

        <FAQSection
          title="Games & Activities FAQs"
          page="games"
        />
      </main>

      <AppFooter />
    </div>
  );
}

export default function GamesHub() {
  return <GamesHubContent />;
}
