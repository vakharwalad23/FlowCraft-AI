"use client"

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Mic,
  MicOff,
  Loader2,
  Zap,
  AlertCircle,
} from "lucide-react";
import {
  checkSpeechRecognitionSupport,
  initSpeechRecognition,
  type SpeechRecognitionState,
} from "@/lib/webspeech/speechRecognition";

type RecognitionController = ReturnType<typeof initSpeechRecognition>;

interface BriefInputProps {
  onBriefChange: (brief: string) => void;
  maxLength?: number;
}

export function BriefInput({ onBriefChange, maxLength = 1000 }: BriefInputProps) {
  const [brief, setBrief] = useState("");
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [recognitionState, setRecognitionState] = useState<SpeechRecognitionState>({
    isListening: false,
    transcript: "",
    error: null,
  });
  const recognitionRef = useRef<RecognitionController | null>(null);

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
          toast.error("Oops! 😅", {
            description: getErrorMessage(newState.error),
          });
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
    <Card className="relative overflow-hidden border-[0.5px] border-slate-800 bg-[#0A0A0A] shadow-2xl">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-black to-slate-900/50" />
      
      {/* Neon glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-indigo-500/5 opacity-50 animate-gradient" />

      <div className="relative p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent animate-text-shimmer">
              Share your vibe ⚡
            </span>
          </div>
          <Button
            variant={recognitionState.isListening ? "destructive" : "secondary"}
            size="sm"
            className={`relative transition-all duration-300 hover:scale-105 ${
              recognitionState.isListening
                ? "bg-red-950/80 hover:bg-red-900/80 border border-red-800/50 text-red-400"
                : "bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:border-cyan-900/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
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
                Let's hear it! 🎤
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
          placeholder="Drop your thoughts here... make it awesome! ⚡✨"
          className="min-h-[200px] resize-none bg-slate-900/50 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-cyan-900/50 focus:ring-2 focus:ring-cyan-900/20 transition-all duration-300"
          value={brief}
          onChange={handleTextChange}
        />

        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-2">
            {recognitionState.isListening && (
              <div className="flex items-center gap-2 text-cyan-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="animate-pulse">Listening... 🎧</span>
              </div>
            )}
            {recognitionState.error && (
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span>{getErrorMessage(recognitionState.error)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`${brief.length > maxLength * 0.9 ? "text-red-400" : "text-cyan-400"}`}>
              {brief.length} / {maxLength}
            </span>
          </div>
        </div>

        <Progress 
          value={progress} 
          className="h-1 bg-slate-900/50 rounded-full overflow-hidden border border-slate-800"
          style={{
            backgroundImage: "linear-gradient(to right, #0e7490, #0369a1)",
            backgroundSize: `${progress}% 100%`,
            backgroundRepeat: "no-repeat",
            boxShadow: progress > 0 ? "0 0 10px rgba(34,211,238,0.2)" : "none"
          }}
        />
      </div>
    </Card>
  );
} 