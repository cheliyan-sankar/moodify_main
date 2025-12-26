'use client';

import { useState, useEffect } from 'react';
import { AppFooter } from "@/components/app-footer";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useVoiceGuide } from '@/hooks/use-breathing-guide';
import { useLogGameActivity } from '@/hooks/use-log-game-activity';

export default function PhysicalGrounding() {
  const router = useRouter();
  
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const [isRunning, setIsRunning] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);

  const { speak, stop } = useVoiceGuide();

  useLogGameActivity('Physical Grounding', isRunning);

  const steps = [
    {
      title: 'Splash Cold Water',
      instruction: 'If available, run cold water on your wrists or splash your face. Feel the shock awaken your senses.',
      duration: 15,
    },
    {
      title: 'Touch Textured Objects',
      instruction: 'Hold something textured: sandpaper, rough fabric, tree bark, ice cubes. Feel the sensation fully.',
      duration: 20,
    },
    {
      title: 'Apply Chest Pressure',
      instruction: 'Place your hand on your chest and apply gentle pressure. Feel your heartbeat. You are alive, you are here.',
      duration: 20,
    },
    {
      title: 'Engage Your Muscles',
      instruction: 'Tense and release muscle groups: fists, legs, shoulders. Feel the release of tension from your body.',
      duration: 20,
    },
    {
      title: 'Feel Grounded',
      instruction: 'Your body is present in this moment. You are grounded, safe, and in control.',
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
          speak(step.instruction);
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
                    speak('Physical grounding exercise complete. You are grounded and calm.');
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

  useEffect(() => {
    const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0);
    const elapsed = steps.slice(0, currentStep).reduce((sum, s) => sum + s.duration, 0);
    setProgress(((elapsed + (steps[currentStep].duration - timeLeft)) / totalDuration) * 100);
  }, [currentStep, timeLeft, steps]);

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setTimeLeft(0);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={handleBack}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg text-xs sm:text-sm"
            >
              Back
            </Button>

            <Button
              onClick={() =>
                setVoiceEnabled((prev) => {
                  const next = !prev;
                  if (!next) stop();
                  return next;
                })
              }
              variant="outline"
              size="sm"
              className="border-2 border-teal-300 text-teal-600 hover:bg-teal-50"
              aria-label={voiceEnabled ? 'Mute sound' : 'Unmute sound'}
            >
              {voiceEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-2 border-teal-200">
          <CardContent className="p-12">
            {/* Title and Tagline */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Physical Grounding</h1>
              <p className="text-sm text-gray-600">A <strong>SOMATIC AND COGNITIVE BEHAVIORAL THERAPY (CBT)-BASED GROUNDING APPROACH</strong> that uses physical awareness to bring you back to the present moment.</p>
            </div>

            {/* Animation */}
            <div className="flex justify-center mb-12">
              <div className="w-40 h-40 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute inset-4 border-2 border-teal-400 rounded-xl" />
                  <div className="absolute inset-8 border-2 border-teal-400 rounded-lg" />
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-teal-600">{timeLeft}</div>
                  <div className="text-sm text-teal-700 mt-2">seconds</div>
                </div>
              </div>
            </div>

            {/* Current Step */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-primary mb-2">
                {isRunning && currentStep < steps.length
                  ? steps[currentStep].title
                  : currentStep >= steps.length
                    ? '✓ Complete'
                    : 'Ready to Begin'}
              </h2>
              {isRunning && currentStep < steps.length && (
                <p className="text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}
                </p>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2 sm:gap-4 justify-center items-center mb-8 flex-wrap">
              <Button
                onClick={() => setIsRunning(!isRunning)}
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:opacity-90 flex-1 sm:flex-none min-w-fit"
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
            </div>

            {/* Information Section */}
            <div className="max-w-2xl mx-auto pt-12 border-t border-gray-200">
              <div className="space-y-8">
                {/* What is Physical Grounding */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Physical Grounding?</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Physical Grounding is a somatic technique rooted in <strong>Somatic Experiencing</strong>, <strong>Sensorimotor Psychotherapy</strong>, and <strong>Trauma-Informed Care</strong>. By deliberately engaging your five senses through physical experiences, you signal safety to your nervous system and bring yourself fully into the present moment. This powerful practice interrupts the stress response cycle and helps you transition from fight-or-flight into a calm, grounded state. When anxiety, panic, or dissociation takes over, physical grounding reconnects you with your body as a source of strength and stability.
                  </p>
                </div>

                {/* How It Works */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
                  <div className="space-y-3 text-gray-700">
                    <p className="leading-relaxed">
                      <span className="font-semibold text-teal-600">Step 1 - Splash Cold Water:</span> If available, run cold water on your wrists or splash your face. The sudden cold activates your parasympathetic nervous system and brings your awareness sharply into the present moment. This sensory jolt interrupts stress spirals.
                    </p>
                    <p className="leading-relaxed">
                      <span className="font-semibold text-teal-600">Step 2 - Touch Textured Objects:</span> Hold something with a distinct texture: sandpaper, rough fabric, tree bark, ice cubes, or velvet. Feel the sensation fully as your fingers explore. Tactile engagement anchors your mind to physical sensation and away from anxious thoughts.
                    </p>
                    <p className="leading-relaxed">
                      <span className="font-semibold text-teal-600">Step 3 - Apply Chest Pressure:</span> Place your hand on your chest and apply gentle pressure. Feel your heartbeat beneath your fingers. This gentle pressure activates your vagus nerve and signals safety to your body, creating a sense of calm reassurance.
                    </p>
                    <p className="leading-relaxed">
                      <span className="font-semibold text-teal-600">Step 4 - Engage Your Muscles:</span> Tense and release different muscle groups: make tight fists, flex your legs, tense your shoulders. Hold the tension for a few seconds, then release. This progressive muscle relaxation helps discharge trapped stress and restores your sense of agency over your body.
                    </p>
                    <p className="leading-relaxed">
                      <span className="font-semibold text-teal-600">Step 5 - Release and Ground:</span> Complete the sequence by standing with both feet firmly planted on the ground. Feel all four corners of your feet pressing down. Take three deep breaths and notice your body's stability and strength.
                    </p>
                  </div>
                </div>

                {/* Benefits & Mood Uplift */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits & Mood Uplift</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <p className="font-semibold text-teal-700 mb-2">🌊 Anchors You in Your Body</p>
                      <p className="text-gray-700 text-sm">Physical grounding brings your wandering mind back into your body's present-moment reality. Instead of spinning in anxious thoughts, you feel the ground beneath your feet and the sensations in your hands—proving you are here, you are safe, you are real.</p>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <p className="font-semibold text-teal-700 mb-2">🛡️ Releases Trauma Responses</p>
                      <p className="text-gray-700 text-sm">When your nervous system is stuck in survival mode, physical engagement helps discharge stored tension and stress. Tensing and releasing muscles, cold water, and pressure all signal to your body that the threat has passed and it's safe to let go.</p>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <p className="font-semibold text-teal-700 mb-2">✨ Activates Safety Signals</p>
                      <p className="text-gray-700 text-sm">Gentle pressure on your chest, the feeling of cold water, and steady breathing activate your vagus nerve—your body's natural calming system. These signals communicate safety to your brain, naturally reducing anxiety and panic.</p>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <p className="font-semibold text-teal-700 mb-2">💪 Restores Sense of Agency</p>
                      <p className="text-gray-700 text-sm">Through conscious physical engagement, you reclaim your power. You are not a victim of your anxiety—you are an active participant in your healing. This shift from helplessness to agency naturally uplifts your mood and builds resilience.</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    By practicing physical grounding regularly, you train your nervous system to respond to stress by returning home to your body. In moments of overwhelming anxiety, panic, or dissociation, these simple physical techniques become your anchor. You learn that your body is not your enemy—it's your greatest ally. Through sensation, movement, and presence, you transform stress into strength and fear into freedom. Make physical grounding a daily practice to experience lasting emotional stability, resilience, and inner peace.
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