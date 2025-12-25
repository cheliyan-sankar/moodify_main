'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AppFooter } from "@/components/app-footer";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Pause, Play, Volume2, VolumeX } from 'lucide-react';

type Screen = 'intro' | 'emotion' | 'touch' | 'sight' | 'sound' | 'smell' | 'taste' | 'reflection' | 'closing';
type ReflectionOption = 'softer' | 'calmer' | 'steadier' | 'unsure' | null;

const experienceSequence: Screen[] = ['touch', 'sight', 'sound', 'smell', 'taste'];
const experienceDurations: Record<Screen, number> = {
  touch: 30,
  sight: 35,
  sound: 35,
  smell: 30,
  taste: 30,
  intro: 0,
  emotion: 0,
  reflection: 0,
  closing: 0,
};

export default function SelfSoothing() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('intro');
  const [emotionLevel, setEmotionLevel] = useState(5);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExperiencing, setIsExperiencing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentExperienceIndex, setCurrentExperienceIndex] = useState(0);
  const [reflection, setReflection] = useState<ReflectionOption>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hapticRef = useRef<boolean>(false);

  // Auto-advance experience timer
  useEffect(() => {
    if (!isExperiencing || timeLeft === 0 || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          const nextIndex = currentExperienceIndex + 1;
          if (nextIndex < experienceSequence.length) {
            setCurrentExperienceIndex(nextIndex);
            const nextScreen = experienceSequence[nextIndex];
            setScreen(nextScreen);
            setTimeLeft(experienceDurations[nextScreen]);
          } else {
            setIsExperiencing(false);
            setScreen('reflection');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExperiencing, timeLeft, currentExperienceIndex, isPaused]);

  // Haptic feedback for touch experience
  useEffect(() => {
    if (screen === 'touch' && isExperiencing) {
      hapticRef.current = true;
      if ('vibrate' in navigator) {
        const hapticPattern = () => {
          navigator.vibrate([100, 100, 100]);
        };
        const interval = setInterval(hapticPattern, 500);
        return () => clearInterval(interval);
      }
    }
    hapticRef.current = false;
  }, [screen, isExperiencing]);

  const startExperience = () => {
    setCurrentExperienceIndex(0);
    const firstScreen = experienceSequence[0];
    setScreen(firstScreen);
    setTimeLeft(experienceDurations[firstScreen]);
    setIsExperiencing(true);
  };

  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleBack = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && window.history.length > 1) {
        router.back();
      } else {
        router.push('/');
      }
    } catch (error) {
      router.push('/');
    }
  }, [router]);

  const handleRepeat = () => {
    setReflection(null);
    startExperience();
  };

  // Play ambient sound during sound experience
  useEffect(() => {
    if (screen === 'sound' && isExperiencing && soundEnabled && !isPaused) {
      // Create a simple ambient tone using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Soft, low frequency tone (50-60 Hz)
      oscillator.frequency.value = 55;
      oscillator.type = 'sine';
      
      // Very soft volume
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + 0.5);
      
      oscillator.start();
      
      return () => {
        oscillator.stop();
      };
    }
  }, [screen, isExperiencing, soundEnabled, isPaused]);

  // Play tick sound for timer
  useEffect(() => {
    if (!isExperiencing || timeLeft === 0 || !soundEnabled || isPaused) return;

    const playTick = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Higher frequency for tick sound (800 Hz)
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        // Very short, quiet tick
        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (e) {
        // Silently fail if audio context not available
      }
    };

    const interval = setInterval(playTick, 1000);
    return () => clearInterval(interval);
  }, [isExperiencing, timeLeft, soundEnabled, isPaused]);

  // Background color based on emotion level
  const emotionBackgroundColor = `hsl(270, 70%, ${95 - emotionLevel * 3}%)`;

  return (
    <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor: emotionBackgroundColor }}>
      <nav className="border-b bg-white/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button onClick={handleBack} variant="ghost" className="mb-4 text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-1">Self-Soothing</h1>
            <p className="text-xs sm:text-sm text-slate-600">A <strong>(Dialectical Behavior Therapy)DBT</strong> self-soothing skill that uses the senses to manage emotional distress.</p>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        {/* INTRO */}
        {screen === 'intro' && (
          <div className="space-y-4 flex flex-col items-center justify-center">
            <div className="w-40 h-40 md:w-48 md:h-48 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full" />
              <div 
                className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full"
                style={{
                  animation: 'breathe 8s ease-in-out infinite',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-5xl">✨</div>
            </div>

            <Card className="border-2 border-purple-200 bg-white/90 backdrop-blur max-w-lg w-full">
              <CardContent className="p-4 md:p-6 text-center space-y-2">
                <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                  When emotions feel intense, your body may need comfort before understanding. In this activity, you'll experience soothing sensations step-by-step.
                </p>
                <p className="text-xs md:text-sm text-slate-500 italic">
                  There's no rush. Just notice what unfolds.
                </p>
              </CardContent>
            </Card>

            <Button
              onClick={() => setScreen('emotion')}
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white mt-2"
            >
              Begin
            </Button>
          </div>
        )}

        {/* EMOTION CHECK-IN */}
        {screen === 'emotion' && (
          <div className="space-y-3 flex flex-col items-center justify-center">
            <Card className="border-2 border-purple-200 bg-white/90 backdrop-blur max-w-lg w-full">
              <CardContent className="p-4 md:p-6 space-y-3">
                <div className="text-center">
                  <h2 className="text-lg md:text-xl font-bold text-purple-700 mb-1">How big does the emotion feel right now?</h2>
                  <p className="text-slate-600 text-xs md:text-sm">There's nothing to fix — we're just noticing.</p>
                </div>

                <div className="space-y-2">
                  <Slider
                    value={[emotionLevel]}
                    onValueChange={(val) => setEmotionLevel(val[0])}
                    min={0}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="grid grid-cols-5 gap-1 text-xs text-slate-600 text-center">
                    <div>Calm</div>
                    <div>Tight</div>
                    <div>Heavy</div>
                    <div>Intense</div>
                    <div>Over</div>
                  </div>
                  <div className="text-center text-3xl md:text-4xl font-bold text-purple-600">{emotionLevel}</div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2 mt-2">
              <Button onClick={() => setScreen('intro')} variant="outline" size="sm">
                Back
              </Button>
              <Button
                onClick={startExperience}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* TOUCH EXPERIENCE */}
        {screen === 'touch' && isExperiencing && (
          <div className="space-y-3 flex flex-col items-center justify-center">
            <div className="w-full h-48 md:h-56 bg-gradient-to-br from-orange-400 via-red-300 to-pink-300 rounded-2xl relative overflow-hidden flex items-center justify-center">
              <div 
                className="absolute inset-0 opacity-60"
                style={{
                  animation: 'radiateWarmth 4s ease-in-out infinite',
                  background: 'radial-gradient(circle, rgba(255,200,100,0.4) 0%, rgba(255,100,50,0.2) 70%, transparent 100%)',
                }}
              />
              <div className="relative z-10 text-6xl">❤️</div>
            </div>

            <Card className="border-2 border-purple-200 bg-white/90 backdrop-blur max-w-lg w-full">
              <CardContent className="p-3 md:p-4 text-center space-y-2">
                <p className="text-sm md:text-base text-slate-700 font-medium">Place a hand over your heart or hold something soft, warm, or comforting near you.</p>
                <p className="text-xs md:text-sm text-slate-600 italic">Notice warmth, texture, or pressure. Only feel.</p>
                <div className="text-4xl md:text-5xl font-bold text-purple-600">{timeLeft}s</div>
              </CardContent>
            </Card>

            <div className="flex gap-2 w-full max-w-lg">
              <Button
                onClick={() => setIsPaused(!isPaused)}
                size="sm"
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                size="sm"
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}

        {/* SIGHT EXPERIENCE */}
        {screen === 'sight' && isExperiencing && (
          <div className="space-y-3 flex flex-col items-center justify-center">
            <div className="w-full h-48 md:h-56 bg-gradient-to-br from-blue-400 via-purple-300 to-slate-400 rounded-2xl relative overflow-hidden flex items-center justify-center">
              {/* Gentle ocean-like waves */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(100,150,255,0.3)" />
                    <stop offset="100%" stopColor="rgba(150,100,200,0.2)" />
                  </linearGradient>
                </defs>
                {[...Array(3)].map((_, i) => (
                  <circle
                    key={i}
                    cx="200"
                    cy="200"
                    r={60 + i * 30}
                    fill="none"
                    stroke="url(#waveGrad)"
                    strokeWidth="2"
                    style={{
                      animation: `gentleWave ${3 + i * 0.5}s ease-in-out infinite`,
                      opacity: 0.6 - i * 0.15,
                    }}
                  />
                ))}
              </svg>
              <div className="relative z-10 text-5xl">🌊</div>
            </div>

            <Card className="border-2 border-purple-200 bg-white/90 backdrop-blur max-w-lg w-full">
              <CardContent className="p-3 md:p-4 text-center space-y-2">
                <p className="text-sm md:text-base text-slate-700 font-medium">Let your breath match the rhythm of what you see.</p>
                <p className="text-xs md:text-sm text-slate-600 italic">Only observe.</p>
                <div className="text-4xl md:text-5xl font-bold text-purple-600">{timeLeft}s</div>
              </CardContent>
            </Card>

            <div className="flex gap-2 w-full max-w-lg">
              <Button
                onClick={() => setIsPaused(!isPaused)}
                size="sm"
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                size="sm"
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}

        {/* SOUND EXPERIENCE */}
        {screen === 'sound' && isExperiencing && (
          <div className="space-y-3 flex flex-col items-center justify-center">
            <div className="w-full h-48 md:h-56 bg-gradient-to-br from-indigo-300 via-blue-200 to-cyan-300 rounded-2xl relative overflow-hidden flex items-center justify-center">
              {/* Sound waves expanding */}
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute border-2 border-white rounded-full"
                  style={{
                    width: `${80 + i * 40}px`,
                    height: `${80 + i * 40}px`,
                    opacity: 0.5 - i * 0.12,
                    animation: `expandWave 2s ease-out infinite`,
                    animationDelay: `${i * 0.4}s`,
                  }}
                />
              ))}
              <div className="relative z-10 text-6xl">🎵</div>
            </div>

            <Card className="border-2 border-purple-200 bg-white/90 backdrop-blur max-w-lg w-full">
              <CardContent className="p-3 md:p-4 text-center space-y-2">
                <p className="text-sm md:text-base text-slate-700 font-medium">Let the sound move through you.</p>
                <p className="text-xs md:text-sm text-slate-600 italic">Only listen.</p>
                <div className="text-4xl md:text-5xl font-bold text-purple-600">{timeLeft}s</div>
              </CardContent>
            </Card>

            <div className="flex gap-2 w-full max-w-lg">
              <Button
                onClick={() => setIsPaused(!isPaused)}
                size="sm"
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                size="sm"
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}

        {/* SMELL EXPERIENCE */}
        {screen === 'smell' && isExperiencing && (
          <div className="space-y-3 flex flex-col items-center justify-center">
            <div className="w-full h-48 md:h-56 bg-gradient-to-br from-purple-300 via-pink-200 to-purple-200 rounded-2xl relative overflow-hidden flex items-center justify-center">
              {/* Swirling mist */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-32 h-48 opacity-40"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: '-20px',
                    background: 'linear-gradient(to bottom, rgba(168, 85, 247, 0.3), transparent)',
                    borderRadius: '50% 50% 0 0',
                    animation: `floatMist ${3 + i * 0.3}s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
              <div className="relative z-10 text-5xl">🌸</div>
            </div>

            <Card className="border-2 border-purple-200 bg-white/90 backdrop-blur max-w-lg w-full">
              <CardContent className="p-3 md:p-4 text-center space-y-2">
                <p className="text-sm md:text-base text-slate-700 font-medium">Imagine a comforting scent.</p>
                <p className="text-xs md:text-sm text-slate-600 italic">Tea, rain, fresh laundry, a flower, a memory.</p>
                <div className="text-4xl md:text-5xl font-bold text-purple-600">{timeLeft}s</div>
              </CardContent>
            </Card>

            <div className="flex gap-2 w-full max-w-lg">
              <Button
                onClick={() => setIsPaused(!isPaused)}
                size="sm"
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                size="sm"
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}

        {/* TASTE EXPERIENCE */}
        {screen === 'taste' && isExperiencing && (
          <div className="space-y-3 flex flex-col items-center justify-center">
            <div className="w-full h-48 md:h-56 bg-gradient-to-br from-amber-300 via-orange-200 to-rose-200 rounded-2xl relative overflow-hidden flex items-center justify-center">
              {/* Warm cup with steam */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                {[...Array(3)].map((_, i) => (
                  <path
                    key={i}
                    d={`M ${150 + i * 30} 400 Q ${160 + i * 30} 300 ${180 + i * 30} 100`}
                    stroke="rgba(255, 200, 100, 0.3)"
                    strokeWidth="20"
                    fill="none"
                    style={{
                      animation: `steamRise ${2 + i * 0.3}s ease-out infinite`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </svg>
              <div className="relative z-10 text-5xl">🫖</div>
            </div>

            <Card className="border-2 border-purple-200 bg-white/90 backdrop-blur max-w-lg w-full">
              <CardContent className="p-3 md:p-4 text-center space-y-2">
                <p className="text-sm md:text-base text-slate-700 font-medium">Take one slow sip or bite if nearby.</p>
                <p className="text-xs md:text-sm text-slate-600 italic">Let it linger, or imagine a comforting flavor.</p>
                <div className="text-4xl md:text-5xl font-bold text-purple-600">{timeLeft}s</div>
              </CardContent>
            </Card>

            <div className="flex gap-2 w-full max-w-lg">
              <Button
                onClick={() => setIsPaused(!isPaused)}
                size="sm"
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                size="sm"
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}

        {/* REFLECTION */}
        {screen === 'reflection' && (
          <div className="space-y-3 flex flex-col items-center justify-center">
            <Card className="border-2 border-purple-200 bg-white/90 backdrop-blur max-w-lg w-full">
              <CardContent className="p-4 md:p-6 space-y-3">
                <h2 className="text-lg md:text-xl font-bold text-purple-700 text-center mb-2">
                  How does your body feel now?
                </h2>

                <div className="space-y-2">
                  {[
                    { id: 'softer', emoji: '🌸', text: 'Softer' },
                    { id: 'calmer', emoji: '🌊', text: 'Calmer' },
                    { id: 'steadier', emoji: '🌱', text: 'The same — but steadier' },
                    { id: 'unsure', emoji: '🤷', text: 'Not sure yet — and that\'s okay' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setReflection(opt.id as ReflectionOption);
                        setScreen('closing');
                      }}
                      className="w-full p-4 rounded-lg border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all text-left hover:shadow-md active:scale-95"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{opt.emoji}</span>
                        <span className="font-medium text-purple-700">{opt.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* CLOSING */}
        {screen === 'closing' && (
          <div className="space-y-3 flex flex-col items-center justify-center">
            <div className="w-40 h-40 md:w-48 md:h-48 relative flex items-center justify-center">
              <div 
                className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full"
                style={{
                  animation: 'gentlePulse 4s ease-in-out infinite',
                }}
              />
              <div className="relative z-10 text-5xl">✨</div>
            </div>

            <Card className="border-2 border-purple-200 bg-white/90 backdrop-blur max-w-lg w-full">
              <CardContent className="p-4 md:p-6 text-center space-y-2">
                <p className="text-sm md:text-base text-slate-700 leading-relaxed font-medium">
                  You practiced comfort — not avoidance, but care.
                </p>
                <p className="text-xs md:text-sm text-slate-600">
                  Your body remembers safety, and you helped it reconnect.
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full max-w-lg">
              <Button
                onClick={handleRepeat}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex-1"
              >
                Repeat
              </Button>
              <Button onClick={handleBack} variant="outline" size="sm" className="flex-1">
                End
              </Button>
            </div>
          </div>
        )}

        {/* Information Section - visible on all screens */}
        {(screen === 'intro' || screen === 'emotion' || screen === 'touch' || screen === 'sight' || screen === 'sound' || screen === 'smell' || screen === 'taste' || screen === 'reflection' || screen === 'closing') && (
          <div className="max-w-3xl mx-auto pt-6 pb-8 border-t border-slate-200 mt-6 px-4">
            <div className="space-y-6">
              {/* What is Self-Soothing */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-purple-700 mb-3">What is Self-Soothing?</h2>
                <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                  Self-Soothing is a Dialectical Behavior Therapy (DBT) technique that uses all five senses to create immediate calm and emotional relief. When emotions feel overwhelming, your nervous system needs comfort before understanding. By intentionally engaging touch, smell, taste, sight, and sound, you activate your body's natural relaxation response and reconnect with safety.
                </p>
              </div>

              {/* How It Works */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-purple-700 mb-3">How It Works</h2>
                <div className="space-y-2 text-sm md:text-base text-slate-700">
                  <p><span className="font-semibold text-purple-600">Touch:</span> Place your hand over your heart or hold something soft. Feel warmth, texture, and pressure.</p>
                  <p><span className="font-semibold text-purple-600">Sight:</span> Watch gentle movements. Let your breath match the rhythm of what you see.</p>
                  <p><span className="font-semibold text-purple-600">Sound:</span> Listen to soothing tones. Allow sound to move through you without analysis.</p>
                  <p><span className="font-semibold text-purple-600">Smell:</span> Imagine a comforting scent — tea, rain, flowers, memories.</p>
                  <p><span className="font-semibold text-purple-600">Taste:</span> Sip something warm or imagine a soothing flavor. Let it linger.</p>
                </div>
              </div>

              {/* Benefits & Mood Uplift */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-purple-700 mb-3">Benefits & Mood Uplift</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                    <p className="font-semibold text-purple-700 mb-1">💝 Soothes Emotional Pain</p>
                    <p className="text-xs md:text-sm text-slate-600">Creates a safe container for difficult emotions while promoting healing and self-acceptance.</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                    <p className="font-semibold text-purple-700 mb-1">⚡ Provides Immediate Relief</p>
                    <p className="text-xs md:text-sm text-slate-600">Multisensory engagement shifts your nervous system toward calm and interrupts distressing thought patterns.</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                    <p className="font-semibold text-purple-700 mb-1">🛡️ Builds Distress Tolerance</p>
                    <p className="text-xs md:text-sm text-slate-600">Regular practice strengthens your capacity to sit with difficult emotions and builds long-term resilience.</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                    <p className="font-semibold text-purple-700 mb-1">🌸 Cultivates Self-Compassion</p>
                    <p className="text-xs md:text-sm text-slate-600">Choosing to soothe yourself reinforces that you deserve kindness and care, even during difficult times.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="mt-12">
        <AppFooter />
      </div>

      <style jsx>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes radiateWarmth {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.6; }
        }
        @keyframes gentleWave {
          0%, 100% { r: 50px; opacity: 0.3; }
          50% { r: 80px; opacity: 0.1; }
        }
        @keyframes expandWave {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes floatMist {
          0% { transform: translateY(0px); opacity: 0.2; }
          50% { transform: translateY(-40px); opacity: 0.4; }
          100% { transform: translateY(-80px); opacity: 0; }
        }
        @keyframes steamRise {
          0% { opacity: 0; }
          20% { opacity: 0.4; }
          80% { opacity: 0.2; }
          100% { opacity: 0; }
        }
        @keyframes gentlePulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}