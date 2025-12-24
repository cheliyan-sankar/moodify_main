'use client';

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Play } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { useFavorites } from '@/lib/favorites-context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';

type Game = {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  color_from: string;
  color_to: string;
  cover_image_url?: string;
};

type GameDetails = {
  moodBenefits: string[];
  duration: string;
  howItHelps: string;
  gameUrl: string;
};

const gameDetailsMap: Readonly<{ [key: string]: GameDetails }> = {
  'Diaphragmatic Breathing': {
    moodBenefits: ['Reduces Stress', 'Improves Focus', 'Enhances Relaxation'],
    duration: '5-10 minutes',
    howItHelps: 'Deep belly breathing technique to reduce stress and anxiety naturally.',
    gameUrl: '/games/diaphragmatic-breathing'
  },
  'Box Breathing': {
    moodBenefits: ['Calms Mind', 'Reduces Anxiety', 'Improves Concentration'],
    duration: '4-8 minutes',
    howItHelps: 'Navy SEAL breathing technique for staying calm under pressure with 4-4-4-4 pattern.',
    gameUrl: '/games/box-breathing'
  },
  '4-7-8 Breathing': {
    moodBenefits: ['Promotes Better Sleep', 'Reduces Anxiety', 'Calms the Nervous System'],
    duration: '2-3 minutes',
    howItHelps: 'The famous 4-7-8 breathing technique popularized by Dr. Andrew Weil is a simple yet powerful method for anxiety relief and better sleep. By following the pattern of inhale for 4 seconds, hold for 7 seconds, and exhale for 8 seconds, you activate your parasympathetic nervous system and experience deep relaxation.',
    gameUrl: '/games/4-7-8-breathing'
  },
  'Alternate Nostril Breathing': {
    moodBenefits: ['Balances Brain Hemispheres', 'Promotes Deep Relaxation', 'Enhances Mental Clarity'],
    duration: '5-10 minutes',
    howItHelps: 'This ancient yogic breathing technique alternates airflow between nostrils to balance the left and right brain hemispheres. By harmonizing your nervous system, it reduces stress, improves focus, and creates a profound sense of calm and mental clarity.',
    gameUrl: '/games/alternate-nostril-breathing'
  },
  'Describe Your Room': {
    moodBenefits: ['Improves Presence', 'Grounds in Reality', 'Enhances Sensory Awareness'],
    duration: '1-2 minutes',
    howItHelps: 'Use mindfulness to anchor yourself in the present moment by describing your surroundings in detail. This grounding technique helps redirect anxious thoughts and brings you into the here-and-now through sensory awareness.',
    gameUrl: '/games/describe-room'
  },
  'Name the Moment': {
    moodBenefits: ['Builds Self-Compassion', 'Reduces Emotional Overwhelm', 'Strengthens Inner Resilience'],
    duration: '2-3 minutes',
    howItHelps: 'This guided self-reassurance exercise helps you acknowledge difficult emotions with kindness and compassion. By speaking affirmations and reassurances to yourself, you rewire your nervous system to respond to stress with self-support instead of self-criticism, building lasting emotional resilience.',
    gameUrl: '/games/name-the-moment'
  },
  'Physical Grounding': {
    moodBenefits: ['Anchors You in Your Body', 'Releases Trauma Responses', 'Activates Safety Signals'],
    duration: '5-10 minutes',
    howItHelps: 'Engage your five senses through tactile and physical experiences to bring you fully into the present moment. This somatic grounding technique interrupts the stress response cycle by signaling to your nervous system that you are safe, helping you move out of fight-or-flight mode into calm awareness.',
    gameUrl: '/games/physical-grounding'
  },
  'Posture Reset': {
    moodBenefits: ['Releases Physical Tension', 'Improves Body Awareness', 'Restores Natural Alignment'],
    duration: '1-1.5 minutes',
    howItHelps: 'Your body and mind are deeply connected. By intentionally adjusting your posture and releasing tension through gentle movements, you signal to your nervous system that you are safe and grounded. This practice helps you reclaim your physical presence and mental clarity.',
    gameUrl: '/games/posture-reset'
  },
  'Self-Soothing': {
    moodBenefits: ['Soothes Emotional Pain', 'Provides Immediate Relief', 'Builds Distress Tolerance'],
    duration: '5-10 minutes',
    howItHelps: 'Drawing from Dialectical Behavior Therapy (DBT), this technique teaches you to soothe yourself through multisensory engagement. By intentionally activating your senses—touch, smell, taste, sight, sound—you create a safe container for emotional pain and build your capacity to tolerate distressing moments.',
    gameUrl: '/games/self-soothing'
  },
  'CBT Thought-Challenger': {
    moodBenefits: ['Challenges Negative Thinking', 'Reduces Anxiety', 'Builds Emotional Resilience'],
    duration: '10-15 minutes',
    howItHelps: 'Using Cognitive Behavioral Therapy techniques, challenge automatic negative thoughts by examining the evidence for and against them. Develop balanced, realistic perspectives that reduce anxiety, low mood, and self-criticism through cognitive restructuring.',
    gameUrl: '/games/cbt-thought-challenger'
  },
  'Affirmation Mirror': {
    moodBenefits: ['Boosts Self-Esteem', 'Builds Self-Compassion', 'Reduces Negative Self-Talk'],
    duration: '5-10 minutes',
    howItHelps: 'Transform negative self-talk into powerful, personalized affirmations that rewire your brain toward self-compassion. By mirroring empowering statements back to yourself, you create new neural pathways that support lasting confidence, resilience, and emotional wellbeing.',
    gameUrl: '/games/affirmation-mirror'
  },
  'Worry Box': {
    moodBenefits: ['Reduces Mental Clutter', 'Prevents Rumination', 'Increases Emotional Control'],
    duration: '3-5 minutes',
    howItHelps: 'Externalize your worries by placing them somewhere safe—outside your mind. This CBT-based technique helps your brain interpret the worry as "stored and contained," reducing its emotional intensity. When worries feel infinite in your head, simply writing them down and placing them away creates essential psychological distance.',
    gameUrl: '/games/worry-box'
  }
};

function GameCover({ src, title, wrapperClass = '', imgClass = '', action }: { src?: string; title?: string; wrapperClass?: string; imgClass?: string; action?: React.ReactNode }) {
  const [failed, setFailed] = useState(false);

  // Make the wrapper relative so `action` can be absolutely positioned inside it
  const baseWrapper = `${wrapperClass} relative`;

  if (src && !failed) {
    return (
      <div className={baseWrapper}>
        <img
          src={src}
          alt={title}
          className={imgClass}
          onError={() => setFailed(true)}
        />
        {action}
      </div>
    );
  }

  return (
    <div className={`${baseWrapper} bg-gray-100 flex items-center justify-center`}>
      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-600">
        {title ? title.charAt(0).toUpperCase() : 'G'}
      </div>
      {action}
    </div>
  );
}

export function GamesSection() {
  const { user } = useAuth();
  const { favoritesSet, toggleFavorite } = useFavorites();
  const [games, setGames] = useState<Game[]>([]);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchGames();
  }, [user]);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  // Favorites are managed via `useFavorites()` context (favoritesSet, toggleFavorite)

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

  const parseColorFromString = (colorStr: string): string => {
    if (colorStr.startsWith('#')) {
      return colorStr;
    }
    // Handle Tailwind color names
    const tailwindColors: { [key: string]: string } = {
      'violet-400': '#a78bfa', 'violet-500': '#8b5cf6',
      'purple-400': '#c084fc', 'purple-500': '#a855f7',
      'pink-400': '#f472b6', 'pink-500': '#ec4899',
      'rose-400': '#fb7185', 'rose-500': '#f43f5e',
      'red-400': '#f87171', 'red-500': '#ef4444',
      'orange-400': '#fb923c', 'orange-500': '#f97316',
      'amber-400': '#fbbf24', 'amber-500': '#f59e0b',
      'yellow-400': '#facc15', 'yellow-500': '#eab308',
      'lime-400': '#a3e635', 'lime-500': '#84cc16',
      'green-400': '#4ade80', 'green-500': '#22c55e',
      'emerald-400': '#34d399', 'emerald-500': '#10b981',
      'teal-400': '#2dd4bf', 'teal-500': '#14b8a6',
      'cyan-400': '#22d3ee', 'cyan-500': '#06b6d4',
      'blue-400': '#60a5fa', 'blue-500': '#3b82f6',
      'indigo-400': '#818cf8', 'indigo-500': '#6366f1',
      'stone-400': '#a1a1aa', 'stone-500': '#71717a',
    };
    return tailwindColors[colorStr] || '#9b87f5';
  };

  const handleCardClick = useCallback((game: Game) => {
    setSelectedGame(game);
    setIsDialogOpen(true);
  }, []);

  const getGameDetails = useCallback((gameTitle: string): GameDetails => {
    return gameDetailsMap[gameTitle] || {
      moodBenefits: ['Improves Wellbeing', 'Reduces Stress', 'Enhances Mood'],
      duration: '5-10 minutes',
      howItHelps: 'This activity is designed to support your emotional wellness and mental health.',
      gameUrl: '/games/mindful-moments'
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="border-2 animate-pulse">
            <div className="h-32 sm:h-40 bg-gray-200 rounded-t-lg" />
            <CardContent className="p-4 sm:p-6">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilterCategory(null)}
          className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${filterCategory === null ? 'bg-primary text-white border-primary' : 'bg-white/60 text-primary border-gray-200'}`}
        >
          All
        </button>
        {Array.from(new Set(games.map(g => g.category))).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${filterCategory === cat ? 'bg-primary text-white border-primary' : 'bg-white/60 text-primary border-gray-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {(filterCategory ? games.filter(g => g.category === filterCategory) : games).map((game, index) => {
          const isPinned = favoritesSet.has(game.id);
          const colorFrom = game.color_from || (game as any).colors?.split('-')[0] || '#9b87f5';
          const colorTo = game.color_to || (game as any).colors?.split('-')[1] || '#7c3aed';
          const parsedFrom = parseColorFromString(colorFrom);
          const parsedTo = parseColorFromString(colorTo);
          
          return (
            <Card
              key={game.id}
              className="group relative w-full max-w-[420px] aspect-square rounded-[24px] bg-white border-2 border-secondary/80 shadow-[0_8px_16px_rgba(75,52,37,0.05)] overflow-hidden animate-in fade-in-50 slide-in-from-bottom-4 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleCardClick(game)}
            >
              <div className="flex h-full flex-col p-4 sm:p-5">
                <div className="relative h-[46%] w-full overflow-hidden rounded-[24px] bg-[#D9D9D9]">
                  <GameCover
                    src={game.cover_image_url}
                    title={game.title}
                    wrapperClass="h-full w-full"
                    imgClass="h-full w-full object-cover"
                    action={(
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={!user}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!user) return;
                          toggleFavorite(game.id, 'game');
                        }}
                        className="absolute right-3 top-3 z-20 h-9 w-9 rounded-full bg-transparent p-0 hover:bg-transparent focus-visible:ring-0"
                        aria-label={isPinned ? 'Unpin game' : 'Pin game'}
                      >
                        <Heart
                          className={`h-7 w-7 sm:h-8 sm:w-8 ${isPinned ? 'text-red-500' : 'text-[#D9D9D9]'}`}
                          style={{
                            fill: 'currentColor',
                            stroke: 'none',
                            opacity: user ? 1 : 0.6,
                          }}
                        />
                      </Button>
                    )}
                  />
                </div>

                <div className="mt-[11px]">
                  <h3 className="line-clamp-2 text-[18px] sm:text-[20px] md:text-[22px] font-semibold leading-[1.2] text-primary">
                    {game.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-[12px] sm:text-[13px] leading-[1.35] text-[rgba(31,22,15,0.64)]">
                    {game.description}
                  </p>
                </div>

                <div className="mt-auto flex items-end justify-between pt-3">
                  <span className="text-[12px] sm:text-[13px] font-semibold text-primary">
                    {game.category}
                  </span>
                  <Button
                    size="sm"
                    className="h-8 sm:h-9 w-[120px] sm:w-[140px] rounded-[16px] bg-primary px-0 text-[11px] sm:text-[12px] font-semibold text-white hover:bg-primary/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(game);
                    }}
                  >
                    PLAY NOW
                  </Button>
                </div>
              </div>
          </Card>
        );
      })}
    </div>

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="w-[90vw] max-w-3xl max-h-[90vh] overflow-y-auto">
        {selectedGame && (() => {
          const dialogColorFrom = selectedGame.color_from || (selectedGame as any).colors?.split('-')[0] || '#9b87f5';
          const dialogColorTo = selectedGame.color_to || (selectedGame as any).colors?.split('-')[1] || '#7c3aed';
          const dialogParsedFrom = parseColorFromString(dialogColorFrom);
          const dialogParsedTo = parseColorFromString(dialogColorTo);
          
          return (
          <>
            <DialogHeader>
              <GameCover
                src={selectedGame.cover_image_url}
                title={selectedGame.title}
                wrapperClass="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl mx-auto mb-4 overflow-hidden"
                imgClass="w-full h-full object-cover rounded-2xl"
              />
              <DialogTitle className="text-2xl sm:text-3xl text-center line-clamp-2" style={{ color: '#3C1F71' }}>
                {selectedGame.title}
              </DialogTitle>
              <DialogDescription className="text-center text-sm sm:text-base">
                {selectedGame.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 sm:space-y-6 py-4">
              <div>
                <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3" style={{ color: '#3C1F71' }}>
                  How This Lifts Your Mood
                </h4>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {getGameDetails(selectedGame.title).howItHelps}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3" style={{ color: '#3C1F71' }}>
                  Mood Benefits
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getGameDetails(selectedGame.title).moodBenefits.map((benefit, idx) => (
                    <span
                      key={idx}
                      className="px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium border-2"
                      style={{
                        borderColor: dialogParsedFrom,
                        color: dialogParsedFrom,
                        backgroundColor: `${dialogParsedFrom}10`,
                      }}
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg" style={{ backgroundColor: '#E2DAF5' }}>
                <div>
                  <p className="text-xs sm:text-sm font-medium" style={{ color: '#3C1F71' }}>Duration</p>
                  <p className="text-sm sm:text-lg font-bold" style={{ color: '#3C1F71' }}>
                    {getGameDetails(selectedGame.title).duration}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium" style={{ color: '#3C1F71' }}>Category</p>
                  <p className="text-sm sm:text-lg font-bold truncate" style={{ color: '#3C1F71' }}>
                    {selectedGame.category}
                  </p>
                </div>
              </div>

              <div className="pt-4 sm:pt-6">
                <Link href={getGameDetails(selectedGame.title).gameUrl} className="w-full">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r text-xs sm:text-sm md:text-base from-primary to-accent hover:opacity-90 transition-opacity py-4 sm:py-6"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Start Playing Now
                  </Button>
                </Link>
              </div>
            </div>
          </>
          );
        })()}
      </DialogContent>
    </Dialog>
    </>
  );
}
