'use client';

import { useState, useEffect, useRef } from 'react';
import { AppFooter } from "@/components/app-footer";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useBreathingGuide, type BreathingCycle } from '@/hooks/use-breathing-guide';

export default function DiaphragmaticBreathing() {
  const router = useRouter();
  const [completedCycles, setCompletedCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState(2); // 2, 3, or 5 minutes
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastPhaseRef = useRef<string>('');

  const baseCycle: BreathingCycle[] = [
    { phase: 'inhale', duration: 4, instruction: 'Breathe in through your nose slowly' },
    { phase: 'hold', duration: 4, instruction: 'Hold your breath gently' },
    { phase: 'exhale', duration: 6, instruction: 'Exhale slowly through your mouth' },
    { phase: 'rest', duration: 2, instruction: 'Rest and prepare for the next breath' },
  ];

  const generateBreathingCycles = (durationMinutes: number): BreathingCycle[] => {
    const totalSeconds = durationMinutes * 60;
    const baseCycleDuration = baseCycle.reduce((sum, c) => sum + c.duration, 0);
    const cycleCount = Math.floor(totalSeconds / baseCycleDuration);
    
    let cycles: BreathingCycle[] = [];
    for (let i = 0; i < cycleCount; i++) {
      cycles = cycles.concat(
        baseCycle.map((cycle, idx) => ({
          ...cycle,
          instruction: idx === baseCycle.length - 1 && i === cycleCount - 1 
            ? 'Rest' 
            : cycle.instruction,
        }))
      );
    }
    return cycles;
  };

  const breathingCycles = generateBreathingCycles(selectedDuration);
  const totalDuration = breathingCycles.reduce((sum, c) => sum + c.duration, 0);

  const guide = useBreathingGuide({
    cycles: breathingCycles,
    totalDuration: totalDuration,
    name: 'Diaphragmatic Breathing',
  });

  const handleDurationSelect = (minutes: number) => {
    if (!guide.isRunning) {
      setSelectedDuration(minutes);
      guide.reset();
    }
  };

  useEffect(() => {
    if (!audioContextRef.current && typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  useEffect(() => {
    if (guide.isComplete) {
      playMeditationBell();
    }
  }, [guide.isComplete]);

  useEffect(() => {
    if (guide.isRunning && guide.currentPhase !== lastPhaseRef.current) {
      lastPhaseRef.current = guide.currentPhase;
      playPhaseSound(guide.currentPhase);
    }
  }, [guide.currentPhase, guide.isRunning]);

  const playPhaseSound = (phase: string) => {
    if (!soundEnabled || !audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const now = audioContext.currentTime;

    switch (phase) {
      case 'inhale':
        playInhaleSound(audioContext, now);
        break;
      case 'exhale':
        playExhaleSound(audioContext, now);
        break;
      case 'hold':
        playHoldSound(audioContext, now);
        break;
      case 'rest':
        playRestSound(audioContext, now);
        break;
    }
  };

  const playInhaleSound = (audioContext: AudioContext, now: number) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(400, now + 0.3);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.start(now);
    osc.stop(now + 0.3);
  };

  const playExhaleSound = (audioContext: AudioContext, now: number) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(250, now + 0.4);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.4);
  };

  const playHoldSound = (audioContext: AudioContext, now: number) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.type = 'sine';
    osc.frequency.value = 350;

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.2);
  };

  const playRestSound = (audioContext: AudioContext, now: number) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.type = 'sine';
    osc.frequency.value = 280;

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  };

  const playMeditationBell = () => {
    if (!soundEnabled || !audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const now = audioContext.currentTime;
    const duration = 1.8;

    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc1.connect(gain1);
    gain1.connect(audioContext.destination);

    osc1.type = 'sine';
    osc1.frequency.value = 400;

    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.02, now + 0.1);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.start(now);
    osc1.stop(now + duration);

    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    osc2.connect(gain2);
    gain2.connect(audioContext.destination);

    osc2.type = 'sine';
    osc2.frequency.value = 600;

    gain2.gain.setValueAtTime(0.1, now);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.0005, now + duration);

    osc2.start(now);
    osc2.stop(now + duration);
  };

  const getPhaseScale = () => {
    switch (guide.currentPhase) {
      case 'inhale':
        return 'scale-125';
      case 'exhale':
        return 'scale-75';
      default:
        return 'scale-100';
    }
  };

  const getPhaseColor = () => {
    switch (guide.currentPhase) {
      case 'inhale':
        return 'from-blue-400 to-cyan-500';
      case 'hold':
        return 'from-purple-400 to-pink-500';
      case 'exhale':
        return 'from-green-400 to-emerald-500';
      default:
        return 'from-gray-300 to-gray-400';
    }
  };

  const getPhaseLabel = () => {
    switch (guide.currentPhase) {
      case 'inhale':
        return 'INHALE';
      case 'hold':
        return 'HOLD';
      case 'exhale':
        return 'EXHALE';
      default:
        return 'REST';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start justify-start mb-4">
            <Button onClick={() => router.back()} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg text-xs sm:text-sm">
              Back
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">Diaphragmatic Breathing</h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">
              A <span className="font-bold">Cognitive Behavioral Therapy (CBT)</span>–supported method to slow breathing, reduce anxiety, and restore calm.
            </p>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-2 border-blue-200">
          <CardContent className="p-12">
            {/* Main Breathing Circle */}
            <div className="flex justify-center mb-8">
              <div
                className={`relative w-64 h-64 rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-2xl flex items-center justify-center transition-all duration-500 ${
                  guide.isRunning ? getPhaseScale() : 'scale-90'
                }`}
              >
                <div className="text-center text-white">
                  <div className="text-5xl font-bold mb-2">{guide.timeLeft}</div>
                  <div className="text-2xl font-semibold">{getPhaseLabel()}</div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center mb-8 min-h-16 flex items-center justify-center">
              <p className="text-lg text-gray-700 italic">{guide.currentInstruction}</p>
            </div>

            {/* Timer Display */}
            <div className="text-center mb-12">
              <div className="text-2xl font-bold text-blue-600">
                {formatTime(Math.round((guide.progress / 100) * totalDuration))} / {formatTime(totalDuration)}
              </div>
            </div>

            {/* Duration Selection */}
            <div className="flex gap-3 justify-center items-center mb-8">
              {[2, 3, 5].map((minutes) => (
                <Button
                  key={minutes}
                  onClick={() => handleDurationSelect(minutes)}
                  variant={selectedDuration === minutes ? 'default' : 'outline'}
                  className={selectedDuration === minutes ? 
                    'bg-blue-500 hover:bg-blue-600 text-white' : 
                    'border-blue-300 text-blue-600 hover:bg-blue-50'}
                  disabled={guide.isRunning}
                >
                  {minutes}m
                </Button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex gap-2 sm:gap-4 justify-center items-center flex-wrap mb-8">
              {!guide.isRunning ? (
                <Button
                  onClick={guide.start}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 flex-1 sm:flex-none min-w-fit"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </Button>
              ) : (
                <Button
                  onClick={guide.pause}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 flex-1 sm:flex-none min-w-fit"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              )}

              <Button
                onClick={guide.reset}
                variant="outline"
                size="lg"
                className="border-2 flex-1 sm:flex-none min-w-fit"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>

            {/* Completion Message */}
            {guide.isComplete && (
              <div className="bg-green-100 border-2 border-green-400 rounded-lg p-6 text-center">
                <p className="text-2xl font-bold text-green-700 mb-2">🎉 Well Done!</p>
                <p className="text-green-600">
                  You&apos;ve completed the diaphragmatic breathing session. Feel free to repeat whenever you need to calm down.
                </p>
              </div>
            )}

            {/* Information Section */}
            <div className="max-w-2xl mx-auto pt-12 border-t border-blue-200">
              <div className="space-y-8">
                {/* What is Diaphragmatic Breathing */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Diaphragmatic Breathing?</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Diaphragmatic breathing, also known as belly breathing or deep breathing, is a foundational technique from Mindfulness-Based Stress Reduction (MBSR) that engages your diaphragm to maximize oxygen intake. Unlike shallow chest breathing, this technique encourages your belly to expand fully as you breathe in, allowing your lungs to fill with oxygen and triggering your body's natural relaxation response.
                  </p>
                </div>

                {/* How It Works */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
                  <div className="space-y-3 text-gray-700">
                    <p className="leading-relaxed">
                      <span className="font-semibold text-blue-600">Breathe In (4 seconds):</span> Slowly inhale through your nose, focusing on expanding your belly and diaphragm. Your chest should move minimally while your belly expands like a balloon filling with air.
                    </p>
                    <p className="leading-relaxed">
                      <span className="font-semibold text-blue-600">Hold (4 seconds):</span> Gently pause your breath, allowing oxygen to be absorbed by your body and activating your parasympathetic nervous system.
                    </p>
                    <p className="leading-relaxed">
                      <span className="font-semibold text-blue-600">Exhale (6 seconds):</span> Slowly release your breath through your mouth, allowing your belly to naturally deflate. The longer exhale helps calm your nervous system even more.
                    </p>
                    <p className="leading-relaxed">
                      <span className="font-semibold text-blue-600">Rest (2 seconds):</span> Pause naturally before beginning the next cycle, allowing your body to settle into a peaceful state.
                    </p>
                  </div>
                </div>

                {/* Benefits & Mood Uplift */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits & Mood Uplift</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-semibold text-blue-700 mb-2">✨ Instant Calm</p>
                      <p className="text-gray-700 text-sm">Activates your parasympathetic nervous system, creating an immediate sense of relaxation and peace.</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-semibold text-blue-700 mb-2">🧠 Mental Clarity</p>
                      <p className="text-gray-700 text-sm">Increased oxygen flow to your brain enhances focus, reduces brain fog, and sharpens mental clarity.</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-semibold text-blue-700 mb-2">❤️ Lowers Heart Rate</p>
                      <p className="text-gray-700 text-sm">Reduces cortisol and adrenaline levels, naturally lowering your heart rate and blood pressure.</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-semibold text-blue-700 mb-2">😊 Emotional Balance</p>
                      <p className="text-gray-700 text-sm">Releases tension stored in your body and promotes emotional stability and resilience.</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    By practicing diaphragmatic breathing regularly, you train your nervous system to naturally default to a calm state. Just a few minutes of this MBSR-backed technique can transform your mood, reduce anxiety, and help you navigate stress with greater ease. Make it a daily practice to experience deeper relaxation and improved emotional well-being.
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
