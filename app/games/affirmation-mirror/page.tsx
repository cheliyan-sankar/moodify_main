'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { AffirmationMirror } from '@/components/affirmation-mirror';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AppFooter } from '@/components/app-footer';

function AffirmationMirrorContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-rose-50/20 to-pink-50/10">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/games-and-activities">
              <Button size="sm" className="bg-gradient-to-r from-rose-400 to-pink-500 hover:opacity-90 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <AffirmationMirror />
      </main>

      <AppFooter />
    </div>
  );
}

export default function AffirmationMirrorPage() {
  return (
    <ProtectedRoute>
      <AffirmationMirrorContent />
    </ProtectedRoute>
  );
}
