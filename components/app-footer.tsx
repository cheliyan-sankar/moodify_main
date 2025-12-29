import Link from 'next/link';

export function AppFooter() {
  return (
    <footer className="border-t bg-gradient-to-br from-white via-secondary/20 to-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/images/HexpertifyBlog Logo - MoodLiftLogo - Edited (2).png"
                alt="MoodLift logo"
                className="h-12 w-auto object-contain"
              />
            </div>
            <div className="text-xs text-muted-foreground space-y-2">
              <p className="leading-snug">
                MoodLift helps you understand and improve your mood through simple & Science backed wellness games, calming exercises, and mindful activities designed for everyday emotional balance.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-primary mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/mood-assessment" className="hover:text-primary transition-colors" title="Take our AI-powered mood assessment">
                  Mood Assessment
                </Link>
              </li>
              <li>
                <Link href="/games" className="hover:text-primary transition-colors" title="Explore wellness games and activities">
                  Wellness Games
                </Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-primary transition-colors" title="Discover mood-based book recommendations">
                  Book Recommendations
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors" title="View your progress and achievements">
                  Dashboard
                </Link>
              </li>
              {/* Progress page removed */}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-primary mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors" title="Learn about MoodLift and our mission">
                  About
                </Link>
              </li>
              <li>
                <Link href="/discover" className="hover:text-primary transition-colors" title="Discover personalized recommendations">
                  Discover
                </Link>
              </li>
              <li>
                <Link href="/games" className="hover:text-primary transition-colors" title="Browse all available games and activities">
                  All Games
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="hover:text-primary transition-colors" title="View your rewards and achievements">
                  Rewards
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors" title="Go to MoodLift home page">
                  Home
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-primary mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors" title="Get in touch with our support team">
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="https://hexpertify-blog-sigma.vercel.app/"
                  className="hover:text-primary transition-colors"
                  title="Visit our blog for more wellness insights"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Blog
                </a>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-primary transition-colors" title="Read our privacy policy and data protection practices">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; 2025 MoodLift. All rights reserved. Crafted with Care by{' '}
            <a
              href="https://hexpertify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors font-medium"
              title="Visit Hexpertify - Our development partner"
            >
              Hexpertify
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
