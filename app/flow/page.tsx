"use client";

import { useState } from "react";
import { BriefInput } from "@/components/BriefInput";
import { FlowDiagram } from "@/components/FlowDiagram";
import useFlowStore from "@/store/useFlowStore";
import type { FlowStep } from "@/store/useFlowStore";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { ReactFlowProvider } from 'reactflow';

export default function FlowPage() {
  const { setSteps } = useFlowStore();
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const handleBriefChange = (brief: string) => {
    // This is handled by the BriefInput component internally
  };

  const handleGenerateFlow = (steps: FlowStep[]) => {
    setSteps(steps);
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

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