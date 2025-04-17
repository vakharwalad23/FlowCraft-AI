"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Panel,
  BackgroundVariant,
  useReactFlow,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { FlowNode } from "@/components/FlowNode";
import useFlowStore from "@/store/useFlowStore";
import { Button } from "@/components/ui/button";
import { Download, Undo, ZoomIn, ZoomOut } from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "sonner";

const nodeTypes = {
  flowNode: FlowNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 1 };

export function FlowDiagram() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, resetFlow } =
    useFlowStore();

  const { fitView, zoomIn, zoomOut, getViewport } = useReactFlow();
  const flowRef = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  // Add zoom tracking state
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showZoomIndicator, setShowZoomIndicator] = useState(false);
  const zoomTimeout = useRef<NodeJS.Timeout | null>(null);

  // Update zoom level from current viewport
  const updateZoomLevel = useCallback(() => {
    const currentViewport = getViewport();
    const zoomPercentage = Math.round(currentViewport.zoom * 100);
    setZoomLevel(zoomPercentage);
    setShowZoomIndicator(true);

    // Clear any existing timeout
    if (zoomTimeout.current) {
      clearTimeout(zoomTimeout.current);
    }

    // Hide indicator after 2 seconds
    zoomTimeout.current = setTimeout(() => {
      setShowZoomIndicator(false);
    }, 2000);
  }, [getViewport]);

  // Handle viewport changes (zoom)

  // Custom zoom handlers that also update our zoom indicator
  const handleZoomIn = useCallback(() => {
    zoomIn();
    setTimeout(updateZoomLevel, 50);
  }, [zoomIn, updateZoomLevel]);

  const handleZoomOut = useCallback(() => {
    zoomOut();
    setTimeout(updateZoomLevel, 50);
  }, [zoomOut, updateZoomLevel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (zoomTimeout.current) {
        clearTimeout(zoomTimeout.current);
      }
    };
  }, []);

  // Set initial zoom level
  useEffect(() => {
    setTimeout(updateZoomLevel, 100);
  }, [updateZoomLevel]);

  // Re-fit view when nodes change
  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 200 });
      }, 100);
    }
  }, [nodes.length, fitView]);

  // Update the handleExportImage function
  const handleExportImage = useCallback(async () => {
    if (!flowRef.current) {
      toast.error("Could not export flow diagram");
      return;
    }

    try {
      // Add temporary styles for better export quality
      const elements =
        flowRef.current.getElementsByClassName("react-flow__node");
      const originalStyles: { [key: string]: string }[] = [];

      // Get flow name from store
      const currentFlowName =
        useFlowStore.getState().currentFlowName || "Untitled Flow";

      // Hide all control elements and panels
      const controlsElements = [
        ".react-flow__panel-top-right", // Controls
        ".react-flow__panel-bottom-right", // Bottom panel with buttons
        ".react-flow__controls", // Navigation controls
        ".absolute.bottom-4.left-4.z-50", // Our custom zoom controls
        ".fixed.bottom-16.right-16.z-50", // Temporary zoom indicator
      ];

      const hiddenElements: {
        element: HTMLElement;
        originalDisplay: string;
      }[] = [];

      // Hide all control elements
      controlsElements.forEach((selector) => {
        const elements = flowRef.current?.querySelectorAll(selector);
        if (elements) {
          elements.forEach((element) => {
            const htmlElement = element as HTMLElement;
            hiddenElements.push({
              element: htmlElement,
              originalDisplay: htmlElement.style.display,
            });
            htmlElement.style.display = "none";
          });
        }
      });

      Array.from(elements).forEach((el) => {
        const element = el as HTMLElement;
        originalStyles.push({
          transform: element.style.transform,
          transition: element.style.transition,
        });
        element.style.transform = element.style.transform.replace(
          "translate3d",
          "translate"
        );
        element.style.transition = "none";
      });

      // Add a temporary flow name element that will be visible in the exported image
      const flowNameElement = document.createElement("div");
      flowNameElement.className = "flow-name-export";
      flowNameElement.textContent = currentFlowName;

      // Style the flow name element
      Object.assign(flowNameElement.style, {
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        color: "white",
        padding: "8px 16px",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "500",
        zIndex: "1000",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        border: "1px solid rgba(100, 116, 139, 0.5)",
        backdropFilter: "blur(8px)",
      });

      // Append the flow name element to the flow container
      flowRef.current.appendChild(flowNameElement);

      const dataUrl = await toPng(flowRef.current, {
        backgroundColor: "#030712",
        quality: 1,
        pixelRatio: 2,
        style: {
          width: "100%",
          height: "100%",
        },
      });

      // Remove the temporary flow name element
      flowRef.current.removeChild(flowNameElement);

      // Restore original styles
      Array.from(elements).forEach((el, index) => {
        const element = el as HTMLElement;
        element.style.transform = originalStyles[index].transform;
        element.style.transition = originalStyles[index].transition;
      });

      // Restore visibility of all hidden elements
      hiddenElements.forEach(({ element, originalDisplay }) => {
        element.style.display = originalDisplay;
      });

      // Create download link
      const link = document.createElement("a");
      link.download = `${currentFlowName
        .replace(/\s+/g, "-")
        .toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();

      toast.success("Flow diagram exported successfully! 🎨");
    } catch (error) {
      console.error("Error exporting image:", error);
      toast.error("Failed to export diagram", {
        description:
          "Please try again or contact support if the issue persists.",
      });
    }
  }, []);

  const handleExportJSON = useCallback(() => {
    try {
      if (!reactFlowInstance) {
        toast.error("Flow data not ready");
        return;
      }

      const flow = reactFlowInstance.toObject();
      const flowData = {
        nodes: flow.nodes,
        edges: flow.edges,
        viewport: flow.viewport,
      };

      const dataStr = JSON.stringify(flowData, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const link = document.createElement("a");
      link.download = "flowcraft-data.json";
      link.href = dataUri;
      link.click();

      toast.success("Flow data exported successfully! 📄");
    } catch (error) {
      console.error("Error exporting JSON:", error);
      toast.error("Failed to export flow data", {
        description:
          "Please try again or contact support if the issue persists.",
      });
    }
  }, [reactFlowInstance]);

  return (
    <div className="absolute inset-0" ref={flowRef}>
      {/* Temporary zoom indicator that appears when zooming */}
      <div
        className={`fixed bottom-16 right-16 z-50 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-700/50 shadow-lg transition-opacity duration-300 ${
          showZoomIndicator ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-sm font-medium text-purple-300">
          {zoomLevel}%
        </span>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultViewport={defaultViewport}
        onInit={setReactFlowInstance}
        onMove={updateZoomLevel} // Use the existing updateZoomLevel function
        fitView
        fitViewOptions={{ padding: 0.2, duration: 200 }}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
          style: { stroke: "#6366f1", strokeWidth: 2 },
        }}
        className="react-flow bg-gradient-to-bl from-purple-900/5 via-indigo-800/15 to-pink-700/15 backdrop-blur-3xl"
        style={{ zIndex: 1 }}
        minZoom={0.2}
        maxZoom={4}
        nodesDraggable={true}
        nodesConnectable={true}
        snapToGrid={true}
        snapGrid={[15, 15]}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#1E293B"
        />

        {/* Replace the existing custom controls with this minimal version */}
        <div className="absolute bottom-4 left-4 z-50 flex flex-col sm:flex-row items-start sm:items-center gap-1.5">
          {/* Zoom percentage display */}
          <div className="bg-black/50 backdrop-blur-sm border border-zinc-700/90 px-2 py-1 rounded-md shadow-lg">
            <span className="text-xs font-medium text-purple-300">
              {zoomLevel}%
            </span>
          </div>

          {/* Controls buttons in a row */}
          <div className="flex flex-col sm:flex-row bg-black/50 backdrop-blur-sm border border-zinc-700/90 rounded-md shadow-lg overflow-hidden">
            {/* Zoom out button */}
            <button
              className="p-1.5 text-gray-300 hover:text-white hover:bg-black/70 transition-colors focus:ring-0 focus:outline-none"
              onClick={handleZoomOut}
              title="Zoom out"
            >
              <ZoomOut size={16} />
            </button>

            {/* Zoom in button */}
            <button
              className="p-1.5 text-gray-300 hover:text-white hover:bg-black/70 transition-colors border-t sm:border-t-0 sm:border-l border-zinc-700/90 focus:ring-0 focus:outline-none"
              onClick={handleZoomIn}
              title="Zoom in"
            >
              <ZoomIn size={16} />
            </button>

            {/* Fit view button */}
            <button
              className="p-1.5 text-gray-300 hover:text-white hover:bg-black/70 transition-colors border-t sm:border-t-0 sm:border-l border-zinc-700/90 focus:ring-0 focus:outline-none"
              onClick={() => fitView({ padding: 0.2, duration: 300 })}
              title="Fit view"
            >
              <svg
                height="16"
                width="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>
          </div>
        </div>

        <Panel
          position="bottom-right"
          className="flex gap-2 react-flow__panel-bottom-right "
        >
          {/* Export and reset buttons (unchanged) */}
          <Button
            variant="secondary"
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-300/90 hover:border-cyan-900/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300"
            onClick={handleExportImage}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PNG
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-300/90 hover:border-cyan-900/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300"
            onClick={handleExportJSON}
          >
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-300/90 hover:border-cyan-900/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300"
            onClick={resetFlow}
          >
            <Undo className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
