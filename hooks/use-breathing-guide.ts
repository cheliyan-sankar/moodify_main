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
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Prefer slower, calming delivery
    const baseRate = 0.75; // slower to avoid rushing
    const basePitch = 0.95;
    const baseVolume = 0.9;

    // Normalize ellipses to create clearer pauses for the TTS engine
    const normalizedText = text.replace(/…/g, '...');

    // Split on ellipses or sentence boundaries to let the engine breathe
    const segments = normalizedText.split(/\.\.\.|\n|\.|\?|-{2,}/).map(s => s.trim()).filter(Boolean);

    const voices = window.speechSynthesis.getVoices();
    const calmVoice = voices.find((v) => /female|woman|zira|samantha|google us english female/i.test(v.name))
      || voices.find((v) => v.lang && v.lang.startsWith('en'))
      || voices[0];

    let idx = 0;

    const speakNext = () => {
      if (idx >= segments.length) return;
      const part = segments[idx];
      const utterance = new SpeechSynthesisUtterance(part);
      utterance.rate = baseRate;
      utterance.pitch = basePitch;
      utterance.volume = baseVolume;
      if (calmVoice) utterance.voice = calmVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        idx += 1;
        setIsSpeaking(false);
        // short pause before next segment
        if (idx < segments.length) {
          setTimeout(speakNext, 400);
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return { speak, stop, isSpeaking };
}
