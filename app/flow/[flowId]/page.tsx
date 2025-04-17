"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { BriefInput } from "@/components/BriefInput";
import { FlowDiagram } from "@/components/FlowDiagram";
import { AISuggestions } from "@/components/AISuggestions";
import useFlowStore from "@/store/useFlowStore";
import type { FlowStep } from "@/types/flow";
import { Button } from "@/components/ui/button";
import debounce from "lodash/debounce";
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Sparkles,
} from "lucide-react";
import { ReactFlowProvider } from "reactflow";
import { v4 as uuidv4 } from "uuid";

export default function FlowPage() {
  const params = useParams();
  const router = useRouter();
  const {
    loadFlowFromApi,
    resetFlow,
    setSteps,
    setCurrentFlowId,
    currentFlowId,
    currentFlowName,
    setFlowName,
  } = useFlowStore();

  const flowIdParam = Array.isArray(params.flowId)
    ? params.flowId[0]
    : params.flowId;

  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [localFlowName, setLocalFlowName] = useState(currentFlowName);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    console.log("FlowPage useEffect running, flowIdParam:", flowIdParam);

    if (!flowIdParam) {
      return;
    }

    if (flowIdParam === "new") {
      console.log("Detected 'new' flow route.");
      const newFlowId = uuidv4();
      resetFlow();
      setCurrentFlowId(newFlowId);
      setFlowName("Untitled Flow");
      setIsLoading(false);
      window.history.replaceState(null, "", `/flow/${newFlowId}`);
      console.log("Initialized new flow with ID:", newFlowId);
    } else {
      console.log(
        "Attempting to load existing flow from API for ID:",
        flowIdParam
      );
      loadFlowFromApi(flowIdParam);
      setIsLoading(false);
    }
  }, [
    flowIdParam,
    resetFlow,
    setCurrentFlowId,
    setFlowName,
    loadFlowFromApi,
  ]);

  // Update local state when store changes
  // This is used to update the flow name in the local state
  useEffect(() => {
    setLocalFlowName(currentFlowName);
  }, [currentFlowName]);

  // Debounced save function
  const debouncedSave = useCallback(
    debounce((name: string) => {
      setIsSaving(true);
      setFlowName(name.trim() || "Untitled");
      setIsSaving(false);
    }, 500),
    [setFlowName]
  );

  // Handle input change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setLocalFlowName(newName);
    debouncedSave(newName);
  };

  // Handle blur event
  const handleNameBlur = () => {
    const trimmedName = localFlowName.trim();
    setLocalFlowName(trimmedName || "Untitled");
    setFlowName(trimmedName || "Untitled");
  };

  const handleGenerateFlow = (steps: FlowStep[]) => {
    console.log("Handling generated flow steps:", steps);
    setSteps(steps);
  };

  const toggleLeftPanel = () => {
    setIsLeftPanelOpen(!isLeftPanelOpen);
  };

  const toggleRightPanel = () => {
    setIsRightPanelOpen(!isRightPanelOpen);
  };

  const isStoreLoading = !useFlowStore((state) => state.isStoreInitialized);

  // Handle brief changes
  const handleBriefChange = () => {
    // Placeholder - This might be needed by BriefInput props,
    // currently handled internally by BriefInput but prop might be required.
  };

  if (isLoading || isStoreLoading) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
        <span className="ml-3">Loading Flow...</span>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <main className="min-h-screen bg-[#030712] text-white relative overflow-hidden">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/40 backdrop-blur-sm rounded-lg border border-zinc-700/90 shadow-lg overflow-auto">
          <div className="relative">
            <input
              type="text"
              value={localFlowName}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              maxLength={100}
              className={`text-sm font-medium text-white bg-purple-900/40 backdrop-blur-sm rounded-lg border ${
                isSaving ? "border-purple-500/50" : "border-slate-700/50"
              } focus:ring-0 focus:outline-gray-400 text-center py-2 px-4 w-[180px] overflow-auto transition-colors duration-300`}
              aria-label="Flow name"
              placeholder="Untitled"
            />
            {isSaving && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500" />
              </div>
            )}
          </div>
        </div>

        {/* Left Panel Toggle Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleLeftPanel}
          className="fixed top-4 left-4 z-50 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-400 hover:border-purple-900/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300"
        >
          {isLeftPanelOpen ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeftOpen className="w-4 h-4" />
          )}
        </Button>

        {/* Right Panel Toggle Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleRightPanel}
          className="fixed top-4 right-4 z-50 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-400 hover:border-purple-900/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300"
        >
          {isRightPanelOpen ? (
            <>
              <PanelRightClose className="w-4 h-4 mr-2" />
              <Sparkles className="w-3 h-3" />
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 mr-2" />
              <PanelRightOpen className="w-4 h-4" />
            </>
          )}
        </Button>

        <div className="flex h-screen">
          {/* Left Panel - Brief Input */}
          <div
            className={`w-[400px] min-w-[400px] p-6 border-r border-slate-800 overflow-y-auto transition-all duration-300 transform ${
              isLeftPanelOpen ? "translate-x-0" : "-translate-x-full"
            } fixed top-0 left-0 h-full z-40 bg-[#030712]`}
          >
            <div className="pt-16">
              <BriefInput
                onBriefChange={handleBriefChange}
                onGenerateFlow={handleGenerateFlow}
              />
            </div>
          </div>

          {/* Right Panel - AI Suggestions */}
          <div
            className={`w-[400px] min-w-[400px] p-6 border-l border-slate-800 overflow-y-auto transition-all duration-300 transform ${
              isRightPanelOpen ? "translate-x-0" : "translate-x-full"
            } fixed top-0 right-0 h-full z-40 bg-[#030712]`}
          >
            <div className="pt-16">
              <AISuggestions />
            </div>
          </div>

          {/* Main Flow Diagram Area */}
          <div
            className={`flex-1 relative transition-all duration-300 ${
              isLeftPanelOpen ? "ml-[400px]" : "ml-0"
            } ${isRightPanelOpen ? "mr-[400px]" : "mr-0"}`}
          >
            <FlowDiagram />
          </div>
        </div>
      </main>
    </ReactFlowProvider>
  );
}
