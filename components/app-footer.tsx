import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function AppFooter() {
  return (
    <footer className="border-t bg-gradient-to-br from-white via-secondary/20 to-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                MoodLift
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your AI-powered companion for emotional wellness and mental health support.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-primary mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/assessment" className="hover:text-primary transition-colors">
                  Mood Assessment
                </Link>
              </li>
              <li>
                <Link href="/games" className="hover:text-primary transition-colors">
                  Wellness Games
                </Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-primary transition-colors">
                  Book Recommendations
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/progress" className="hover:text-primary transition-colors">
                  Track Progress
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-primary mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/discover" className="hover:text-primary transition-colors">
                  Discover
                </Link>
              </li>
              <li>
                <Link href="/games" className="hover:text-primary transition-colors">
                  All Games
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="hover:text-primary transition-colors">
                  Rewards
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-primary mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="https://hexpertify-blog-sigma.vercel.app/"
                  className="hover:text-primary transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 MoodLift. All rights reserved. Your wellness journey matters to us.</p>
        </div>
      </div>
    </footer>
  );
}
