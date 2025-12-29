'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Home, ClipboardList, Gamepad2, Gift, LogOut, Flame, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { generateInitials, getAvatarColor, getAvatarTextColor } from '@/lib/streak-utils';
import { useStreak } from '@/hooks/use-streak';
import { useRewards } from '@/hooks/use-rewards';
import { ThemeToggle } from '@/components/theme-toggle';

interface UserProfileData {
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

const navigationItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Test', href: '/mood-assessment', icon: ClipboardList },
  { label: 'Games', href: '/games', icon: Gamepad2 },
  { label: 'Discover', href: '/discover', icon: Sparkles },
  { label: 'Profile', href: '/progress', icon: Gift },
];

export function AfterLoginHeader() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const { streakData, loading: streakLoading } = useStreak();
  const { totalPoints } = useRewards();
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('full_name, email, avatar_url')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          setUserData({
            fullName: profile.full_name || '',
            email: profile.email,
            avatarUrl: profile.avatar_url,
          });
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  if (!user || isLoading) {
    return null;
  }

  const displayName = userData?.fullName || userData?.email?.split('@')[0] || 'User';
  const initials = generateInitials(displayName);
  const avatarBgColor = getAvatarColor(userData?.email || '');
  const avatarTextColor = getAvatarTextColor(userData?.email || '');
  const currentStreak = streakData?.currentStreak ?? 0;

  const isNavItemActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-full mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-0 flex-shrink-0">
            <span className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: '#3C1F71' }}>
              MoodLift
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isNavItemActive(item.href);

              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'text-white font-semibold shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={
                      isActive
                        ? {
                            background: 'linear-gradient(135deg, #3C1F71, #5B3A8F)',
                          }
                        : {}
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {currentStreak > 0 && (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-full bg-orange-50 dark:bg-orange-900/30">
                <Flame className="w-4 h-4" style={{ color: '#FF6B35' }} fill="#FF6B35" />
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {currentStreak}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">day streak</span>
              </div>
            )}

            <Link href="/rewards" className="hidden lg:flex items-center px-4 py-2 rounded-full hover:shadow-md transition-shadow" style={{ backgroundColor: '#E2DAF5' }}>
              <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span className="text-sm font-semibold" style={{ color: '#3C1F71' }}>
                {totalPoints}
              </span>
            </Link>

            <ThemeToggle />

            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 transition-all hover:opacity-80 focus:outline-none"
              aria-label={`Profile menu for ${displayName}`}
              aria-expanded={isProfileOpen}
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900 leading-tight">{displayName}</p>
              </div>

              <div className="relative">
                {userData?.avatarUrl ? (
                  <img
                    src={userData.avatarUrl}
                    alt={displayName}
                    className="w-9 h-9 rounded-full object-cover"
                    style={{ backgroundColor: '#3C1F71' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm text-white"
                    style={{
                      backgroundColor: '#3C1F71',
                    }}
                  >
                    {initials}
                  </div>
                )}
              </div>
            </button>

            <div className="relative">

            {isProfileOpen && (
              <>
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-in fade-in-50 slide-in-from-top-2">
                  <div
                    className="px-4 py-3 border-b"
                    style={{ backgroundColor: '#E2DAF5' }}
                  >
                    <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{userData?.email}</p>
                  </div>

                  <div className="px-4 py-3 bg-white space-y-3">
                    {currentStreak > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Flame className="w-5 h-5" style={{ color: '#FF6B35' }} fill="#FF6B35" />
                          <div>
                            <p className="text-xs text-gray-600">Current Streak</p>
                            <p className="text-lg font-bold" style={{ color: '#3C1F71' }}>
                              {currentStreak > 0 ? `${currentStreak} days` : '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600">Points</p>
                      <p className="text-lg font-bold" style={{ color: '#3C1F71' }}>
                        {totalPoints}
                      </p>
                    </div>

                    {streakData?.longestStreak ? (
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-600">Personal Best</p>
                        <p className="text-lg font-bold" style={{ color: '#3C1F71' }}>
                          {streakData.longestStreak} days
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 border-t border-gray-200 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>

                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                  aria-hidden="true"
                />
              </>
            )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 bg-white py-3 animate-in fade-in-50 slide-in-from-top-1">
            <div className="space-y-2 px-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isNavItemActive(item.href);

                return (
                  <Link key={item.href} href={item.href}>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-200 ${
                        isActive
                          ? 'text-white font-semibold shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      style={
                        isActive
                          ? {
                              background: 'linear-gradient(135deg, #3C1F71, #5B3A8F)',
                            }
                          : {}
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 px-4 space-y-2">
              {currentStreak > 0 && (
                <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-50">
                  <Flame className="w-4 h-4" style={{ color: '#FF6B35' }} fill="#FF6B35" />
                  <span className="text-sm font-semibold text-gray-900">
                    {currentStreak} day streak
                  </span>
                </div>
              )}
              <Link href="/rewards" className="flex items-center px-4 py-2 rounded-full hover:shadow-md transition-shadow" style={{ backgroundColor: '#E2DAF5' }}>
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                <span className="text-sm font-semibold" style={{ color: '#3C1F71' }}>
                  {totalPoints} points
                </span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
