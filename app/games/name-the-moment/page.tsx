"use client";

import { useState, useEffect } from "react";
import { AppFooter } from "@/components/app-footer";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Gamepad2 } from "lucide-react";
import { useLogGameActivity } from '@/hooks/use-log-game-activity';

type Step =
  | "start"
  | "breathe"
  | "emotion"
  | "intensity"
  | "reflection"
  | "complete";

interface ValidationMessage {
  category: string;
  message: string;
}

const emotionList = [
  "Calm",
  "Sad",
  "Stressed",
  "Angry",
  "Overwhelmed",
  "Lonely",
  "Grateful",
  "Proud",
  "Confused",
  "Hopeful",
  "Tired",
  "Numb",
];

const emotionValidations: { [key: string]: string } = {
  calm: "It's okay to feel good. Breathe in that peace.",
  sad: "Sadness is a sign of caring. Your feelings are valid.",
  stressed:
    "Stress doesn't mean you're failing — it means you're carrying too much alone.",
  angry: "Anger is often a boundary, not a flaw.",
  overwhelmed:
    "It's okay to feel overwhelmed. You don't have to handle everything alone.",
  lonely:
    "Loneliness is a signal that you need connection. You deserve to be seen.",
  grateful:
    "Gratitude is a sign of presence and awareness. You're noticing what matters.",
  proud: "Pride in yourself is not arrogance — it's self-respect.",
  confused:
    "Confusion means you're learning. It's okay not to have all the answers.",
  hopeful: "Hope is a powerful force. Hold onto it gently.",
  tired: "Rest is not laziness — it's essential. You deserve care.",
  numb: "Numbness is a sign your mind and body are protecting you. That's okay.",
};

const getEmotionIntensityEmoji = (intensity: number): string => {
  if (intensity <= 2) return "🌱";
  if (intensity <= 4) return "🌿";
  if (intensity <= 6) return "💭";
  if (intensity <= 8) return "⚡";
  return "🔥";
};

export default function NameTheMoment() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("start");
  const [breatheTimeLeft, setBreatheTimeLeft] = useState(5);
  const [emotion, setEmotion] = useState("");
  const [isCustomEmotion, setIsCustomEmotion] = useState(false);
  const [intensity, setIntensity] = useState(5);
  const [reflection, setReflection] = useState("");
  const [showReflectionSkip, setShowReflectionSkip] = useState(false);

  useLogGameActivity('Name the Moment', currentStep !== 'start');

  // Breathing countdown
  useEffect(() => {
    if (currentStep === "breathe" && breatheTimeLeft > 0) {
      const timer = setTimeout(() => {
        setBreatheTimeLeft(breatheTimeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentStep === "breathe" && breatheTimeLeft === 0) {
      setCurrentStep("emotion");
    }
  }, [currentStep, breatheTimeLeft]);

  const handleEmotionSelect = (selectedEmotion: string) => {
    setEmotion(selectedEmotion);
    setIsCustomEmotion(false);
  };

  const handleCustomEmotion = (value: string) => {
    setEmotion(value);
    setIsCustomEmotion(true);
  };

  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntensity(parseInt(e.target.value));
  };

  const handleNext = () => {
    if (currentStep === "start") {
      setBreatheTimeLeft(5);
      setCurrentStep("breathe");
    } else if (currentStep === "emotion" && emotion) {
      setCurrentStep("intensity");
    } else if (currentStep === "intensity") {
      setShowReflectionSkip(true);
      setCurrentStep("reflection");
    } else if (currentStep === "reflection") {
      setCurrentStep("complete");
    }
  };

  const handleSkipReflection = () => {
    setCurrentStep("complete");
  };

  const handleReset = () => {
    setCurrentStep("start");
    setEmotion("");
    setIsCustomEmotion(false);
    setIntensity(5);
    setReflection("");
    setShowReflectionSkip(false);
    setBreatheTimeLeft(5);
  };

  const handleReturnToGames = () => {
    router.push("/games-and-activities");
  };

  const getValidationMessage = (): string => {
    const emotionLower = emotion.toLowerCase();
    return emotionValidations[emotionLower] || emotionValidations["calm"];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.back()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white text-xs sm:text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="animate-fadeIn">
          {/* Start Screen */}
          {currentStep === "start" && (
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-6">
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Name the Moment
                  </h1>

                  <p className="text-sm md:text-base text-gray-600">
                    Notice what you feel - an{" "}
                    <span className="font-bold">
                      Emotional Awareness Approach
                    </span>
                  </p>

                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
                    Take a slow breath. Let's gently check in with how you're
                    feeling right now.
                  </p>

                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 md:p-6 rounded my-8">
                    <p className="text-gray-700 italic">
                      "Whatever you feel is allowed. There's no right or wrong
                      emotion."
                    </p>
                  </div>

                  <Button
                    onClick={handleNext}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white text-lg px-8 py-6"
                  >
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Breathing Pause */}
          {currentStep === "breathe" && (
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Just notice your breath
                  </h1>

                  <p className="text-lg text-gray-600">
                    No need to control it. Simply observe.
                  </p>

                  {/* Breathing Animation */}
                  <div className="flex justify-center py-8">
                    <div
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center animate-pulse"
                      style={{
                        animation:
                          "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                      }}
                    >
                      <span className="text-5xl md:text-6xl font-bold text-blue-600">
                        {breatheTimeLeft}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600">
                    Take your time. There's no rush.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Emotion Selection */}
          {currentStep === "emotion" && (
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="space-y-6">
                  <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      What are you feeling?
                    </h1>
                    <p className="text-gray-600">
                      Choose or type the emotion that feels closest — even if
                      it's uncertain.
                    </p>
                  </div>

                  {/* Emotion Buttons */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {emotionList.map((e) => (
                      <Button
                        key={e}
                        onClick={() => handleEmotionSelect(e)}
                        variant={
                          emotion === e && !isCustomEmotion
                            ? "default"
                            : "outline"
                        }
                        className={
                          emotion === e && !isCustomEmotion
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            : "text-gray-700"
                        }
                      >
                        {e}
                      </Button>
                    ))}
                  </div>

                  <div className="border-t pt-6">
                    <p className="text-sm text-gray-600 mb-3">
                      Or type in your own words:
                    </p>
                    <Textarea
                      value={isCustomEmotion ? emotion : ""}
                      onChange={(e) => handleCustomEmotion(e.target.value)}
                      placeholder="Type what you're feeling in your own words…"
                      className="min-h-20 resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleNext}
                    disabled={!emotion}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 disabled:opacity-50 text-white"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Intensity Slider */}
          {currentStep === "intensity" && (
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="space-y-8">
                  <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      How strong is this feeling?
                    </h1>
                    <p className="text-gray-600">
                      Reflect on the intensity on a scale of 1 to 10.
                    </p>
                  </div>

                  {/* Slider */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Mild</span>
                      <span className="text-3xl font-bold">
                        {getEmotionIntensityEmoji(intensity)}
                      </span>
                      <span className="text-sm text-gray-600">Strong</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={intensity}
                      onChange={handleIntensityChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="text-center">
                      <span className="text-4xl font-bold text-blue-600">
                        {intensity}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleNext}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reflection Prompt */}
          {currentStep === "reflection" && (
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="space-y-6">
                  <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      Reflect
                    </h1>
                    <p className="text-gray-600">
                      If this feeling had a voice, what would it say?
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700 italic">
                      Examples: "I need rest." • "I feel unseen." • "I'm proud
                      of myself." • "Everything feels loud right now."
                    </p>
                  </div>

                  <Textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="What does your feeling want to tell you?"
                    className="min-h-32 resize-none"
                  />

                  <div className="flex gap-3 flex-col md:flex-row">
                    <Button
                      onClick={handleSkipReflection}
                      variant="outline"
                      size="lg"
                      className="w-full md:flex-1"
                    >
                      Skip
                    </Button>
                    <Button
                      onClick={handleNext}
                      size="lg"
                      className="w-full md:flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completion Screen */}
          {currentStep === "complete" && (
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="space-y-8 text-center">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">✨</h1>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      {emotion}
                    </h2>
                  </div>

                  {/* Emotion Details */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Intensity:</span>{" "}
                      {intensity}/10 {getEmotionIntensityEmoji(intensity)}
                    </p>
                    {reflection && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">What it said:</span>{" "}
                        <em>"{reflection}"</em>
                      </p>
                    )}
                  </div>

                  {/* Validation Message */}
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded">
                    <p className="text-lg text-gray-700 italic leading-relaxed">
                      "{getValidationMessage()}"
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-gray-700 font-semibold mb-6">
                      You did something meaningful — you noticed your
                      experience.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-col md:flex-row">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      size="lg"
                      className="w-full md:flex-1"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Start Another
                    </Button>
                    <Button
                      onClick={handleReturnToGames}
                      size="lg"
                      className="w-full md:flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white"
                    >
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Return to Games
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Information Section - Always Visible */}
          <div className="max-w-2xl mx-auto pt-12 border-t border-gray-200 mt-12">
            <div className="space-y-8">
              {/* What is Name the Moment */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  What is Name the Moment?
                </h2>
                <p className="text-gray-700 leading-relaxed text-justify">
                  Name the Moment is a compassionate emotional check-in practice
                  that helps you recognize and label your current emotional
                  state in a gentle, mindful, and non-judgmental way. Rather
                  than trying to fix or change your emotions, this practice
                  focuses on increasing emotional awareness and
                  grounding—creating space to observe what you're feeling
                  without criticism or resistance. It's a foundational skill in
                  both mindfulness and cognitive behavioral therapy for building
                  emotional intelligence and self-compassion.
                </p>
              </div>

              {/* How It Works */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  How It Works
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed text-justify">
                    <span className="font-semibold text-blue-600">
                      Pause & Breathe:
                    </span>{" "}
                    Begin with a gentle 5-second breathing moment to settle your
                    nervous system and create space for self-awareness.
                  </p>
                  <p className="leading-relaxed text-justify">
                    <span className="font-semibold text-blue-600">
                      Identify Your Emotion:
                    </span>{" "}
                    Choose an emotion from the list or describe your feeling in
                    your own words. There's no "right" emotion—whatever you're
                    experiencing is valid.
                  </p>
                  <p className="leading-relaxed text-justify">
                    <span className="font-semibold text-blue-600">
                      Rate the Intensity:
                    </span>{" "}
                    On a scale of 1-10, reflect on how strong this feeling is.
                    This helps you understand the depth of your experience.
                  </p>
                  <p className="leading-relaxed text-justify">
                    <span className="font-semibold text-blue-600">
                      Reflect (Optional):
                    </span>{" "}
                    If the feeling had a voice, what would it say? This deepens
                    your understanding and connection to your emotions.
                  </p>
                  <p className="leading-relaxed text-justify">
                    <span className="font-semibold text-blue-600">
                      Receive Validation:
                    </span>{" "}
                    Get a compassionate, emotion-specific message that validates
                    your experience and reminds you that you're not alone.
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Benefits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold text-blue-700 mb-2">
                      Increases Emotional Awareness
                    </p>
                    <p className="text-gray-700 text-sm text-justify">
                      By naming and acknowledging what you feel, you develop
                      deeper insight into your emotional patterns and triggers.
                      This awareness is the foundation for emotional growth and
                      self-understanding.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold text-blue-700 mb-2">
                      Reduces Emotional Overwhelm
                    </p>
                    <p className="text-gray-700 text-sm text-justify">
                      Naming an emotion decreases its intensity. When you
                      observe and validate your feelings instead of suppressing
                      them, you process them more quickly and move through them
                      with greater ease.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold text-blue-700 mb-2">
                      Builds Self-Compassion
                    </p>
                    <p className="text-gray-700 text-sm text-justify">
                      This practice teaches you to meet yourself with kindness
                      rather than judgment. By validating your experience, you
                      cultivate a compassionate inner voice that supports you
                      through difficult moments.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold text-blue-700 mb-2">
                      Enhances Emotional Resilience
                    </p>
                    <p className="text-gray-700 text-sm text-justify">
                      Regular practice rewires your brain to respond to emotions
                      with curiosity rather than avoidance. Over time, you
                      develop greater emotional flexibility and resilience in
                      navigating life's challenges.
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4 text-justify">
                  By practicing Name the Moment regularly, you transform your
                  relationship with emotions. Instead of being overwhelmed by
                  what you feel, you become a compassionate observer of your
                  inner world. This simple yet powerful practice—just a few
                  minutes—can anchor you in the present moment, soothe your
                  nervous system, and help you navigate life with greater
                  emotional clarity and self-love.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
