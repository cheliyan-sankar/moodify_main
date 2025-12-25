'use client';

import { useState, useEffect, useRef } from 'react';
import { AppFooter } from "@/components/app-footer";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronRight, Home } from 'lucide-react';
import { useBackgroundMusic } from '@/hooks/use-background-music';

type Step = 'intro' | 'externalize' | 'categorize' | 'actionBuilder' | 'acceptancePath' | 'gifDisplay' | 'storage' | 'closing';
type AnswerType = 'yes' | 'no' | null;
type TagType = 'future' | 'whatif' | 'fear' | 'memory' | null;

export default function WorryBox() {
  const router = useRouter();
  useBackgroundMusic(true, 0.25);

  const [step, setStep] = useState<Step>('intro');
  const [worry, setWorry] = useState('');
  const [hasValidated, setHasValidated] = useState(false);
  const [answer, setAnswer] = useState<AnswerType>(null);
  const [gifType, setGifType] = useState<'yes' | 'no' | null>(null);
  const [actionStep, setActionStep] = useState('');
  const [actionTime, setActionTime] = useState('');
  const [selectedTag, setSelectedTag] = useState<TagType>(null);
  const [storagePhase, setStoragePhase] = useState<'floating' | 'opening' | 'closing' | 'complete'>('floating');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>();

  // Floating bubbles animation for intro
  useEffect(() => {
    if (step !== 'intro' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    interface Bubble {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      opacity: number;
      birth: number;
    }
    
    let bubbles: Bubble[] = [];
    let time = 0;

    const createBubble = () => {
      bubbles.push({
        x: Math.random() * width,
        y: height + 20,
        radius: Math.random() * 15 + 8,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.8 - 0.3,
        opacity: 0,
        birth: time
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 16;

      // Create bubbles periodically
      if (time % 200 === 0 && bubbles.length < 8) {
        createBubble();
      }

      // Update and draw bubbles
      bubbles = bubbles.filter(b => {
        const age = time - b.birth;
        
        // Fade in over 500ms, exist for 4000ms, fade out over 500ms
        if (age < 500) {
          b.opacity = age / 500;
        } else if (age < 4000) {
          b.opacity = 1;
        } else if (age < 4500) {
          b.opacity = 1 - (age - 4000) / 500;
        } else {
          return false;
        }

        b.x += b.vx;
        b.y += b.vy;

        // Draw bubble
        ctx.fillStyle = `rgba(156, 135, 245, ${b.opacity * 0.3})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        // Bubble outline
        ctx.strokeStyle = `rgba(156, 135, 245, ${b.opacity * 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        return true;
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [step]);

  // GIF display auto-transition
  useEffect(() => {
    if (step === 'gifDisplay') {
      const timer = setTimeout(() => {
        setStep('closing');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Box storage animation
  useEffect(() => {
    if (step !== 'storage' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    let animationTime = 0;

    const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const animate = () => {
      animationTime += 16;
      ctx.clearRect(0, 0, width, height);

      // Floating bubble (0-1500ms)
      if (animationTime < 1500) {
        const floatProgress = animationTime / 1500;
        const bubbleY = centerY - floatProgress * 80;
        const bubbleOpacity = 1 - floatProgress * 0.3;

        // Worry bubble
        ctx.fillStyle = `rgba(156, 135, 245, ${bubbleOpacity * 0.4})`;
        ctx.beginPath();
        ctx.arc(centerX, bubbleY, 40, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(156, 135, 245, ${bubbleOpacity * 0.8})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Shimmer effect
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.sin(animationTime / 300) * 0.2 + 0.1})`;
        ctx.beginPath();
        ctx.arc(centerX - 12, bubbleY - 12, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Box opening (1500-3000ms)
      if (animationTime >= 1500) {
        const openProgress = Math.min((animationTime - 1500) / 1500, 1);
        
        const boxSize = 100;
        const boxX = centerX - boxSize / 2;
        const boxY = centerY - boxSize / 2;

        // Box body
        ctx.fillStyle = '#E2DAF5';
        ctx.fillRect(boxX, boxY + 20, boxSize, boxSize - 20);
        ctx.strokeStyle = '#3C1F71';
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX, boxY + 20, boxSize, boxSize - 20);

        // Box lid
        ctx.save();
        ctx.translate(boxX + boxSize / 2, boxY + 20);
        ctx.rotate(-easeInOutQuad(openProgress) * Math.PI / 2);
        ctx.translate(-(boxX + boxSize / 2), -(boxY + 20));
        
        ctx.fillStyle = '#D1C4E8';
        ctx.fillRect(boxX, boxY, boxSize, 25);
        ctx.strokeStyle = '#3C1F71';
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX, boxY, boxSize, 25);
        ctx.restore();

        // Worry dropping into box
        if (animationTime >= 2000) {
          const dropProgress = Math.min((animationTime - 2000) / 500, 1);
          const dropY = (centerY - 80) + dropProgress * 100;
          const dropOpacity = 1 - dropProgress;

          ctx.fillStyle = `rgba(156, 135, 245, ${dropOpacity * 0.4})`;
          ctx.beginPath();
          ctx.arc(centerX, dropY, 40 * (1 - dropProgress * 0.5), 0, Math.PI * 2);
          ctx.fill();
        }

        // Box closing (3000ms+)
        if (animationTime >= 3000) {
          const closeProgress = Math.min((animationTime - 3000) / 1000, 1);
          
          if (closeProgress < 1) {
            ctx.save();
            ctx.translate(boxX + boxSize / 2, boxY + 20);
            ctx.rotate(easeInOutQuad(closeProgress) * Math.PI / 2 - Math.PI / 2);
            ctx.translate(-(boxX + boxSize / 2), -(boxY + 20));
            
            ctx.fillStyle = '#D1C4E8';
            ctx.fillRect(boxX, boxY, boxSize, 25);
            ctx.strokeStyle = '#3C1F71';
            ctx.lineWidth = 2;
            ctx.strokeRect(boxX, boxY, boxSize, 25);
            ctx.restore();
          } else {
            // Closed state
            ctx.fillStyle = '#D1C4E8';
            ctx.fillRect(boxX, boxY, boxSize, 25);
            ctx.strokeStyle = '#3C1F71';
            ctx.lineWidth = 2;
            ctx.strokeRect(boxX, boxY, boxSize, 25);
          }
        }
      }

      if (animationTime < 4000) {
        animationIdRef.current = requestAnimationFrame(animate);
      } else {
        handleStorageComplete();
      }
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [step]);

  const handleWorryInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWorry(e.target.value);
    if (e.target.value.trim() && !hasValidated) {
      setHasValidated(true);
    }
  };

  const handleExternalizeSubmit = () => {
    if (worry.trim()) {
      setStep('categorize');
    }
  };

  const handleCategorize = (response: AnswerType) => {
    setAnswer(response);
    if (response === 'yes') {
      setStep('actionBuilder');
    } else {
      setStep('acceptancePath');
    }
  };

  const handleActionBuilder = () => {
    if (actionStep.trim() && actionTime) {
      setStep('storage');
      setStoragePhase('floating');
    }
  };

  const handleAcceptancePath = () => {
    if (selectedTag) {
      setStep('storage');
      setStoragePhase('floating');
    }
  };

  const handleStorageComplete = () => {
    if (answer === 'yes') {
      setStep('closing');
    } else {
      setGifType('no');
      setStep('gifDisplay');
    }
  };

  const handleReturnHome = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #F5F0FF 0%, #E8DCF7 100%)' }}>
      <div className="absolute top-6 left-6">
        <Button onClick={() => router.back()} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg">
          Back
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-2xl">
          {/* Intro Screen */}
          {step === 'intro' && (
            <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
              {/* Header Section */}
              <div className="text-center space-y-4 pt-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                  Welcome to Worry Box
                </h1>
                <p className="text-base sm:text-lg text-gray-700 max-w-md mx-auto leading-relaxed">
                  A CBT-guided activity to externalize, sort, and release overwhelming thoughts safely.
                </p>

                <div className="flex justify-center py-6">
                  <canvas
                    ref={canvasRef}
                    width={300}
                    height={300}
                    className="rounded-2xl"
                    style={{ background: 'transparent' }}
                  />
                </div>
              </div>

              {/* Begin Button */}
              <div className="text-center">
                <Button
                  onClick={() => setStep('externalize')}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-purple-500 hover:opacity-90 text-white px-8 py-6 text-lg shadow-lg"
                >
                  Begin
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* What is Worry Box */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Worry Box?</h2>
                <p className="text-gray-700 leading-relaxed">
                  Worry Box is a CBT (Cognitive Behavioral Therapy) inspired tool that helps you externalize worries from your mind and into a safe space. Instead of letting thoughts loop endlessly, you acknowledge them, categorize them, and decide whether they need action or acceptance. This simple but powerful process reduces mental clutter and gives your mind relief.
                </p>
              </div>

              {/* How It Works */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    <span className="font-semibold text-purple-600">Step 1 — Externalize:</span> Write down the worry that's been looping in your mind without judgment.
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-semibold text-purple-600">Step 2 — Categorize:</span> Decide: is this something you can control and take action on, or something you need to accept?
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-semibold text-purple-600">Step 3 — Process:</span> If actionable, create a simple action plan. If uncontrollable, choose an acceptance tag that resonates with you.
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-semibold text-purple-600">Step 4 — Store & Release:</span> Watch your worry safely stored in the box, then let it go with a closing reflection.
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="font-semibold text-purple-700 mb-2">🧠 Reduces Mental Clutter</p>
                    <p className="text-gray-700 text-sm">Externalize worries from your head to create mental space and clarity.</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="font-semibold text-purple-700 mb-2">✨ Breaks Worry Loops</p>
                    <p className="text-gray-700 text-sm">Stop endless rumination by acknowledging and categorizing your thoughts.</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="font-semibold text-purple-700 mb-2">🎯 Increases Clarity</p>
                    <p className="text-gray-700 text-sm">Distinguish between controllable and uncontrollable worries to focus your energy wisely.</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="font-semibold text-purple-700 mb-2">🕊️ Promotes Acceptance</p>
                    <p className="text-gray-700 text-sm">Learn to let go of what you can't control and find peace with uncertainty.</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  By practicing Worry Box, you train your mind to process overwhelm in a structured way. You give yourself permission to let go of what doesn't serve you and focus on what you can actually influence. This is a safe, judgment-free space for your worries.
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Externalize */}
          {step === 'externalize' && (
            <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  What's the worry that's been looping in your mind?
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  There's no judgment here—just get it out of your head and onto the page.
                </p>
              </div>

              <textarea
                value={worry}
                onChange={handleWorryInput}
                placeholder="I'm scared about the future... I don't know if I'm making the right decisions..."
                className="w-full min-h-40 p-6 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-gray-800 placeholder-gray-400 text-base resize-none"
                autoFocus
              />

              {hasValidated && worry.trim() && (
                <p className="text-center text-sm text-purple-600 animate-in fade-in-50">
                  ✓ Thank you — acknowledging it is the first step.
                </p>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep('intro')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleExternalizeSubmit}
                  disabled={!worry.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white"
                  size="lg"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Categorization */}
          {step === 'categorize' && (
            <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Can you do something about this worry right now?
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Some worries need action. Others just need space.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleCategorize('yes')}
                  className="p-6 rounded-2xl border-2 border-purple-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-left hover:shadow-lg"
                >
                  <p className="font-semibold text-gray-900 text-base">Yes — I can take action</p>
                  <p className="text-sm text-gray-600 mt-2">This is something I can work on</p>
                </button>

                <button
                  onClick={() => handleCategorize('no')}
                  className="p-6 rounded-2xl border-2 border-purple-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-left hover:shadow-lg"
                >
                  <p className="font-semibold text-gray-900 text-base">No — there's nothing I can do</p>
                  <p className="text-sm text-gray-600 mt-2">This is outside my control</p>
                </button>
              </div>
            </div>
          )}

          {/* Step 4A: Action Builder */}
          {step === 'actionBuilder' && (
            <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Let's turn this into a plan.
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Small steps count. Perfection isn't the goal.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What is one small step you can take?
                  </label>
                  <input
                    type="text"
                    value={actionStep}
                    onChange={(e) => setActionStep(e.target.value)}
                    placeholder="e.g., Write down a plan, talk to someone..."
                    className="w-full p-4 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    When will you do it?
                  </label>
                  <input
                    type="datetime-local"
                    value={actionTime}
                    onChange={(e) => setActionTime(e.target.value)}
                    className="w-full p-4 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep('categorize');
                    setAnswer(null);
                  }}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleActionBuilder}
                  disabled={!actionStep.trim() || !actionTime}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white"
                  size="lg"
                >
                  Store in Box
                </Button>
              </div>
            </div>
          )}

          {/* Step 4B: Acceptance Path */}
          {step === 'acceptancePath' && (
            <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Not all worries can be solved right now — and that's okay.
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  You don't have to solve everything today.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  What type of worry is this?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'future' as TagType, label: 'Future uncertainty', emoji: '🔮' },
                    { id: 'whatif' as TagType, label: 'What-if thought', emoji: '🤔' },
                    { id: 'fear' as TagType, label: 'Fear-based worry', emoji: '😰' },
                    { id: 'memory' as TagType, label: 'Emotional memory', emoji: '💭' }
                  ].map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => setSelectedTag(tag.id)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        selectedTag === tag.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-purple-200 hover:border-purple-300'
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900">{tag.emoji} {tag.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep('categorize');
                    setAnswer(null);
                  }}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleAcceptancePath}
                  disabled={!selectedTag}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white"
                  size="lg"
                >
                  Store in Box
                </Button>
              </div>
            </div>
          )}

          {/* GIF Display Screen */}
          {step === 'gifDisplay' && (
            <div className="text-center space-y-6 animate-in fade-in-50">
              <img
                src="/gifs/like-that.gif"
                alt="Like that - lets go"
                title="Like that - lets go"
                className="rounded-2xl shadow-lg mx-auto"
                style={{ width: '150px', height: '150px' }}
              />
            </div>
          )}

          {/* Step 5: Storage Animation */}
          {step === 'storage' && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="text-center mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Storing your worry...
                </h2>
                <p className="text-gray-600 text-sm">
                  Your mind doesn't need to hold this right now. It's safely stored.
                </p>
              </div>

              <div className="flex justify-center py-12">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="rounded-2xl"
                  style={{ background: 'transparent' }}
                />
              </div>
            </div>
          )}

          {/* Step 6: Closing Screen */}
          {step === 'closing' && (
            <div className="text-center space-y-6 animate-in fade-in-50 slide-in-from-bottom-4">
              <div className="mb-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9b87f5, #7c3aed)' }}>
                  <span className="text-6xl sm:text-7xl">✓</span>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Well Done.
                </h2>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
                  You organized what was overwhelming. That's progress.
                </p>
                <p className="text-gray-600 text-sm sm:text-base">
                  You are allowed to rest. You can return to this later—only if and when you choose.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => {
                    setStep('externalize');
                    setWorry('');
                    setHasValidated(false);
                    setAnswer(null);
                    setActionStep('');
                    setActionTime('');
                    setSelectedTag(null);
                  }}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Add Another Worry
                </Button>
                <Button
                  onClick={handleReturnHome}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-500 text-white"
                  size="lg"
                >
                  Return Home
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
