import Link from 'next/link';

import { AppFooter } from '@/components/app-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/20 to-accent/10">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-primary">Contact Us</h1>
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
            <CardTitle className="text-primary">Contact Us</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 text-sm text-muted-foreground">
            <p>We would love to hear from you! You can reach us through any of the following methods:</p>

            <div className="space-y-2">
              <h2 className="text-base font-semibold text-primary">Email Us</h2>
              <a href="mailto:support@moodlift.com" className="hover:text-primary transition-colors">
                support@moodlift.com
              </a>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-semibold text-primary">Phone</h2>
              <a href="tel:+918940506900" className="hover:text-primary transition-colors">
                +91 89405 06900
              </a>
            </div>
          </CardContent>
        </Card>
      </main>

      <AppFooter />
    </div>
  );
}
