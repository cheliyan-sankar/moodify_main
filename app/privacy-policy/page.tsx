import Link from 'next/link';

import { AppFooter } from '@/components/app-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/20 to-accent/10">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-primary">Privacy Policy</h1>
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
            <CardTitle className="text-primary">Privacy Policy</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 text-sm text-muted-foreground">
            <p className="font-medium">Last Updated: 23/12/2025</p>

            <p>
              Moodify respects your privacy and is committed to protecting your personal information. This Privacy
              Policy explains how we collect, use, store, and protect your data when you use our platform.
            </p>

            <p>By accessing or using Moodify, you agree to the practices described in this policy.</p>

            <div>
              <h2 className="text-base font-semibold text-primary mb-2">1. Information We Collect</h2>
              <p className="mb-2">We may collect the following types of information:</p>

              <h3 className="font-semibold">a) Information You Provide</h3>
              <ul className="list-disc pl-5 mb-3">
                <li>Name, email address, or account details (if applicable)</li>
                <li>Responses to mood check-ins, wellness activities, or games</li>
                <li>Feedback or communications shared with us</li>
              </ul>

              <h3 className="font-semibold">b) Automatically Collected Information</h3>
              <ul className="list-disc pl-5">
                <li>Device and browser information</li>
                <li>Usage data such as pages visited and interactions</li>
                <li>Cookies or similar technologies for functionality and analytics</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-semibold text-primary mb-2">2. How We Use Your Information</h2>
              <p className="mb-2">We use your information to:</p>
              <ul className="list-disc pl-5">
                <li>Provide and maintain the Moodify platform</li>
                <li>Improve user experience and platform performance</li>
                <li>Understand usage patterns and engagement</li>
                <li>Personalize content and activities</li>
                <li>Communicate updates, tips, or relevant information</li>
                <li>Conduct internal analytics, research, and product development</li>
                <li>Support marketing and communication efforts</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-semibold text-primary mb-2">3. Data Sharing and Disclosure</h2>
              <p className="mb-2">We do not sell, rent, or trade your personal data.</p>
              <p className="mb-2">Your data may be shared only within our group companies under Hexpertify solely for the purposes of:</p>
              <ul className="list-disc pl-5 mb-3">
                <li>Improving user experience</li>
                <li>Platform optimization and development</li>
                <li>Internal analytics and research</li>
                <li>Marketing and communication related to our services</li>
              </ul>
              <p className="mb-2">All group companies are required to comply with the same data protection and security standards outlined in this policy.</p>
              <p>We may disclose information if required by law or to protect our legal rights.</p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-primary mb-2">4. Data Security</h2>
              <p className="mb-2">We implement reasonable technical and organizational measures to protect your data, including secure systems, controlled access, and monitoring practices. While no system can guarantee complete security, we strive to safeguard your information against unauthorized access, loss, or misuse.</p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-primary mb-2">5. Cookies and Tracking Technologies</h2>
              <p>Moodify may use cookies or similar technologies to ensure platform functionality, analyze usage, and improve performance. You can manage cookie preferences through your browser settings.</p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-primary mb-2">6. Your Rights and Choices</h2>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc pl-5 mb-3">
                <li>Access or update your personal information</li>
                <li>Request deletion of your data, subject to legal and operational requirements</li>
                <li>Opt out of non-essential communications</li>
              </ul>
              <p>To exercise these rights, please contact us using the information provided below.</p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-primary mb-2">7. Mental Health Disclaimer</h2>
              <p>Moodify is a self-care and wellness support platform. It does not provide medical advice, diagnosis, or therapy and should not be considered a substitute for professional mental health care. If you are experiencing severe emotional distress, please seek help from a qualified professional.</p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-primary mb-2">8. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date. Continued use of the platform indicates acceptance of the revised policy.</p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-primary mb-2">9. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy or how your data is handled, please contact us at:</p>
              <ul className="list-none pl-0 mt-2">
                <li>Email: <a href="mailto:hexpertifyapp@gmail.com" className="text-primary hover:underline">hexpertifyapp@gmail.com</a></li>
                <li>Website: <a href="https://hexpertify.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Hexpertify.com</a></li>
              </ul>
            </div>

            <div>
              <Link href="/about" className="inline-block">
                <Button variant="outline">About Moodify</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <AppFooter />
    </div>
  );
}
