'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Sparkles, Filter } from 'lucide-react';
import Link from 'next/link';
import { MoodBasedBooks } from '@/components/mood-based-books';
import { AppFooter } from '@/components/app-footer';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { SiteHeader } from '@/components/site-header';
import StructuredData from '@/components/structured-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function BooksPage() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [latestMood, setLatestMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ DECLARE CALLBACK FIRST
  const fetchLatestMoodAssessment = useCallback(async () => {
    if (!supabase || !user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('mood_assessments')
        .select('mood_result, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.mood_result) {
        setLatestMood(data.mood_result);
        setSelectedMood(data.mood_result);
      }
    } catch (error) {
      console.error('Error fetching mood assessment:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ✅ USE EFFECT AFTER CALLBACK
  useEffect(() => {
    if (user) {
      fetchLatestMoodAssessment();
    } else {
      setLoading(false);
    }
  }, [user, fetchLatestMoodAssessment]);

  const moodOptions = [
    { value: 'all', label: 'All Books' },
    { value: 'Excellent', label: 'For Excellent Mood' },
    { value: 'Good', label: 'For Good Mood' },
    { value: 'Moderate', label: 'For Moderate Mood' },
    { value: 'Needs Support', label: 'For Extra Support' },
  ];

  const getMoodDescription = (mood: string) => {
    const descriptions: Record<string, string> = {
      Excellent: 'Books to maintain your positive momentum and inspire continued growth',
      Good: 'Practical reads to help you build on your current well-being',
      Moderate: 'Supportive books with coping strategies and gentle guidance',
      'Needs Support': 'Therapeutic and healing-focused reads for difficult times',
      all: 'Explore our complete collection of mental health and self-improvement books',
    };
    return descriptions[mood] || descriptions.all;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/20 to-accent/10">
      <StructuredData
        script={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Book Recommendations - MoodLift",
          "description": "Discover personalized book recommendations based on your mood and emotional state for better mental health and well-being.",
          "url": "https://moodlift.com/books",
          "publisher": {
            "@type": "Organization",
            "name": "MoodLift",
            "url": "https://moodlift.com"
          }
        }}
      />
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="text-center mb-12">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3C1F71, #5B3A8F)' }}
          >
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-primary mb-4">
            Personalized Book Recommendations
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Curated reading suggestions based on your emotional well-being
          </p>
        </div>

        {latestMood && !loading && (
          <Card className="mb-8 border-2 bg-gradient-to-br from-accent/5 to-primary/5">
            <CardContent className="p-6 flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #3C1F71, #5B3A8F)' }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-1">
                  Based on Your Recent Mood Assessment
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your mood was <span className="font-semibold">{latestMood}</span>.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8 border-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-accent" />
                Filter by Mood
              </CardTitle>
              <Select value={selectedMood} onValueChange={setSelectedMood}>
                <SelectTrigger className="w-full sm:w-[280px]">
                  <SelectValue placeholder="Select mood category" />
                </SelectTrigger>
                <SelectContent>
                  {moodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {getMoodDescription(selectedMood)}
            </p>
          </CardContent>
        </Card>

        <MoodBasedBooks
          moodResult={selectedMood === 'all' ? undefined : selectedMood}
          showAll={selectedMood === 'all'}
          limit={12}
        />
      </main>

      <AppFooter />
    </div>
  );
}
