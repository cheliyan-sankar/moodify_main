'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

export function GoogleSignInPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) return;

    const hasSeenPopup = sessionStorage.getItem('hasSeenGooglePopup');

    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        sessionStorage.setItem('hasSeenGooglePopup', 'true');

        const autoCloseTimer = setTimeout(() => {
          handleClose();
        }, 10000);

        return () => clearTimeout(autoCloseTimer);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  const handleGoogleSignIn = async () => {
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
      const redirectTo = siteUrl
        ? `${siteUrl}/auth/callback`
        : `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });

      if (error) {
        console.error('Error signing in with Google:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isVisible || user) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 w-[calc(100%-2rem)] max-w-[320px] transition-all duration-300 ${
        isClosing ? 'opacity-0 -translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'
      }`}
      style={{ pointerEvents: isClosing ? 'none' : 'auto' }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 border-2 relative"
        style={{ borderColor: '#E2DAF5' }}
      >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
            aria-label="Close popup"
          >
            <X className="w-5 h-5" style={{ color: '#3C1F71' }} />
          </button>

        <div className="text-center mb-4">
          <div
            className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
            style={{ backgroundColor: '#E2DAF5' }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#3C1F71">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#3C1F71' }}>
            Welcome to MoodLift
          </h2>
          <p className="text-sm text-gray-600">
            Sign in with Google to save your progress
          </p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 rounded-lg transition-all hover:shadow-md"
          style={{ borderColor: '#E2DAF5' }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="font-medium text-sm" style={{ color: '#3C1F71' }}>
            Continue with Google
          </span>
        </button>

        <p className="text-xs text-center text-gray-500 mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
