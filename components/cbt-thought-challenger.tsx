'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type ThoughtChallenge = {
  automaticThought: string;
  evidence: string;
  counterEvidence: string;
  balancedThought: string;
  mood: string;
};

export function CBTThoughtChallenger() {
  const [step, setStep] = useState<'input' | 'challenge' | 'reframe'>('input');
  const [challenge, setChallenge] = useState<ThoughtChallenge>({
    automaticThought: '',
    evidence: '',
    counterEvidence: '',
    balancedThought: '',
    mood: '',
  });

  const handleInputChange = (field: keyof ThoughtChallenge, value: string) => {
    setChallenge({ ...challenge, [field]: value });
  };

  const isStepValid = () => {
    if (step === 'input') {
      return challenge.automaticThought.trim().length > 0 && challenge.mood.trim().length > 0;
    }
    if (step === 'challenge') {
      return challenge.evidence.trim().length > 0 && challenge.counterEvidence.trim().length > 0;
    }
    return challenge.balancedThought.trim().length > 0;
  };

  const handleNext = () => {
    if (step === 'input') {
      setStep('challenge');
    } else if (step === 'challenge') {
      setStep('reframe');
    }
  };

  const handleReset = () => {
    setStep('input');
    setChallenge({
      automaticThought: '',
      evidence: '',
      counterEvidence: '',
      balancedThought: '',
      mood: '',
    });
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Title and Description */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">CBT Thought-Challenger</h1>
        <p className="text-gray-600">
          Challenge unhelpful thinking patterns using <strong>Cognitive Behavioral Therapy</strong> techniques.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between gap-2 md:gap-4">
        {['input', 'challenge', 'reframe'].map((s, i) => (
          <div
            key={s}
            className={`flex-1 h-2 rounded-full transition-colors ${
              ['input', 'challenge', 'reframe'].indexOf(step) >= i
                ? 'bg-gradient-to-r from-primary to-accent'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Identify */}
      {step === 'input' && (
        <div className="border-2 border-primary/20 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold text-gray-900">Step 1: Identify Your Automatic Thought</h2>
          </div>
          <p className="text-gray-600">What's the negative thought that's bothering you?</p>
          
          <div>
            <Label htmlFor="thought">Your thought</Label>
            <Textarea
              id="thought"
              placeholder="e.g., 'I'm a complete failure'"
              value={challenge.automaticThought}
              onChange={(e) => handleInputChange('automaticThought', e.target.value)}
              className="min-h-32 mt-2"
            />
          </div>

          <div>
            <Label htmlFor="mood">Associated feeling</Label>
            <Input
              id="mood"
              placeholder="e.g., sad, anxious, ashamed"
              value={challenge.mood}
              onChange={(e) => handleInputChange('mood', e.target.value)}
              className="mt-2"
            />
          </div>

          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>These automatic thoughts feel true but aren't necessarily based on facts.</AlertDescription>
          </Alert>

          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            Continue
          </Button>
        </div>
      )}

      {/* Step 2: Challenge */}
      {step === 'challenge' && (
        <div className="border-2 border-accent/20 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Step 2: Examine the Evidence</h2>
          </div>
          <p className="text-gray-600">Investigate the thought from both angles.</p>

          <Alert className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">
              <strong>Your thought:</strong> "{challenge.automaticThought}"
            </AlertDescription>
          </Alert>

          <div>
            <Label htmlFor="evidence">Evidence FOR the thought</Label>
            <Textarea
              id="evidence"
              placeholder="What facts support this belief?"
              value={challenge.evidence}
              onChange={(e) => handleInputChange('evidence', e.target.value)}
              className="min-h-28 mt-2"
            />
          </div>

          <div>
            <Label htmlFor="counterEvidence">Evidence AGAINST the thought</Label>
            <Textarea
              id="counterEvidence"
              placeholder="What contradicts this belief? Times you proved it wrong?"
              value={challenge.counterEvidence}
              onChange={(e) => handleInputChange('counterEvidence', e.target.value)}
              className="min-h-28 mt-2"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('input')} className="flex-1">
              Back
            </Button>
            <Button onClick={handleNext} disabled={!isStepValid()} className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90">
              Create Balanced Thought
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Reframe */}
      {step === 'reframe' && (
        <div className="border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Step 3: Create a Balanced Thought</h2>
          </div>
          <p className="text-gray-600">Develop a realistic perspective that acknowledges both sides.</p>

          <Alert className="bg-amber-50 border-amber-200">
            <AlertDescription className="text-amber-900">
              <strong>Original:</strong> "{challenge.automaticThought}"
            </AlertDescription>
          </Alert>

          <div>
            <Label htmlFor="balanced">Your balanced thought</Label>
            <Textarea
              id="balanced"
              placeholder="A thought that's honest, realistic, and acknowledges your strengths..."
              value={challenge.balancedThought}
              onChange={(e) => handleInputChange('balancedThought', e.target.value)}
              className="min-h-32 mt-2"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('challenge')} className="flex-1">
              Back
            </Button>
            <Button onClick={handleReset} className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90">
              Challenge Another Thought
            </Button>
          </div>
        </div>
      )}

      {/* Information Section */}
      <div className="pt-12 border-t border-gray-200 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is CBT Thought-Challenger?</h2>
          <p className="text-gray-700 leading-relaxed">
            CBT Thought-Challenger helps you challenge and restructure unhelpful thinking patterns. By examining your automatic negative thoughts through a structured process, you can identify thinking distortions, gather evidence, and develop more balanced perspectives.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="space-y-3 text-gray-700">
            <p><span className="font-semibold text-primary">Step 1 - Identify:</span> Write down the automatic negative thought and associated mood.</p>
            <p><span className="font-semibold text-primary">Step 2 - Challenge:</span> Examine evidence FOR and AGAINST the thought.</p>
            <p><span className="font-semibold text-primary">Step 3 - Reframe:</span> Develop a balanced thought that's honest and realistic.</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits & Mood Uplift</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="font-semibold text-primary mb-2">🎯 Breaks Thought Spirals</p>
              <p className="text-gray-700 text-sm">Examining evidence interrupts automatic negative thinking patterns.</p>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="font-semibold text-primary mb-2">😌 Reduces Anxiety</p>
              <p className="text-gray-700 text-sm">Moving from absolutist thoughts to realistic ones reduces emotional intensity.</p>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="font-semibold text-primary mb-2">💝 Builds Self-Compassion</p>
              <p className="text-gray-700 text-sm">Balanced thoughts acknowledge struggles while recognizing strengths.</p>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="font-semibold text-primary mb-2">✨ Enables Action</p>
              <p className="text-gray-700 text-sm">Realistic thoughts make you more likely to take helpful steps forward.</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed mt-4">
            By practicing cognitive restructuring regularly, you train your mind to automatically question unhelpful thoughts. Make it a daily habit to experience lasting improvements in mood and emotional resilience.
          </p>
        </div>
      </div>
    </div>
  );
}
