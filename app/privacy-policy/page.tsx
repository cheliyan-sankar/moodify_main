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
            <p>
              Your privacy is important to us. This Privacy Policy explains how Moodify collects, uses, stores, and
              protects your information when you use our platform.
            </p>

            <p>
              Moodify is a sub-brand and specialized emotional wellness platform operated under Hexpertify, which is the
              parent company. This policy applies specifically to Moodify and its services.
            </p>

            <div>
              <h2 className="text-base font-semibold text-primary mb-2">Information We Collect</h2>
              <p className="mb-4">We may collect the following types of information to provide and improve our services:</p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">1. Personal Information</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>Name (if provided)</li>
                    <li>Email address</li>
                    <li>Basic account details</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">2. Emotional &amp; Usage Data</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>Mood inputs and session interactions</li>
                    <li>Self-reflection responses entered by the user</li>
                    <li>Platform usage data (pages visited, session duration, feature usage)</li>
                  </ul>
                  <p className="mt-3">Moodify does not collect sensitive medical records or clinical diagnoses.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-base font-semibold text-primary mb-2">How We Use Your Information</h2>
              <p className="mb-3">We use the collected information to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Deliver personalized mood and wellness sessions</li>
                <li>Improve user experience and platform functionality</li>
                <li>Monitor platform performance and security</li>
                <li>Communicate important updates related to your account or sessions</li>
              </ul>
              <p className="mt-3">Your data is never used for advertising manipulation or sold to third parties.</p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-primary mb-2">Data Sharing &amp; Disclosure</h2>
              <p className="mb-3">We do not sell, rent, or trade your personal data.</p>
              <p className="mb-3">Information may be shared only:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>When required by law or legal process</li>
                <li>To protect the rights, safety, or security of users and the platform</li>
                <li>
                  With trusted technical service providers strictly for platform operation (under confidentiality
                  agreements)
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-semibold text-primary mb-2">Relationship with Hexpertify</h2>
              <p className="mb-3">
                Moodify operates independently for emotional wellness sessions but is part of the Hexpertify ecosystem.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Hexpertify manages expert-led consultations and professional services</li>
                <li>Moodify focuses on self-guided emotional and mood-based support</li>
              </ul>
              <p className="mt-3">
                User data from Moodify is not shared with consultants or professionals on Hexpertify unless explicitly
                initiated by the user.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-primary mb-2">Data Security</h2>
              <p className="mb-3">
                We implement reasonable technical and organizational measures to protect your data, including:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Secure storage practices</li>
                <li>Restricted access to user information</li>
                <li>Regular monitoring for unauthorized access</li>
              </ul>
              <p className="mt-3">
                However, no digital system is 100% secure, and users are encouraged to use the platform responsibly.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-primary mb-2">User Control &amp; Choices</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Access your personal information</li>
                <li>Request correction or deletion of your data</li>
                <li>Stop using the platform at any time</li>
              </ul>
              <p className="mt-3">
                Requests related to data management can be raised through official communication channels provided on the
                platform.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-primary mb-2">Children’s Privacy</h2>
              <p>
                Moodify is not intended for use by children under the age of 13. We do not knowingly collect data from
                minors.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-primary mb-2">Policy Updates</h2>
              <p>
                This Privacy Policy may be updated periodically to reflect platform improvements or legal requirements.
                Any changes will be clearly communicated within the platform.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-primary mb-2">Contact Information</h2>
              <p>
                For privacy-related questions or concerns, please contact us through the official Moodify or Hexpertify
                communication channels.
              </p>
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
