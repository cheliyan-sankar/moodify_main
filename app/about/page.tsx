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
            <h1 className="text-xl font-bold text-primary">About</h1>
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
            <CardTitle className="text-primary">About the Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-muted-foreground">
            <p>
              Moodify sessions are thoughtfully designed to support emotional well-being, mental clarity, and personal
              balance in a safe and guided digital environment. Each session focuses on helping users understand,
              regulate, and respond to their emotions through structured self-reflection, mood tracking, guided
              activities, and evidence-informed techniques.
            </p>

            <p>
              These sessions are not random motivational content. They are purpose-driven experiences aimed at:
            </p>

            <ul className="list-disc pl-5 space-y-2">
              <li>Improving emotional awareness</li>
              <li>Supporting stress and anxiety management</li>
              <li>Encouraging healthy coping mechanisms</li>
              <li>Promoting consistent mental wellness habits</li>
            </ul>

            <p>
              Users can engage with sessions at their own pace, making Moodify suitable for daily emotional check-ins as
              well as deeper self-soothing and mood regulation practices.
            </p>

            <div className="pt-2">
              <h2 className="text-base font-semibold text-primary mb-2">Relationship with Hexpertify</h2>
              <p className="mb-4">
                Moodify is a sub-brand and specialized platform under Hexpertify, which is the parent company.
              </p>
              <p className="mb-4">
                While Hexpertify focuses on connecting users with certified professionals and expert-led consultations
                across domains such as mental health, healthcare, career guidance, and wellness, Moodify is built as a
                dedicated emotional wellness extension of that ecosystem.
              </p>
              <p className="mb-3">In simple terms:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Hexpertify → Expert-driven, professional consultation platform</li>
                <li>Moodify → Emotion-focused, self-guided wellness and mood support platform</li>
              </ul>
              <p className="mt-4">
                Both platforms share the same core philosophy: providing reliable, responsible, and meaningful support
                for personal well-being, while serving different but complementary user needs.
              </p>
            </div>

            <div className="pt-2">
              <h2 className="text-base font-semibold text-primary mb-2">Purpose of Moodify Sessions</h2>
              <p>
                Moodify sessions act as a bridge between everyday emotional challenges and professional mental wellness
                support. For users who may not always require immediate expert consultation, these sessions offer a
                structured, accessible way to care for their mental and emotional health—anytime, anywhere.
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
