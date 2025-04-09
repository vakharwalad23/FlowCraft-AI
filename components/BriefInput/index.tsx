"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Mic, MicOff, Loader2, Zap, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  checkSpeechRecognitionSupport,
  initSpeechRecognition,
  type SpeechRecognitionState,
} from "@/lib/webspeech/speechRecognition";
import type { FlowStep } from "@/types/flow";
import { createFlow, saveFlow, getAllFlows } from "@/lib/flowStorage";

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
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [flowName, setFlowName] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [generatedSteps, setGeneratedSteps] = useState<FlowStep[] | null>(null);
  const [recognitionState, setRecognitionState] =
    useState<SpeechRecognitionState>({
      isListening: false,
      transcript: "",
      error: null,
    });
  const recognitionRef = useRef<ReturnType<typeof initSpeechRecognition> | null>(
    null
  );

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

  const handleGenerateFlow = async () => {
    if (!brief.trim()) {
      toast.error("Please provide a brief description first");
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

      setGeneratedSteps(validatedSteps);
      onGenerateFlow(validatedSteps);
      setIsSaveDialogOpen(true);
      toast.success("Flow generated successfully! ✨");
    } catch (error) {
      console.error("Error generating flow:", error);
      toast.error("Failed to generate flow", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveFlow = () => {
    if (!generatedSteps || !flowName.trim()) {
      toast.error("Please provide a name for your flow");
      return;
    }

    try {
      const newFlow = createFlow(flowName, generatedSteps);
      saveFlow(newFlow, selectedFolderId || undefined);
      setIsSaveDialogOpen(false);
      setFlowName("");
      setSelectedFolderId(null);
      toast.success("Flow saved successfully! 🎉");
    } catch (error) {
      toast.error("Failed to save flow", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
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
  const { folders } = getAllFlows();

  return (
    <>
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
                Give a brief
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
              <span
                className={`${
                  brief.length > maxLength * 0.9
                    ? "text-red-400"
                    : "text-cyan-400"
                }`}
              >
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
              boxShadow: progress > 0 ? "0 0 10px rgba(34,211,238,0.2)" : "none",
            }}
          />

          <Button
            onClick={handleGenerateFlow}
            disabled={isGenerating || brief.trim().length === 0}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
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

      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="bg-slate-900 border border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Save Your Flow</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Flow Name
              </label>
              <Input
                placeholder="Enter a name for your flow..."
                value={flowName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFlowName(e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Select Folder (Optional)
              </label>
              <Select value={selectedFolderId || "none"} onValueChange={setSelectedFolderId}>
                <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-slate-100">
                  <SelectValue placeholder="Choose a folder" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="none" className="text-slate-100">
                    No Folder
                  </SelectItem>
                  {folders.map((folder) => (
                    <SelectItem
                      key={folder.id}
                      value={folder.id}
                      className="text-slate-100"
                    >
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsSaveDialogOpen(false)}
              className="text-slate-400 hover:text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveFlow}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            >
              Save Flow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
