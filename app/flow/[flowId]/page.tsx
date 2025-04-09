"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BriefInput } from "@/components/BriefInput";
import { FlowDiagram } from "@/components/FlowDiagram";
import useFlowStore from "@/store/useFlowStore";
import type { FlowStep } from "@/store/useFlowStore";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { ReactFlowProvider } from "reactflow";
import { getFlowById, saveFlow, createFlow } from "@/lib/flowStorage";

export default function FlowPage() {
  const { flowId } = useParams();
  const { setSteps, loadFlow } = useFlowStore();
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [flowName, setFlowName] = useState<string>("Untitled Flow");

  useEffect(() => {
    const loadExistingFlow = () => {
      if (flowId === "new") {
        setIsLoading(false);
        return;
      }

      try {
        // Use flowStorage utility directly instead of API calls
        const flowData = getFlowById(flowId as string);

        if (flowData) {
          loadFlow({ steps: flowData.flow.steps });
          setFlowName(flowData.flow.name);
        }
      } catch (error) {
        console.error("Error loading flow:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingFlow();
  }, [flowId, loadFlow]);

  // This function is passed to BriefInput but the actual brief handling is done internally
  const handleBriefChange = (brief: string) => {
    // This is handled by the BriefInput component internally
  };

  const handleGenerateFlow = (steps: FlowStep[]) => {
    try {
      setSteps(steps);

      // Only save if it's not the 'new' route
      if (flowId !== "new") {
        // Get existing flow to update
        const existingFlow = getFlowById(flowId as string);

        if (existingFlow) {
          const updatedFlow = {
            ...existingFlow.flow,
            steps,
            updatedAt: new Date().toISOString(),
          };

          saveFlow(updatedFlow, existingFlow.folderId);
        } else {
          // If somehow the flow doesn't exist, create it
          const newFlow = createFlow(flowName, steps);
          saveFlow(newFlow);
        }
      }
    } catch (error) {
      console.error("Error saving flow:", error);
    }
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <main className="min-h-screen bg-[#030712] text-white relative overflow-hidden">
        {/* Toggle Button */}
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
          {/* Left side - Brief Input */}
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

          {/* Right side - Flow Diagram */}
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
