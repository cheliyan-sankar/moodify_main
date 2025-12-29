'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Heart, Sparkles, RefreshCw, Video, VideoOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLogGameActivity } from '@/hooks/use-log-game-activity';

type AffirmationState = {
  challenge: string;
  affirmation: string;
  personalizedAffirmation: string;
  mirrored: boolean;
};

const affirmationSuggestions: { [key: string]: string[] } = {
  'self-criticism': [
    "I am worthy exactly as I am.",
    "I choose to treat myself with kindness and compassion.",
    "My mistakes are opportunities to learn and grow.",
    "I deserve the same compassion I give to others.",
  ],
  'low mood': [
    "This feeling is temporary, and I have the strength to get through it.",
    "I choose to focus on what I can control right now.",
    "My mood can shift when I take care of myself.",
    "I am resilient, and better days are coming.",
  ],
  'anxiety': [
    "I am safe in this moment.",
    "I can handle uncertainty with grace and courage.",
    "My anxiety does not define me or my abilities.",
    "I choose to focus on what is real, not what-ifs.",
  ],
  'imposter syndrome': [
    "I have earned my place here through my efforts and abilities.",
    "I am capable and qualified for this role.",
    "My contributions matter and have value.",
    "I allow myself to take up space and be visible.",
  ],
};

export function AffirmationMirror() {
  const [step, setStep] = useState<'identify' | 'affirm' | 'personalize' | 'mirror'>('identify');
  const [state, setState] = useState<AffirmationState>({
    challenge: '',
    affirmation: '',
    personalizedAffirmation: '',
    mirrored: false,
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [captureBusy, setCaptureBusy] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useLogGameActivity('Affirmation Mirror', step !== 'identify');

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Attach stream to video element when video ref is available
  useEffect(() => {
    if (cameraEnabled && videoRef.current && streamRef.current) {
      try {
        videoRef.current.srcObject = streamRef.current;
        console.log('Stream attached to video element');
      } catch (error) {
        console.error('Error attaching stream:', error);
      }
    }
  }, [cameraEnabled]);

  const handleInputChange = (field: keyof AffirmationState, value: string) => {
    setState({ ...state, [field]: value });
  };

  const getChallengeCategory = (challenge: string): string => {
    const lower = challenge.toLowerCase();
    if (lower.includes('fail') || lower.includes('wrong') || lower.includes('stupid') || lower.includes('bad')) {
      return 'self-criticism';
    }
    if (lower.includes('sad') || lower.includes('down') || lower.includes('depressed') || lower.includes('unhappy')) {
      return 'low mood';
    }
    if (lower.includes('afraid') || lower.includes('nervous') || lower.includes('worry') || lower.includes('anxious')) {
      return 'anxiety';
    }
    if (lower.includes('imposter') || lower.includes('fake') || lower.includes('fraud') || lower.includes('deserve')) {
      return 'imposter syndrome';
    }
    return 'self-criticism';
  };

  const handleGetSuggestions = () => {
    if (!state.challenge.trim()) return;
    const category = getChallengeCategory(state.challenge);
    const categoryAffirmations = affirmationSuggestions[category] || affirmationSuggestions['self-criticism'];
    setSuggestions(categoryAffirmations);
    setStep('affirm');
  };

  const handleSelectAffirmation = (affirmation: string) => {
    setState({ ...state, affirmation, personalizedAffirmation: affirmation });
    setStep('personalize');
  };

  const handlePersonalize = () => {
    if (!state.personalizedAffirmation.trim()) return;
    setStep('mirror');
  };

  const enableCamera = async () => {
    try {
      setCameraError('');
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 }, 
          height: { ideal: 720 }
        },
        audio: false,
      });

      console.log('Camera stream obtained:', stream);
      streamRef.current = stream;
      setCameraEnabled(true);
    } catch (error) {
      const err = error as any;
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera access denied. Please enable camera permissions.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found. Please check your device.');
      } else {
        setCameraError(`Camera error: ${err.message}`);
      }
      setCameraEnabled(false);
    }
  };

  const disableCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraEnabled(false);
    setCameraError('');
  };

  const handleMirror = () => {
    setState({ ...state, mirrored: true });
  };

  const handleCaptureMoment = async () => {
    if (!cameraEnabled || captureBusy) return;
    const video = videoRef.current;
    if (!video) return;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    setCaptureBusy(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Match the on-screen mirrored preview
      ctx.save();
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, width, height);
      ctx.restore();

      // Add a subtle bottom gradient + affirmation text overlay (to match UI)
      const gradient = ctx.createLinearGradient(0, height, 0, height * 0.55);
      gradient.addColorStop(0, 'rgba(0,0,0,0.85)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const text = `"${state.personalizedAffirmation}"`;
      const maxTextWidth = width * 0.88;
      const fontSize = Math.max(24, Math.round(height * 0.045));
      const lineHeight = Math.round(fontSize * 1.25);

      ctx.font = `bold ${fontSize}px system-ui, -apple-system, Segoe UI, sans-serif`;
      ctx.fillStyle = '#fca5c0';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.shadowColor = 'rgba(0,0,0,0.55)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;

      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(testLine).width <= maxTextWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);

      const bottomPadding = Math.round(height * 0.08);
      let y = height - bottomPadding;
      for (let i = lines.length - 1; i >= 0; i--) {
        ctx.fillText(lines[i], Math.round(width / 2), y);
        y -= lineHeight;
      }

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );
      if (!blob) return;

      const fileName = `moodlift-moment-${new Date().toISOString().slice(0, 10)}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      const navAny = navigator as any;
      const canShareFiles = typeof navAny?.canShare === 'function' && navAny.canShare({ files: [file] });
      if (typeof navAny?.share === 'function' && canShareFiles) {
        await navAny.share({
          files: [file],
          title: 'MoodLift Moment',
          text: 'Captured from MoodLift',
        });
        return;
      }

      // Fallback: download the snapshot so it can be shared manually
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (error) {
      console.error('Failed to capture/share moment:', error);
    } finally {
      setCaptureBusy(false);
    }
  };

  const handleReset = () => {
    disableCamera();
    setStep('identify');
    setState({
      challenge: '',
      affirmation: '',
      personalizedAffirmation: '',
      mirrored: false,
    });
    setSuggestions([]);
  };

  const isStepValid = () => {
    if (step === 'identify') {
      return state.challenge.trim().length > 0;
    }
    if (step === 'personalize') {
      return state.personalizedAffirmation.trim().length > 0;
    }
    return true;
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Title and Description */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Affirmation Mirror</h1>
        <p className="text-gray-600">
          A <span className="font-bold">Self-Compassion and Somatic Awareness</span> approach that pairs affirmations with mirror connection to nurture self-love and inner safety.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between gap-2 md:gap-4">
        {['identify', 'affirm', 'personalize', 'mirror'].map((s, i) => (
          <div
            key={s}
            className={`flex-1 h-2 rounded-full transition-colors ${
              ['identify', 'affirm', 'personalize', 'mirror'].indexOf(step) >= i
                ? 'bg-gradient-to-r from-rose-400 to-pink-500'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Identify Challenge */}
      {step === 'identify' && (
        <div className="border-2 border-rose-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl font-bold text-gray-900">Step 1: Name Your Challenge</h2>
          </div>
          <p className="text-gray-600">What's the negative self-talk or challenge you're facing right now?</p>

          <div>
            <Label htmlFor="challenge">Your challenge</Label>
            <Textarea
              id="challenge"
              placeholder="e.g., 'I feel like I'm not good enough' or 'I'm afraid I'll fail'"
              value={state.challenge}
              onChange={(e) => handleInputChange('challenge', e.target.value)}
              className="min-h-32 mt-2"
            />
          </div>

          <Alert className="bg-rose-50 border-rose-200">
            <Heart className="h-4 w-4 text-rose-500" />
            <AlertDescription className="text-rose-800">
              Everyone faces self-doubt. Naming it is the first step to transforming it.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleGetSuggestions}
            disabled={!isStepValid()}
            className="w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:opacity-90"
          >
            Get Affirmations
          </Button>
        </div>
      )}

      {/* Step 2: Choose Affirmation */}
      {step === 'affirm' && (
        <div className="border-2 border-pink-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-500" />
            <h2 className="text-xl font-bold text-gray-900">Step 2: Choose Your Affirmation</h2>
          </div>
          <p className="text-gray-600">Select an affirmation that resonates with you:</p>

          <Alert className="bg-rose-50 border-rose-200">
            <AlertDescription className="text-rose-800">
              <strong>Your challenge:</strong> "{state.challenge}"
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAffirmation(suggestion)}
                className="w-full p-4 text-left border-2 border-pink-200 rounded-lg hover:bg-pink-50 hover:border-pink-500 transition-all group"
              >
                <p className="text-gray-900 font-medium group-hover:text-pink-600 transition-colors">
                  ✨ {suggestion}
                </p>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setStep('identify')}
              className="flex-1"
            >
              Back
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Personalize */}
      {step === 'personalize' && (
        <div className="border-2 border-pink-200 bg-gradient-to-br from-pink-50/50 to-transparent rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-600" />
            <h2 className="text-xl font-bold text-gray-900">Step 3: Make It Your Own</h2>
          </div>
          <p className="text-gray-600">Customize your affirmation to feel more authentic to you:</p>

          <Alert className="bg-amber-50 border-amber-200">
            <AlertDescription className="text-amber-900">
              <strong>Original:</strong> "{state.affirmation}"
            </AlertDescription>
          </Alert>

          <div>
            <Label htmlFor="personalized">Your personalized affirmation</Label>
            <Textarea
              id="personalized"
              placeholder="Adjust the words to make it feel more authentic to you..."
              value={state.personalizedAffirmation}
              onChange={(e) => handleInputChange('personalizedAffirmation', e.target.value)}
              className="min-h-32 mt-2"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setStep('affirm')}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handlePersonalize}
              disabled={!isStepValid()}
              className="flex-1 bg-gradient-to-r from-rose-400 to-pink-500 hover:opacity-90"
            >
              See Your Reflection
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Mirror with Face Display */}
      {step === 'mirror' && (
        <div className="space-y-4">
          <div className="border-2 border-purple-300 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Step 4: Your Affirmation Mirror</h2>
            </div>

            {/* Mirror Display Area - Camera Canvas */}
            <div className="w-full bg-black rounded-2xl border-4 border-purple-300 overflow-hidden relative" style={{ height: '400px' }}>
              {/* Video Element - Always in DOM for ref to work */}
              <video
                ref={videoRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'scaleX(-1)',
                  display: cameraEnabled ? 'block' : 'none'
                }}
                autoPlay
                playsInline
                muted
              />

              {/* Placeholder when camera disabled */}
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                display: cameraEnabled ? 'none' : 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                textAlign: 'center', 
                gap: '1rem' 
              }}>
                <Video className="w-16 h-16 text-gray-400" />
                <div>
                  <p className="text-gray-300 font-medium mb-2">Enable your camera to see your reflection</p>
                  <p className="text-gray-400 text-sm">Your affirmation will appear over your face</p>
                </div>
              </div>

              {/* Affirmation Text Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '1.5rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                pointerEvents: 'none'
              }}>
                {!cameraEnabled && (
                  <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#fca5c0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', textAlign: 'center' }}>
                    Your Affirmation
                  </p>
                )}
                <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#fca5c0', lineHeight: '1.5', textShadow: '0 2px 4px rgba(0,0,0,0.5)', textAlign: 'center' }}>
                  "{state.personalizedAffirmation}"
                </p>
              </div>
            </div>

            {/* Camera Error Message */}
            {cameraError && (
              <Alert className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">
                  {cameraError}
                </AlertDescription>
              </Alert>
            )}

            {/* Camera Controls */}
            <div className="flex gap-2">
              {!cameraEnabled ? (
                <Button
                  onClick={enableCamera}
                  className="w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:opacity-90"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Enable Camera
                </Button>
              ) : (
                <>
                  <Button
                    onClick={disableCamera}
                    variant="outline"
                    className="w-full"
                  >
                    <VideoOff className="w-4 h-4 mr-2" />
                    Close Camera
                  </Button>
                  <Button
                    onClick={handleMirror}
                    className="w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:opacity-90"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Acknowledge This
                  </Button>
                </>
              )}
            </div>

            {/* Success Message */}
            {state.mirrored && (
              <Alert className="bg-green-50 border-green-200">
                <Heart className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  💚 You've acknowledged your worthiness. Repeat this affirmation daily, and you'll rewire your brain toward self-compassion and confidence.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Reset Button */}
          <Button
            onClick={handleCaptureMoment}
            disabled={!cameraEnabled || captureBusy}
            className="w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:opacity-90"
          >
            <Camera className="w-4 h-4 mr-2" />
            Capture Your Moment
          </Button>
          <Button
            onClick={handleReset}
            className="w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:opacity-90"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Transform Another Thought
          </Button>
        </div>
      )}

      {/* Information Section */}
      <div className="pt-12 border-t border-gray-200 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Affirmation Mirror?</h2>
          <p className="text-gray-700 leading-relaxed">
            Affirmation Mirror helps you combat negative self-talk by seeing your face through a lens of self-compassion while reinforcing powerful affirmations. This evidence-based practice combines visualization with positive affirmations to rewire your brain toward self-esteem and emotional resilience.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="space-y-3 text-gray-700">
            <p><span className="font-semibold text-rose-500">Step 1 - Identify:</span> Write down the negative self-talk or challenge you're experiencing.</p>
            <p><span className="font-semibold text-rose-500">Step 2 - Choose:</span> Select from personalized affirmations that counter your specific challenge.</p>
            <p><span className="font-semibold text-rose-500">Step 3 - Personalize:</span> Customize the affirmation to feel more authentic and meaningful to you.</p>
            <p><span className="font-semibold text-rose-500">Step 4 - Reflect:</span> See your face in a mirror with your affirmation displayed, reinforcing self-worthiness and compassion.</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits & Mood Uplift</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
              <p className="font-semibold text-rose-600 mb-2">💪 Rewires Negative Patterns</p>
              <p className="text-gray-700 text-sm">Combining visualization with affirmations creates powerful neural pathways that replace self-criticism with self-compassion.</p>
            </div>
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
              <p className="font-semibold text-rose-600 mb-2">🧠 Boosts Self-Esteem</p>
              <p className="text-gray-700 text-sm">Seeing yourself while affirming your worth increases self-perception and resilience against negative thoughts.</p>
            </div>
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
              <p className="font-semibold text-rose-600 mb-2">💝 Builds Self-Compassion</p>
              <p className="text-gray-700 text-sm">The mirror effect reminds you that you deserve kindness and care—especially from yourself during difficult moments.</p>
            </div>
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
              <p className="font-semibold text-rose-600 mb-2">✨ Improves Mood & Anxiety</p>
              <p className="text-gray-700 text-sm">Visualization combined with affirmations reduces anxiety and naturally elevates your emotional state.</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed mt-4">
            Make this a daily practice for maximum effectiveness. Many people experience meaningful shifts in their self-perception and confidence within 2-4 weeks of consistent practice.
          </p>
        </div>
      </div>
    </div>
  );
}
