'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ClipboardList, LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { AuthModal } from '@/components/auth-modal';
import { GoogleSignInPopup } from '@/components/google-signin-popup';
import { TestimonialCarousel } from '@/components/testimonial-carousel';
import { QuoteCarousel } from '@/components/quote-carousel';
import { FAQSection } from '@/components/faq-section';
import ConsultantCarousel from '@/components/consultant-carousel';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { saveDailyMood, getGameRecommendations, getTodaysMood, type MoodType } from '@/lib/mood-service';
import { AppFooter } from '@/components/app-footer';
import StructuredData from '@/components/structured-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Game = {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  color_from: string;
  color_to: string;
  cover_image_url?: string;
  is_popular?: boolean;
};

export default function Home() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkAdmin = async () => {
      if (!user?.email) {
        if (!cancelled) setIsAdmin(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/check-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email }),
        });
        const json = await res.json().catch(() => ({} as any));
        if (!cancelled) setIsAdmin(!!json?.isAdmin);
      } catch {
        if (!cancelled) setIsAdmin(false);
      }
    };

    checkAdmin();
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  const handleAssessmentClick = () => {
    if (user) {
      router.push('/assessment');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      const userId = data?.user?.id;
      if (!userId) return;

      // If user hasn't recorded today's mood yet, redirect to assessment
      try {
        const todays = await getTodaysMood(userId);
        if (!todays) {
          router.push('/assessment');
        }
      } catch (e) {
        console.error('Error checking today mood after auth:', e);
        // fallback to redirecting to assessment
        router.push('/assessment');
      }
    } catch (e) {
      console.error('Error handling auth success:', e);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleMoodSelect = async (moodId: string) => {
    setSelectedMood(moodId);
    
    if (user) {
      await saveDailyMood(user.id, moodId as MoodType);
    }
    
    const gameRecommendations = getGameRecommendations(moodId as MoodType);
    setRecommendations(gameRecommendations);
  };

  useEffect(() => {
    // fetch top 3 popular games to display covers (admin-controlled)
    let mounted = true;
    const fetchPopular = async () => {
      try {
        const { data } = await supabase
          .from('games')
          .select('*')
          .eq('is_popular', true)
          .order('created_at', { ascending: false })
          .limit(3);
        if (!mounted) return;

        if (data && Array.isArray(data) && data.length > 0) {
          setPopularGames(data as any);
          return;
        }

        // Fallback (no pinned popular games yet): show well-known starter games,
        // still pulling from DB so admin cover_image_url reflects in the UI.
        const fallbackTitles = ['Box Breathing', 'Diaphragmatic Breathing', '4-7-8 Breathing'] as const;
        const { data: fallbackData } = await supabase
          .from('games')
          .select('*')
          .in('title', [...fallbackTitles]);

        if (!mounted) return;
        if (fallbackData && Array.isArray(fallbackData) && fallbackData.length > 0) {
          const order = new Map<string, number>(fallbackTitles.map((t, i) => [t, i]));
          const sorted = [...fallbackData].sort((a: any, b: any) => {
            const ai = order.get(a?.title) ?? 999;
            const bi = order.get(b?.title) ?? 999;
            return ai - bi;
          });
          setPopularGames(sorted as any);
        }
      } catch (e) {
        console.error('Failed to fetch popular games:', e);
      }
    };

    fetchPopular();
  }, []);

  const [popularGames, setPopularGames] = useState<Game[]>([]);

  const moods = [
    { id: 'stressed', label: 'Stressed', symbol: 'mood-stressed' },
    { id: 'sad', label: 'Sad', symbol: 'mood-sad' },
    { id: 'anxious', label: 'Anxious', symbol: 'mood-anxious' },
    { id: 'bored', label: 'Bored', symbol: 'mood-bored' },
    { id: 'happy', label: 'Happy', symbol: 'mood-happy' },
  ] as const;

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: string } = {
      brain: '🧠',
      'flower-2': '🌸',
      lightbulb: '💡',
      target: '🎯',
      heart: '❤️',
      'book-open': '📖',
    };
    return icons[iconName] || '🎮';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/20 to-accent/10">
      <StructuredData
        script={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "MoodLift - Home",
          "url": "https://your-production-url.example.com/",
          "description": "AI-powered wellness games to improve emotional well-being",
        }}
      />
      {/* FAQ structured data (sampleed from site FAQs) */}
      <StructuredData script={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How long does each activity take?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most activities take 3-15 minutes. Specific durations are displayed on each game card and in the detailed view."
            }
          },
          {
            "@type": "Question",
            "name": "What's the difference between breathing exercises and grounding techniques?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Breathing exercises focus on controlling your breath to calm the nervous system. Grounding techniques use sensory awareness to bring you into the present moment and reduce anxiety."
            }
          },
          {
            "@type": "Question",
            "name": "Can I practice activities multiple times?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! You can practice any activity as many times as you like. Regular practice enhances the benefits. We track your activity history in your dashboard."
            }
          }
        ]
      }} />
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl sm:text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                MoodLift
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleAssessmentClick}>
                <ClipboardList className="w-4 h-4 mr-2" />
                Mood Check
              </Button>
              {user && (
                <>
                  <Link href="/games">
                    <Button variant="ghost" size="sm">Games</Button>
                  </Link>
                  <Link href="/discover">
                    <Button variant="ghost" size="sm">Discover</Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">Dashboard</Button>
                  </Link>
                </>
              )}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E2DAF5' }}>
                        <UserIcon className="w-4 h-4" style={{ color: '#3C1F71' }} />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => setShowAuthModal(true)} size="sm" style={{ backgroundColor: '#3C1F71' }}>
                  Login
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 border-t">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sm"
                onClick={() => {
                  handleAssessmentClick();
                  setMobileMenuOpen(false);
                }}
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                Mood Check
              </Button>
              {user && (
                <>
                  <Link href="/games" className="block">
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      Games
                    </Button>
                  </Link>
                  <Link href="/discover" className="block">
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      Discover
                    </Button>
                  </Link>
                  <Link href="/dashboard" className="block">
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      Dashboard
                    </Button>
                  </Link>
                </>
              )}
              {user ? (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                    setShowAuthModal(true);
                    setMobileMenuOpen(false);
                  }} 
                  className="w-full text-sm"
                  style={{ backgroundColor: '#3C1F71' }}
                >
                  Login
                </Button>
              )}
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="text-center mb-8 sm:mb-12 md:mb-16 space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
            Transform Your Mood
            <br />
            One Game at a Time
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered wellness games designed to boost your emotional well-being and create lasting positive habits
          </p>
        </div>

        <div className="mb-8 sm:mb-12 md:mb-16">
          <h2 className="section-title font-semibold text-primary mb-6 text-center">
            {user ? (
              <>
                How are you feeling today?{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {isAdmin ? 'admin' : (user.user_metadata?.full_name || user.email?.split('@')[0] || 'there')}
                </span>
              </>
            ) : (
              'How are you feeling today?'
            )}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                className="bg-muted/70 hover:bg-muted border border-border rounded-3xl p-4 sm:p-5 transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-24 h-24 mx-auto" viewBox="0 0 53 53" aria-hidden="true">
                  <use href={`/track-your-mood.svg#${mood.symbol}`} width="53" height="53" />
                </svg>
                <p className="mt-2 text-base sm:text-lg font-semibold text-muted-foreground">{mood.label}</p>
              </button>
            ))}
          </div>
          {selectedMood && (
            <p className="text-center mt-6 text-primary font-medium animate-in fade-in duration-500">
              Great! Let’s find the perfect game to help you feel better
            </p>
          )}

          {recommendations.length > 0 && (
            <div className="mt-12 max-w-4xl mx-auto">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-6 text-center">Recommended for you</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((rec, idx) => (
                  <Link key={idx} href={rec.url}>
                    <Card className="border-2 cursor-pointer hover:shadow-lg transition-all h-full">
                      <CardHeader>
                        <div className="text-4xl mb-2">{rec.emoji}</div>
                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                        <p className="text-xs text-accent font-medium">✨ {rec.reason}</p>
                        <Button className="w-full sm:w-auto bg-gradient-to-r text-xs sm:text-sm md:text-base from-primary to-accent hover:opacity-90">
                          Play Now
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <QuoteCarousel />

        {/* Most Popular Activity Session */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="section-title font-bold text-primary mb-2">
              Most Popular Activities
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {popularGames.length > 0 ? (
              popularGames.slice(0, 3).map((g, idx) => {
                const slug = g.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

                const durationBySlug: Record<string, string | undefined> = {
                  'diaphragmatic-breathing': '5-10 min',
                  'four-seven-eight-breathing': '3-5 min',
                };

                const badge = durationBySlug[slug] ?? g.category;

                return (
                  <Link key={g.id} href={`/games/${slug}`} className="md:col-span-1">
                    <div className="bg-secondary/50 shadow-lg hover:shadow-xl transition-all h-full rounded-[32px] p-3">
                      <div className="bg-white rounded-[32px] overflow-hidden h-full flex flex-col min-h-[240px]">
                        <div className="relative h-[96px] bg-muted-foreground/15 flex items-center justify-center overflow-hidden">
                          {g.cover_image_url ? (
                            <img src={g.cover_image_url} alt={g.title} className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                            <span className="text-6xl" aria-hidden>
                              {getIconComponent(g.icon)}
                            </span>
                          )}
                        </div>

                        <div className="px-6 pb-6 pt-3 flex-1 flex flex-col gap-3">
                          <h3 className="line-clamp-2 capitalize text-[18px] sm:text-[20px] md:text-[22px] font-semibold leading-[1.2] text-[#450BC8] text-center">
                            {g.title}
                          </h3>
                          <p className="text-sm text-primary/60 leading-relaxed line-clamp-4">{g.description}</p>

                          <div className="mt-auto pt-3 flex justify-center">
                            <Button className="w-[120px] h-[32px] px-0 rounded-full bg-primary text-white hover:bg-primary/90 text-sm font-semibold leading-none">
                              Start Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              // fallback static content if no popular games set
              <>
                <Link href="/games/box-breathing" className="md:col-span-1">
                  <div className="bg-secondary/50 shadow-lg hover:shadow-xl transition-all h-full rounded-[32px] p-3">
                    <div className="bg-white rounded-[32px] overflow-hidden h-full flex flex-col min-h-[240px]">
                      <div className="relative h-[96px] bg-muted-foreground/15 flex items-center justify-center overflow-hidden">
                        <span className="text-6xl" aria-hidden>
                          🫁
                        </span>
                      </div>

                      <div className="px-6 pb-6 pt-3 flex-1 flex flex-col gap-3">
                        <h3 className="line-clamp-2 capitalize text-[18px] sm:text-[20px] md:text-[22px] font-semibold leading-[1.2] text-[#450BC8] text-center">
                          Box Breathing
                        </h3>
                        <p className="text-sm text-primary/60 leading-relaxed line-clamp-4">A simple breathing technique supported by CBT principles to help reduce stress.</p>
                        <div className="mt-auto pt-3 flex justify-center">
                          <Button className="w-[120px] h-[32px] px-0 rounded-full bg-primary text-white hover:bg-primary/90 text-sm font-semibold leading-none">
                            Start Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/games/diaphragmatic-breathing" className="md:col-span-1">
                  <div className="bg-secondary/50 shadow-lg hover:shadow-xl transition-all h-full rounded-[32px] p-3">
                    <div className="bg-white rounded-[32px] overflow-hidden h-full flex flex-col min-h-[240px]">
                      <div className="relative h-[96px] bg-muted-foreground/15 flex items-center justify-center overflow-hidden">
                        <span className="text-6xl" aria-hidden>
                          💨
                        </span>
                      </div>

                      <div className="px-6 pb-6 pt-3 flex-1 flex flex-col gap-3">
                        <h3 className="line-clamp-2 capitalize text-[18px] sm:text-[20px] md:text-[22px] font-semibold leading-[1.2] text-[#450BC8] text-center">
                          Diaphragmatic Breathing
                        </h3>
                        <p className="text-sm text-primary/60 leading-relaxed line-clamp-4">Deep belly breathing that activates your parasympathetic nervous system for instant calm.</p>
                        <div className="mt-auto pt-3 flex justify-center">
                          <Button className="w-[120px] h-[32px] px-0 rounded-full bg-primary text-white hover:bg-primary/90 text-sm font-semibold leading-none">
                            Start Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/games/four-seven-eight-breathing" className="md:col-span-1">
                  <div className="bg-secondary/50 shadow-lg hover:shadow-xl transition-all h-full rounded-[32px] p-3">
                    <div className="bg-white rounded-[32px] overflow-hidden h-full flex flex-col min-h-[240px]">
                      <div className="relative h-[96px] bg-muted-foreground/15 flex items-center justify-center overflow-hidden">
                        <span className="text-6xl" aria-hidden>
                          🌙
                        </span>
                      </div>

                      <div className="px-6 pb-6 pt-3 flex-1 flex flex-col gap-3">
                        <h3 className="line-clamp-2 capitalize text-[18px] sm:text-[20px] md:text-[22px] font-semibold leading-[1.2] text-[#450BC8] text-center">
                          4-7-8 Breathing
                        </h3>
                        <p className="text-sm text-primary/60 leading-relaxed line-clamp-4">The famous 4-7-8 technique for anxiety relief and better sleep.</p>
                        <div className="mt-auto pt-3 flex justify-center">
                          <Button className="w-[120px] h-[32px] px-0 rounded-full bg-primary text-white hover:bg-primary/90 text-sm font-semibold leading-none">
                            Start Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>

        <Card className="mb-12 overflow-hidden rounded-[24px] border-2 border-secondary/60 bg-secondary/15">
          <CardContent className="p-4 sm:p-5 md:p-7">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <div className="flex items-start gap-5 flex-1">
                <div className="shrink-0 w-[72px] h-[72px] rounded-[20px] bg-primary flex items-center justify-center">
                  <ClipboardList className="w-8 h-8 text-white" aria-hidden />
                </div>

                <div className="min-w-0">
                  <h2 className="section-title font-bold text-primary leading-tight">
                    Confused About Your Mental State?
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Take a short scientifically validated assessment to get clarity on your mood, stress, or anxiety.
                  </p>
                </div>
              </div>

              <div className="w-full md:w-auto md:ml-auto">
                <Button
                  className="w-full md:w-auto h-10 sm:h-12 rounded-full px-8 bg-primary hover:bg-primary/90 text-sm sm:text-base font-semibold"
                  onClick={handleAssessmentClick}
                >
                  Start Assessment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <ConsultantCarousel />

        <div className="mt-12 sm:mt-16 md:mt-24">
          <div className="text-center mb-12">
            <h2 className="section-title font-bold text-primary mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of people improving their mental wellness with MoodLift
            </p>
          </div>
          <TestimonialCarousel />
        </div>

        <div className="mb-16">
          <FAQSection
            title="Frequently Asked Questions"
            items={[
              {
                question: "What is MoodLift?",
                answer: "MoodLift is an AI-powered emotional wellness platform that combines psychometric assessments, therapeutic games, breathing exercises, and personalized recommendations to support your mental health journey."
              },
              {
                question: "How accurate are the mood assessments?",
                answer: "Our assessments use validated psychometric scales (PHQ-9, GAD-7, PANAS-SF) developed by leading mental health researchers. These are the same tools used in clinical settings worldwide."
              },
              {
                question: "Are the games scientifically backed?",
                answer: "Yes! All our games and activities are based on evidence-based therapeutic techniques like CBT, MBSR, DBT, and somatic practices. Each game comes with detailed information about its mood benefits."
              },
              {
                question: "Is my data secure and private?",
                answer: "Absolutely. We use enterprise-grade encryption, secure servers, and comply with GDPR and data protection regulations. Your personal data is never shared with third parties."
              },
              {
                question: "Can I use MoodLift as a replacement for therapy?",
                answer: "MoodLift is designed to complement, not replace, professional mental health treatment. If you're experiencing a mental health crisis, please reach out to a healthcare professional or crisis helpline immediately."
              },
              {
                question: "How do I pin my favorite games?",
                answer: "Simply click the pin icon on any game card to save it to your favorites. Your pinned games appear in the 'Your Favorites' section for quick access."
              }
            ]}
          />
        </div>
      </main>

      <AppFooter />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      <GoogleSignInPopup />
    </div>
  );
}
