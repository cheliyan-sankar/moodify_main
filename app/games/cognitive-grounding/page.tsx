'use client';

import { useState, useEffect } from 'react';
import { AppFooter } from "@/components/app-footer";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useVoiceGuide } from '@/hooks/use-breathing-guide';
import { useBackgroundMusic } from '@/hooks/use-background-music';

export default function CognitiveGrounding() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const { speak, stop } = useVoiceGuide();
  useBackgroundMusic(true, 0.25);

  // Stop voice when voice is disabled
  useEffect(() => {
    if (!voiceEnabled) {
      stop();
    }
  }, [voiceEnabled, stop]);

  // Stop voice when game is paused
  useEffect(() => {
    if (!isRunning) {
      stop();
    }
  }, [isRunning, stop]);

  const steps = [
    {
      title: 'Welcome',
      instruction: 'Get ready to ground yourself in this moment.',
      voiceOver: 'Take a slow breath in… and gently exhale. We\'ll move through a few grounding steps together. Just follow along at your own pace.',
      duration: 8,
    },
    {
      title: 'Name 5 Places',
      instruction: 'Think of 5 places where you feel safe or happy.',
      voiceOver: 'First, think of five places where you feel safe or happy. Picture each one clearly in your mind, one at a time. Notice their details — the environment, the lighting, the feeling of being there.',
      duration: 20,
    },
    {
      title: 'Backward Counting',
      instruction: 'Count backward from 100 by 7s or from 20.',
      voiceOver: 'Now begin counting backward. You can count down from one hundred by sevens… or simply count backward from twenty. Move slowly and steadily.',
      duration: 20,
    },
    {
      title: 'Describe Your Surroundings',
      instruction: 'Use the 5-4-3-2-1 technique. Name what you sense.',
      voiceOver: 'Next, bring your attention to your surroundings using the 5-4-3-2-1 method. Name five things you can see. Now, four things you can touch. Next, three sounds you can hear. Now, two smells you can recognize. And finally, one taste or sensation in your mouth.',
      duration: 20,
    },
    {
      title: 'Mental Alphabet Game',
      instruction: 'Think of cities, animals, foods starting with each letter.',
      voiceOver: 'Now choose a category — animals, cities, foods, or names. Move through the alphabet, thinking of one example for each letter. There\'s no rush — just move steadily from one letter to the next.',
      duration: 20,
    },
    {
      title: 'Anchor to Now',
      instruction: 'Feel the warmth and presence of this moment.',
      voiceOver: 'Finally, rest one hand gently on your chest. Feel the warmth, the weight, the contact. Notice that you are right here, in this moment. Take one last slow breath in… and release it gently.',
      duration: 10,
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && currentStep < steps.length) {
      const step = steps[currentStep];

      if (timeLeft === 0) {
        setTimeLeft(step.duration);
        if (voiceEnabled) {
          speak((step as any).voiceOver || step.instruction);
        }
      } else {
        interval = setInterval(() => {
          setTimeLeft(t => {
            if (t === 1) {
              setCurrentStep(prev => {
                if (prev + 1 < steps.length) {
                  return prev + 1;
                } else {
                  setIsRunning(false);
                  if (voiceEnabled) {
                    speak('Cognitive grounding exercise complete. You are calm, clear, and grounded.');
                  }
                  return prev;
                }
              });
              return 0;
            }
            return t - 1;
          });
        }, 1000);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentStep, steps, voiceEnabled, speak]);


  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setTimeLeft(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start justify-start mb-4">
            <Button onClick={() => router.back()} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg text-xs sm:text-sm">
              Back
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-2">Cognitive Grounding</h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">A <span className="font-bold">Cognitive Behavioral Therapy–backed mental exercise approach</span> that redirects anxious thoughts through focused tasks and mindfulness, anchoring you in the present moment.</p>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-2 border-indigo-200">
          <CardContent className="p-12">
            {/* Animation */}
            <div className="flex justify-center mb-12">
              <div className="w-40 h-40 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-4 border-2 border-indigo-400 rounded-lg" />
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600">{timeLeft}</div>
                  <div className="text-sm text-indigo-700 mt-2">seconds</div>
                </div>
              </div>
            </div>

            {/* Voice Over Script */}
            {isRunning && currentStep < steps.length && (
              <div className="mb-8 text-center">
                <p className="text-gray-700 italic leading-relaxed max-w-2xl mx-auto">
                  {(steps[currentStep] as any).voiceOver || steps[currentStep].instruction}
                </p>
              </div>
            )}

            {/* Current Step */}
            {(isRunning || currentStep >= steps.length) && (
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-primary mb-2">
                  {isRunning && currentStep < steps.length
                    ? steps[currentStep].title
                    : '✓ Complete'}
                </h2>
              </div>
            )}


            {/* Controls */}
            <div className="flex gap-2 sm:gap-4 justify-center items-center mb-8 flex-wrap">
              <Button
                onClick={() => setIsRunning(!isRunning)}
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 flex-1 sm:flex-none min-w-fit"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </>
                )}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="flex-1 sm:flex-none min-w-fit"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                variant={voiceEnabled ? 'default' : 'outline'}
                size="lg"
                className="sm:flex-none"
              >
                {voiceEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Information Section */}
            <div className="max-w-2xl mx-auto pt-12 border-t border-indigo-200">
              <div className="space-y-8">
                {/* What is Cognitive Grounding */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Cognitive Grounding?</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Cognitive grounding is a powerful mindfulness and cognitive behavioral therapy (CBT) technique that uses mental exercises to anchor you in the present moment. When anxiety or stress tries to pull you away, cognitive grounding redirects your focus through engaging mental challenges that activate different areas of your brain, effectively interrupting anxious thought patterns and restoring mental clarity.
                  </p>
                </div>

                {/* How It Works */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
                  <div className="space-y-3 text-gray-700">
                    <p className="leading-relaxed">
                      <span className="font-semibold text-indigo-600">Name 5 Places (20 seconds):</span> Think of 5 places where you feel safe or happy. This taps into your memory and creates positive mental associations.
                    </p>
                    <p className="leading-relaxed">
                      <span className="font-semibold text-indigo-600">Backward Counting (20 seconds):</span> Count backward from 100 by 7s or count down from 20. This engages your logical brain and requires focus, interrupting anxious thoughts.
                    </p>
                    <p className="leading-relaxed">
                      <span className="font-semibold text-indigo-600">Describe Your Surroundings (20 seconds):</span> Use the 5-4-3-2-1 technique: name 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, 1 thing you taste. This grounds you in the present moment.
                    </p>
                    <p className="leading-relaxed">
                      <span className="font-semibold text-indigo-600">Mental Alphabet Game (20 seconds):</span> Think of cities, animals, foods, or names starting with each letter of the alphabet. This keeps your mind actively engaged and away from worry.
                    </p>
                    <p className="leading-relaxed">
                      <span className="font-semibold text-indigo-600">Anchor to Now (10 seconds):</span> A closing affirmation that reinforces your sense of safety and control in the present moment.
                    </p>
                  </div>
                </div>

                {/* Benefits & Mood Uplift */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits & Mood Uplift</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="font-semibold text-indigo-700 mb-2">✨ Interrupts Anxiety</p>
                      <p className="text-gray-700 text-sm">Breaks the cycle of anxious thoughts by engaging your mind in focused tasks that redirect attention away from worry.</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="font-semibold text-indigo-700 mb-2">🧠 Sharpens Focus</p>
                      <p className="text-gray-700 text-sm">Mental exercises strengthen concentration and cognitive function, leaving you feeling mentally clear and capable.</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="font-semibold text-indigo-700 mb-2">⚓ Grounds in Present</p>
                      <p className="text-gray-700 text-sm">Anchors you firmly in the here-and-now, away from past regrets or future worries, creating a sense of safety and control.</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="font-semibold text-indigo-700 mb-2">😊 Uplifts Mood</p>
                      <p className="text-gray-700 text-sm">The combination of mental engagement and positive focus creates a mood boost and sense of accomplishment.</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    By practicing cognitive grounding regularly, you build resilience against anxiety and develop the mental tools to reclaim your focus whenever stress tries to take over. Just a few minutes of this CBT-backed exercise can restore your sense of calm, clarity, and confidence in facing life's challenges.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    <AppFooter />
    </div>
  );
}