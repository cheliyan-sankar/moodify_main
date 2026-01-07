"use client";

import { useState, useEffect } from "react";
import { AppFooter } from "@/components/app-footer";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Gamepad2, Volume2, VolumeX } from "lucide-react";
import { useAmbientSound } from "@/hooks/use-ambient-sound";
import { useLogGameActivity } from '@/hooks/use-log-game-activity';

type Step =
  | "start"
  | "step1"
  | "step2"
  | "step3"
  | "step4"
  | "step5"
  | "complete";

interface StepConfig {
  prompt: string;
  count: number;
  field: "see" | "touch" | "hear" | "smell" | "anchor";
  label: string;
  affirmation: string;
  inputPlaceholder: string;
}

export default function DescribeRoom() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("start");
  const [ambientSoundEnabled, setAmbientSoundEnabled] = useState(true);
  const [responses, setResponses] = useState({
    see: ["", "", "", "", ""],
    touch: ["", "", "", ""],
    hear: ["", "", ""],
    smell: ["", ""],
    anchor: [""],
  });

  useAmbientSound(ambientSoundEnabled, 0.5);

  useLogGameActivity('Describe Room', currentStep !== 'start');

  const stepData: { [key: string]: StepConfig } = {
    step1: {
      prompt:
        "Look around slowly. Name five things you can see in your room - shapes, colors, or objects.",
      count: 5,
      field: "see" as const,
      label: "5 Things You Can See",
      affirmation: "There's no rush. You're doing great by noticing.",
      inputPlaceholder: "e.g., brown desk, window, books",
    },
    step2: {
      prompt:
        "Now notice the things around you that you can touch. Describe four textures or objects.",
      count: 4,
      field: "touch" as const,
      label: "4 Things You Can Touch",
      affirmation: "Feel these textures — you're grounding yourself.",
      inputPlaceholder: "e.g., soft blanket, cold handle",
    },
    step3: {
      prompt:
        "Pause and listen. Describe three sounds — even small or distant ones.",
      count: 3,
      field: "hear" as const,
      label: "3 Things You Can Hear",
      affirmation: "Listen without judgment. Each sound anchors you.",
      inputPlaceholder: "e.g., fan, footsteps, typing",
    },
    step4: {
      prompt:
        "Notice any scents in the room. If you don't smell anything clearly, imagine a scent you enjoy.",
      count: 2,
      field: "smell" as const,
      label: "2 Things You Can Smell",
      affirmation: "Scents connect us to our present moment.",
      inputPlaceholder: "e.g., coffee, perfume, fresh laundry",
    },
    step5: {
      prompt:
        "Finally, name one thing in the room that makes you feel comfortable, happy, or safe.",
      count: 1,
      field: "anchor" as const,
      label: "1 Positive Anchor",
      affirmation: "This one thing reminds you that you're safe here.",
      inputPlaceholder: "What makes you feel safe?",
    },
  };

  const handleNext = () => {
    if (currentStep === "start") setCurrentStep("step1");
    else if (currentStep === "step1") setCurrentStep("step2");
    else if (currentStep === "step2") setCurrentStep("step3");
    else if (currentStep === "step3") setCurrentStep("step4");
    else if (currentStep === "step4") setCurrentStep("step5");
    else if (currentStep === "step5") setCurrentStep("complete");
  };

  const handleBack = () => {
    if (currentStep === "step1") setCurrentStep("start");
    else if (currentStep === "step2") setCurrentStep("step1");
    else if (currentStep === "step3") setCurrentStep("step2");
    else if (currentStep === "step4") setCurrentStep("step3");
    else if (currentStep === "step5") setCurrentStep("step4");
  };

  const handleReset = () => {
    setCurrentStep("start");
    setResponses({
      see: ["", "", "", "", ""],
      touch: ["", "", "", ""],
      hear: ["", "", ""],
      smell: ["", ""],
      anchor: [""],
    });
  };

  const handleInputChange = (
    field: "see" | "touch" | "hear" | "smell" | "anchor",
    index: number,
    value: string,
  ) => {
    setResponses({
      ...responses,
      [field]: responses[field].map((item, i) => (i === index ? value : item)),
    });
  };

  const handleSave = () => {
    const entry = {
      timestamp: new Date().toISOString(),
      responses,
    };
    const saved = localStorage.getItem("describeRoomEntries") || "[]";
    const entries = JSON.parse(saved);
    entries.push(entry);
    localStorage.setItem("describeRoomEntries", JSON.stringify(entries));
  };

  const isStepValid = () => {
    if (currentStep === "step1")
      return responses.see.some((item) => item.trim().length > 0);
    if (currentStep === "step2")
      return responses.touch.some((item) => item.trim().length > 0);
    if (currentStep === "step3")
      return responses.hear.some((item) => item.trim().length > 0);
    if (currentStep === "step4")
      return responses.smell.some((item) => item.trim().length > 0);
    if (currentStep === "step5")
      return responses.anchor.some((item) => item.trim().length > 0);
    return true;
  };

  const progressSteps = ["step1", "step2", "step3", "step4", "step5"];
  const currentStepIndex = progressSteps.indexOf(currentStep as any);
  const progress =
    currentStep === "complete"
      ? 100
      : ((currentStepIndex + 1) / progressSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.back()}
              className="bg-gradient-to-r from-orange-400 to-amber-500 hover:opacity-90 text-white text-xs sm:text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={() => setAmbientSoundEnabled(!ambientSoundEnabled)}
              className="bg-gradient-to-r from-orange-400 to-amber-500 hover:opacity-90 text-white text-xs sm:text-sm"
              title={ambientSoundEnabled ? "Mute sound" : "Unmute sound"}
            >
              {ambientSoundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="animate-fadeIn">
          {/* Start Screen */}
          {currentStep === "start" && (
            <Card className="border-2 border-orange-200 shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-6">
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    Describe Your Room
                  </h1>

                  <p className="text-sm md:text-base text-gray-600">
                    Slow down. Look around. Find calm - a{" "}
                    <span className="font-bold">Sensory Grounding</span>{" "}
                    Approach.
                  </p>

                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
                    Take a slow breath and look around you. Noticing your
                    environment can help calm your mind and bring you back to
                    the present moment.
                  </p>

                  <div className="bg-orange-50 border-l-4 border-orange-400 p-4 md:p-6 rounded my-8">
                    <p className="text-gray-700 italic">
                      "There's no rush. Just notice, not judge. You're safe
                      here."
                    </p>
                  </div>

                  <Button
                    onClick={handleNext}
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white text-lg px-8 py-6"
                  >
                    Begin
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 1-5 */}
          {["step1", "step2", "step3", "step4", "step5"].includes(
            currentStep,
          ) && (
            <Card className="border-2 border-orange-200 shadow-lg">
              <CardContent className="p-8 md:p-12">
                {/* Title and Tagline */}
                <div className="text-center space-y-2 mb-8">
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    Describe Your Room
                  </h1>
                  <p className="text-sm md:text-base text-gray-600">
                    Slow down. Look around. Find calm — a{" "}
                    <span className="font-bold">Sensory Grounding</span>{" "}
                    Approach.
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{currentStepIndex + 1} of 5</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Step Content */}
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {stepData[currentStep as keyof typeof stepData].label}
                    </h2>
                  </div>

                  <p className="text-center text-gray-700 text-lg">
                    {stepData[currentStep as keyof typeof stepData].prompt}
                  </p>

                  {/* Individual Input Fields */}
                  <div className="space-y-3">
                    {Array.from({
                      length:
                        stepData[currentStep as keyof typeof stepData].count,
                    }).map((_, index) => (
                      <div key={index}>
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">
                          {stepData[currentStep as keyof typeof stepData]
                            .field === "see" && `Object ${index + 1}`}
                          {stepData[currentStep as keyof typeof stepData]
                            .field === "touch" && `Object ${index + 1}`}
                          {stepData[currentStep as keyof typeof stepData]
                            .field === "hear" && `Sound ${index + 1}`}
                          {stepData[currentStep as keyof typeof stepData]
                            .field === "smell" && `Scent ${index + 1}`}
                          {stepData[currentStep as keyof typeof stepData]
                            .field === "anchor" && `Your Anchor`}
                        </label>
                        <Input
                          placeholder={
                            stepData[currentStep as keyof typeof stepData]
                              .inputPlaceholder
                          }
                          value={
                            responses[
                              stepData[currentStep as keyof typeof stepData]
                                .field
                            ][index]
                          }
                          onChange={(e) =>
                            handleInputChange(
                              stepData[currentStep as keyof typeof stepData]
                                .field,
                              index,
                              e.target.value,
                            )
                          }
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Affirmation Message */}
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                    <p className="text-gray-700 text-sm">
                      {
                        stepData[currentStep as keyof typeof stepData]
                          .affirmation
                      }
                    </p>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8 justify-between">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="px-6"
                  >
                    Back
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white px-8 disabled:opacity-50"
                  >
                    {currentStep === "step5" ? "Complete" : "Next"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completion Screen */}
          {currentStep === "complete" && (
            <Card className="border-2 border-green-200 shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-8">
                  <div className="text-6xl mb-4">✨</div>

                  <h2 className="text-4xl font-bold text-green-700">
                    Beautiful job.
                  </h2>

                  <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
                    You showed up and grounded yourself. You're here, and you're
                    safe.
                  </p>

                  <div className="bg-green-50 border-l-4 border-green-400 p-6 md:p-8 rounded-lg space-y-2">
                    <p className="text-gray-800 font-semibold text-lg">
                      You are capable.
                    </p>
                    <p className="text-gray-800 font-semibold text-lg">
                      You are present.
                    </p>
                    <p className="text-gray-800 font-semibold text-lg">
                      Your nervous system is calming.
                    </p>
                  </div>

                  {/* Summary of Responses */}
                  <div className="bg-gray-50 p-6 rounded-lg text-left space-y-4">
                    <h3 className="font-bold text-gray-900 mb-4">
                      Your Journey:
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-semibold text-orange-600 mb-1">
                          Saw:
                        </p>
                        <ul className="ml-4 space-y-1 text-gray-700">
                          {responses.see.map(
                            (item, i) => item && <li key={i}>• {item}</li>,
                          )}
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-orange-600 mb-1">
                          Touched:
                        </p>
                        <ul className="ml-4 space-y-1 text-gray-700">
                          {responses.touch.map(
                            (item, i) => item && <li key={i}>• {item}</li>,
                          )}
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-orange-600 mb-1">
                          Heard:
                        </p>
                        <ul className="ml-4 space-y-1 text-gray-700">
                          {responses.hear.map(
                            (item, i) => item && <li key={i}>• {item}</li>,
                          )}
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-orange-600 mb-1">
                          Smelled:
                        </p>
                        <ul className="ml-4 space-y-1 text-gray-700">
                          {responses.smell.map(
                            (item, i) => item && <li key={i}>• {item}</li>,
                          )}
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-orange-600 mb-1">
                          Anchor:
                        </p>
                        <p className="text-gray-700">• {responses.anchor[0]}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
                    <Button
                      onClick={handleReset}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white px-6"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restart Exercise
                    </Button>

                    <Button
                      onClick={() => router.push("/games-and-activities")}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white px-6"
                    >
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Return to Games
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Information Section - Always visible */}
          <div className="max-w-2xl mx-auto pt-12 border-t border-orange-200 mt-12">
            <div className="space-y-8">
              {/* What is Describe Your Room */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  What is Describe Your Room?
                </h2>
                <p className="text-gray-700 leading-relaxed text-justify">
                  Describe Your Room is a sensory-based grounding exercise
                  rooted in the 5-4-3-2-1 mindfulness technique. By engaging all
                  five senses and focusing on your immediate environment, you
                  anchor yourself firmly in the present moment. This practice
                  interrupts anxiety spirals and brings your mind and body back
                  to safety, presence, and stillness right here and now.
                </p>
              </div>

              {/* How It Works */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  How It Works
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed text-justify">
                    <span className="font-semibold text-orange-600">
                      5 Things You Can See:
                    </span>{" "}
                    Look around slowly and notice five things in your room —
                    colors, shapes, textures, or objects. Observe without
                    judgment, letting your visual awareness anchor you.
                  </p>
                  <p className="leading-relaxed text-justify">
                    <span className="font-semibold text-orange-600">
                      4 Things You Can Touch:
                    </span>{" "}
                    Describe four textures or objects you can physically feel
                    around you. Notice the sensation of fabric, temperature,
                    surfaces, or the air on your skin.
                  </p>
                  <p className="leading-relaxed text-justify">
                    <span className="font-semibold text-orange-600">
                      3 Things You Can Hear:
                    </span>{" "}
                    Pause and listen carefully for three sounds in your
                    environment — even small or distant ones. These could be
                    natural sounds, ambient noise, or subtle environmental
                    sounds.
                  </p>
                  <p className="leading-relaxed text-justify">
                    <span className="font-semibold text-orange-600">
                      2 Things You Can Smell:
                    </span>{" "}
                    Notice any scents in your room. If you don't smell anything
                    clearly, imagine a scent you enjoy. Smell connects us
                    powerfully to the present moment.
                  </p>
                  <p className="leading-relaxed text-justify">
                    <span className="font-semibold text-orange-600">
                      1 Positive Anchor:
                    </span>{" "}
                    Finally, name one thing in your room that makes you feel
                    comfortable, happy, or safe. This anchors you to a feeling
                    of security and presence.
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Benefits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="font-semibold text-orange-700 mb-2">
                      Instant Grounding
                    </p>
                    <p className="text-gray-700 text-sm text-justify">
                      Pulls you out of anxious thoughts and into your body,
                      creating an immediate sense of safety and presence.
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="font-semibold text-orange-700 mb-2">
                      Sensory Awareness
                    </p>
                    <p className="text-gray-700 text-sm text-justify">
                      Activates all five senses, engaging your mind fully in the
                      present and breaking anxiety loops.
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="font-semibold text-orange-700 mb-2">
                      Mental Clarity
                    </p>
                    <p className="text-gray-700 text-sm text-justify">
                      Redirects racing thoughts toward concrete observations,
                      naturally clearing mental clutter and fog.
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="font-semibold text-orange-700 mb-2">
                      Emotional Calm
                    </p>
                    <p className="text-gray-700 text-sm text-justify">
                      Creates a sense of control and safety by reminding you
                      that your immediate environment is stable and secure.
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4 text-justify">
                  By practicing Describe Your Room regularly, you develop a
                  powerful tool for managing anxiety and panic in real-time.
                  This evidence-based grounding technique helps rewire your
                  nervous system to default to presence rather than worry.
                  Whenever you feel overwhelmed, you can use this exercise to
                  anchor yourself back to safety, clarity, and the present
                  moment in just 1-2 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
