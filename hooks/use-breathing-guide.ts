import { useEffect, useState } from 'react';

export interface BreathingCycle {
  phase: 'inhale' | 'hold' | 'exhale' | 'rest';
  duration: number;
  instruction: string;
}

export interface BreathingGuideConfig {
  cycles: BreathingCycle[];
  totalDuration: number;
  name: string;
}

export function useBreathingGuide(config: BreathingGuideConfig) {
  const [isRunning, setIsRunning] = useState(false);
  const [cycleIndex, setCurrentCycle] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.cycles[0]?.duration || 0);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);

  const currentCycle = config.cycles[cycleIndex];
  const currentPhase = currentCycle?.phase || 'inhale';
  const currentInstruction = currentCycle?.instruction || '';
  const progress = (totalTimeElapsed / config.totalDuration) * 100;
  const isComplete = cycleIndex >= config.cycles.length;

  useEffect(() => {
    if (!isRunning || isComplete) return;

    const timer = setInterval(() => {
      setTotalTimeElapsed((prevElapsed) => prevElapsed + 1);
      
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Move to next cycle
          if (cycleIndex < config.cycles.length - 1) {
            setCurrentCycle(cycleIndex + 1);
            const nextDuration = config.cycles[cycleIndex + 1].duration;
            return nextDuration;
          } else {
            // Breathing session complete
            setIsRunning(false);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, cycleIndex, config.cycles, isComplete]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setCurrentCycle(0);
    setTimeLeft(config.cycles[0]?.duration || 0);
    setTotalTimeElapsed(0);
  };

  return {
    isRunning,
    start,
    pause,
    reset,
    currentPhase,
    currentInstruction,
    timeLeft,
    progress,
    isComplete,
    cycleIndex,
    totalCycles: config.cycles.length,
  };
}

export function useVoiceGuide() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speak = (text: string, priority: 'normal' | 'urgent' = 'normal') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // Cancel any ongoing speech before starting a new calm utterance
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text.replace(/…/g, '...'));
    utterance.rate = 0.75; // slower, more grounding
    utterance.pitch = 0.95;
    utterance.volume = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const calmVoice =
      voices.find((v) => /female|woman|zira|samantha|google us english female/i.test(v.name)) ||
      voices.find((v) => v.lang && v.lang.startsWith('en')) ||
      voices[0];

    if (calmVoice) {
      utterance.voice = calmVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return { speak, stop, isSpeaking };
}
