"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BriefInput } from "@/components/BriefInput";
import { FlowDiagram } from "@/components/FlowDiagram";
import useFlowStore from "@/store/useFlowStore";
import type { FlowStep } from "@/store/useFlowStore";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { ReactFlowProvider } from 'reactflow';

export default function FlowPage() {
  const { flowId } = useParams();
  const { setSteps, loadFlow } = useFlowStore();
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExistingFlow = async () => {
      if (flowId === 'new') {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/flows/${flowId}`);
        if (response.ok) {
          const flowData = await response.json();
          loadFlow(flowData);
        }
      } catch (error) {
        console.error('Error loading flow:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingFlow();
  }, [flowId, loadFlow]);

  const handleBriefChange = (brief: string) => {
    // This is handled by the BriefInput component internally
  };

  const handleGenerateFlow = async (steps: FlowStep[]) => {
    try {
      setSteps(steps);
      
      // Only save if it's not the 'new' route
      if (flowId !== 'new') {
        await fetch(`/api/flows/${flowId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ steps }),
        });
      }
    } catch (error) {
      console.error('Error saving flow:', error);
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