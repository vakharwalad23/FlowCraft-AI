"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { BriefInput } from "@/components/BriefInput";
import { FlowDiagram } from "@/components/FlowDiagram";
import useFlowStore from "@/store/useFlowStore";
import type { FlowStep } from "@/types/flow";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
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

  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

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
      if (currentFlowId !== flowIdParam) {
        loadFlowFromApi(flowIdParam);
      }
      setIsLoading(false);
    }
  }, [
    flowIdParam,
    router,
    resetFlow,
    setCurrentFlowId,
    setFlowName,
    currentFlowId,
    loadFlowFromApi,
    setIsLoading,
  ]);

  const handleGenerateFlow = (steps: FlowStep[]) => {
    console.log("Handling generated flow steps:", steps);
    setSteps(steps);
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const isStoreLoading = !useFlowStore((state) => state.isStoreInitialized);

  // Handle brief changes (if BriefInput needs external control)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBriefChange = (brief: string) => {
    // Placeholder - This might be needed by BriefInput props,
    // currently handled internally by BriefInput but prop might be required.
  };

  if (isLoading || isStoreLoading) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
        <span className="ml-3">Loading Flow...</span>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <main className="min-h-screen bg-[#030712] text-white relative overflow-hidden">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/80 backdrop-blur-sm px-4 py-1.5 rounded-lg border border-slate-700/50 shadow-lg">
          <span className="text-sm font-medium text-slate-200">
            {currentFlowName}
          </span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={togglePanel}
          className="fixed top-4 left-4 z-50 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:border-cyan-900/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300"
        >
          {isPanelOpen ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeftOpen className="w-4 h-4" />
          )}
        </Button>

        <div className="flex h-screen">
          <div
            className={`w-[400px] min-w-[400px] p-6 border-r border-slate-800 overflow-y-auto transition-all duration-300 transform ${
              isPanelOpen ? "translate-x-0" : "-translate-x-full"
            } fixed top-0 left-0 h-full z-40 bg-[#030712]`}
          >
            <div className="pt-16">
              <BriefInput
                onBriefChange={handleBriefChange}
                onGenerateFlow={handleGenerateFlow}
              />
            </div>
          </div>

          <div
            className={`flex-1 relative transition-all duration-300 ${
              isPanelOpen ? "ml-[400px]" : "ml-0"
            }`}
          >
            <FlowDiagram />
          </div>
        </div>
      </main>
    </ReactFlowProvider>
  );
}
