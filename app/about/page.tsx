import Link from 'next/link';

import { AppFooter } from '@/components/app-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/20 to-accent/10">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-primary">About Us</h1>
            <Link href="/">
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white">
                Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Card className="border-2 border-accent/30 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-primary">About Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-muted-foreground">
            <div className="text-sm text-muted-foreground space-y-4">
              <p>
                Moodify is a Mental wellness platform owned by <a href="https://hexpertify.com" target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline">Hexpertify</a> designed to help people understand, regulate,
                and improve their mood through simple, engaging activities.
              </p>

              <p>
                We believe emotional well-being doesn’t always need long sessions or complicated tools. Sometimes,
                small moments of awareness, reflection, and play can make a real difference. Moodify brings together
                <span className="font-semibold"> mood check-ins</span>, <span className="font-semibold">calming exercises</span>, and <span className="font-semibold">science-inspired wellness games</span> to help users feel more balanced
                in their daily lives.
              </p>

              <p>
                Our activities are designed to support emotions like stress, anxiety, sadness, and low motivation, using
                approaches inspired by <span className="font-semibold">Cognitive Behavioral Techniques</span>, <span className="font-semibold">Mindfulness</span>, and <span className="font-semibold">Nervous system regulation</span>
                presented in a way that feels light, friendly, and easy to use.
              </p>

              <p>
                Moodify is <span className="font-semibold">not a replacement</span> for therapy. It is a supportive self-care space for anyone who wants to
                pause, check in with themselves, and build healthier emotional habits over time.
              </p>
            </div>

            <div>
              <Link href="/discover" className="inline-block">
                <Button variant="outline">Go to Discover</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <AppFooter />
    </div>
  );
}
