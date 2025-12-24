'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useRewards } from '@/hooks/use-rewards';
import { rewardsService } from '@/lib/rewards-service';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Star, Trophy, Zap, Target } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { AppFooter } from '@/components/app-footer';

export default function RewardsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { totalPoints, badges, currentMilestone, nextMilestone, loading } = useRewards();
  const [allBadges, setAllBadges] = useState<any[]>([]);
  const [allMilestones, setAllMilestones] = useState<any[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadBadgesAndMilestones = async () => {
      try {
        const badgesData = await rewardsService.getAllBadges();
        const milestonesData = await rewardsService.getAllMilestones();
        setAllBadges(badgesData);
        setAllMilestones(milestonesData);
      } catch (error) {
        console.error('Error loading badges and milestones:', error);
      }
    };

    loadBadgesAndMilestones();
  }, []);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-primary rounded-full"></div>
        </div>
      </div>
    );
  }

  const earnedBadgeIds = new Set(badges.map((b: any) => b.badge.id));
  const progressPercent = nextMilestone
    ? Math.min(100, ((totalPoints - (currentMilestone?.points_threshold || 0)) / (nextMilestone.points_threshold - (currentMilestone?.points_threshold || 0))) * 100)
    : 100;

  return (
    <>
    <main className="min-h-screen bg-gradient-to-br from-white via-[#F8F7FF] to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-primary" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Rewards Center</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-lg">Track your progress and unlock achievements</p>
        </div>

        {/* Total Points Card */}
        <div className="mb-12 animate-fade-in">
          <Card className="border-2 border-secondary/80 bg-gradient-to-r from-primary to-secondary shadow-lg overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8 sm:p-12">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium mb-2">Total Reward Points</p>
                  <p className="text-5xl sm:text-6xl font-bold text-white">{totalPoints}</p>
                </div>
                <Star className="w-20 h-20 sm:w-24 sm:h-24 text-white/20 animate-bounce" />
              </div>
            </div>
          </Card>
        </div>

        {/* Current Milestone Section */}
        {currentMilestone && (
          <div className="mb-12 animate-fade-in">
            <Card className="border-2 border-secondary/80 shadow-lg bg-white dark:bg-slate-800">
              <div className="p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-primary" />
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Current Milestone</h2>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">{currentMilestone.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{currentMilestone.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">{currentMilestone.level}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Level</p>
                    </div>
                  </div>

                  {nextMilestone && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Progress to next milestone</span>
                        <span className="text-sm font-semibold text-primary">{totalPoints} / {nextMilestone.points_threshold}</span>
                      </div>
                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                        {nextMilestone.points_threshold - totalPoints} points to reach {nextMilestone.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* All Milestones */}
        <div className="mb-12 animate-fade-in">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <Zap className="w-6 h-6 text-primary" />
            Milestone Journey
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {allMilestones.map((milestone, index) => {
              const isReached = totalPoints >= milestone.points_threshold;
              return (
                <Card
                  key={milestone.id}
                  className={`border-2 border-secondary/80 transition-all duration-300 transform hover:scale-105 ${
                    isReached
                      ? 'bg-gradient-to-br from-primary to-secondary shadow-lg'
                      : 'bg-slate-100 dark:bg-slate-800 opacity-50'
                  }`}
                >
                  <div className="p-6 text-center">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                        isReached ? 'bg-white/20' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <Trophy
                        className={`w-6 h-6 ${isReached ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}
                      />
                    </div>
                    <p className={`font-bold text-lg mb-1 ${isReached ? 'text-white' : 'text-slate-900 dark:text-slate-200'}`}>
                      {milestone.name}
                    </p>
                    <p className={`text-sm ${isReached ? 'text-white/80' : 'text-slate-600 dark:text-slate-500'}`}>
                      {milestone.points_threshold} pts
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Badges Section */}
        <div className="animate-fade-in">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <Star className="w-6 h-6 text-primary" />
            Badges & Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allBadges.map((badge) => {
              const isEarned = earnedBadgeIds.has(badge.id);
              const earnedBadge = badges.find((b: any) => b.badge.id === badge.id);

              return (
                <Card
                  key={badge.id}
                  className={`border-2 border-secondary/80 transition-all duration-300 overflow-hidden group hover:shadow-lg transform ${
                    isEarned ? 'bg-white dark:bg-slate-800' : 'bg-slate-100 dark:bg-slate-800 opacity-60'
                  }`}
                >
                  <div className="p-6">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 group-hover:scale-110 transition-transform ${
                        isEarned
                          ? 'bg-gradient-to-br from-primary to-secondary'
                          : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <Star
                        className={`w-8 h-8 ${
                          isEarned ? 'text-white fill-white' : 'text-slate-600 dark:text-slate-500'
                        }`}
                      />
                    </div>

                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{badge.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{badge.description}</p>

                    <div className="flex items-center justify-between">
                      <Badge
                        variant={isEarned ? 'default' : 'outline'}
                        className={
                          isEarned
                            ? 'bg-primary text-white'
                            : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400'
                        }
                      >
                        {badge.points_required} pts
                      </Badge>
                      {isEarned && (
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          Earned {new Date(earnedBadge?.earned_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </main>
    <AppFooter />
  </>
  );
}
