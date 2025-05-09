"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Mic, MicOff, Loader2, Zap, AlertCircle } from "lucide-react";
import {
  checkSpeechRecognitionSupport,
  initSpeechRecognition,
  type SpeechRecognitionState,
} from "@/lib/webspeech/speechRecognition";
import type { FlowStep } from "@/types/flow";

interface BriefInputProps {
  onBriefChange: (brief: string) => void;
  onGenerateFlow: (steps: FlowStep[]) => void;
  maxLength?: number;
}

export function BriefInput({
  onBriefChange,
  onGenerateFlow,
  maxLength = 1000,
}: BriefInputProps) {
  const [brief, setBrief] = useState("");
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recognitionState, setRecognitionState] =
    useState<SpeechRecognitionState>({
      isListening: false,
      transcript: "",
      error: null,
    });
  const recognitionRef = useRef<ReturnType<
    typeof initSpeechRecognition
  > | null>(null);

  useEffect(() => {
    const support = checkSpeechRecognitionSupport();
    setIsVoiceSupported(support.isSupported);

    return () => {
      if (recognitionRef.current && recognitionState.isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [recognitionState.isListening]);

  const handleStartListening = () => {
    if (!isVoiceSupported) return;

    recognitionRef.current = initSpeechRecognition(
      (newTranscript) => {
        const combinedText = brief + " " + newTranscript;
        if (combinedText.length <= maxLength) {
          setBrief(combinedText);
          onBriefChange(combinedText);
        }
      },
      (newState) => {
        setRecognitionState(newState);
        if (newState.error) {
          toast.error(`Oops ! ${getErrorMessage(newState.error)}`, {});
        }
      },
      {
        continuous: true,
        interimResults: true,
        language: "en-US",
      }
    );

    recognitionRef.current.start();
  };

  const handleStopListening = () => {
    if (recognitionRef.current && recognitionState.isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      setBrief(newValue);
      onBriefChange(newValue);
    }
  };

  const handleGenerateFlow = async () => {
    if (!brief.trim()) {
      toast.error("Please provide a brief description first", {
        className: "text-black",
      });
      return;
    }

    try {
      setIsGenerating(true);

      const response = await fetch("/api/generate-flow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ brief }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const rawText = await response.text();

      // Try to parse the JSON response
      let parsedData;
      try {
        // Extract JSON array from the response if needed
        const jsonMatch = rawText.match(/\[[\s\S]*\]/);
        parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(rawText);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError, rawText);
        throw new Error("Failed to parse the AI response. Please try again.");
      }

      // Validate the data format
      if (!Array.isArray(parsedData)) {
        throw new Error("Invalid response format: expected an array of steps");
      }

      // Ensure each step has the required properties
      const validatedSteps = parsedData.map((step, index) => ({
        id: step.id || `step${index + 1}`,
        title: step.title || `Step ${index + 1}`,
        description: step.description || "No description provided",
        components: Array.isArray(step.components) ? step.components : [],
      }));

      onGenerateFlow(validatedSteps);
      toast.success("Flow generated successfully! ✨", {
        className: "text-black",
      });
    } catch (error) {
      console.error("Error generating flow:", error);
      toast.error("Failed to generate flow", {
        description: error instanceof Error ? error.message : "Unknown error",
        className: "text-black",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getErrorMessage = (errorCode: string | null) => {
    if (!errorCode) return null;
    const errorMessages: Record<string, string> = {
      network: "No internet? Check your connection bestie! 🌐",
      "not-allowed": "Hey! I need mic access to hear you 🎤",
      "no-speech": "Couldn't catch that! Speak up a bit? 🗣️",
      aborted: "Voice input stopped, no worries! ✨",
      "audio-capture": "Mic check 1,2! Check your settings 🎧",
      "service-not-allowed": "This browser isn't it rn, try another one 🤔",
    };
    return errorMessages[errorCode] || `Uh oh! Error: ${errorCode}`;
  };

  const progress = (brief.length / maxLength) * 100;

  return (
    <Card className="relative overflow-hidden border-[0.5px] border-slate-800 bg-[#000000] shadow-2xl">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-bl from-pink-400/15 via-purple-500/10 to-slate-900/10 backdrop-blur-xl" />

      {/* Neon glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-indigo-500/5 opacity-50 animate-gradient" />

      <div className="relative p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-pink-400 animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent animate-text-shimmer">
              Give a brief
            </span>
          </div>
          <Button
            variant={recognitionState.isListening ? "destructive" : "secondary"}
            size="sm"
            className={`relative transition-all duration-300 hover:scale-105 ${
              recognitionState.isListening
                ? "bg-red-950/80 hover:bg-red-900/80 border border-red-800/50 text-red-400"
                : "bg-slate-900 hover:bg-slate-800 border border-purple-800/50 text-pink-400 hover:border-pink-900/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]"
            }`}
            onClick={
              recognitionState.isListening
                ? handleStopListening
                : handleStartListening
            }
            disabled={!isVoiceSupported}
          >
            {recognitionState.isListening ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Let&apos;s hear it! 🎤
              </>
            )}
            {recognitionState.isListening && (
              <span className="absolute -top-1 -right-1 w-3 h-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-700 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-800"></span>
              </span>
            )}
          </Button>
        </div>

        <Textarea
          placeholder="Drop your thoughts here... make it awesome! ✨"
          className="min-h-[200px] resize-none bg-slate-900/50 border-purple-800/50 text-slate-100 placeholder:text-slate-600 focus:border-pink-900/50 focus:ring-2 focus:ring-purple-900/20 transition-all duration-300"
          value={brief}
          onChange={handleTextChange}
        />

        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-2">
            {recognitionState.isListening && (
              <div className="flex items-center gap-2 text-pink-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="animate-pulse">Listening... 🎧</span>
              </div>
            )}
            {recognitionState.error && (
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertCircle className="w-4 h-4" />
                <span>{getErrorMessage(recognitionState.error)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`${
                brief.length > maxLength * 0.9
                  ? "text-red-400"
                  : "text-pink-400"
              }`}
            >
              {brief.length} / {maxLength}
            </span>
          </div>
        </div>

        <Progress
          value={progress}
          className="h-1 bg-slate-900/50 rounded-full overflow-hidden border border-purple-800/50"
          style={{
            backgroundImage: "linear-gradient(to right, #9333ea, #db2777)",
            backgroundSize: `${progress}% 100%`,
            backgroundRepeat: "no-repeat",
            boxShadow: progress > 0 ? "0 0 10px rgba(236,72,153,0.2)" : "none",
          }}
        />

        <Button
          onClick={handleGenerateFlow}
          disabled={isGenerating || brief.trim().length === 0}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-pink-500/20 transition-all duration-300"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Flow...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Generate Flow
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
