"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Panel,
  BackgroundVariant,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FlowNode } from '@/components/FlowNode';
import useFlowStore from '@/store/useFlowStore';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, Undo } from 'lucide-react';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

const nodeTypes = {
  flowNode: FlowNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 1 };

export function FlowDiagram() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    resetFlow,
  } = useFlowStore();

  const { fitView } = useReactFlow();
  const flowRef = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Re-fit view when nodes change
  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 200 });
      }, 100);
    }
  }, [nodes.length, fitView]);

  const handleExportImage = useCallback(async () => {
    if (!flowRef.current) {
      toast.error("Could not export flow diagram");
      return;
    }

    try {
      // Add temporary styles for better export quality
      const elements = flowRef.current.getElementsByClassName('react-flow__node');
      const originalStyles: { [key: string]: string }[] = [];
      
      // Hide control buttons and panel
      const controlsPanel = flowRef.current.querySelector('.react-flow__panel-top-right');
      const controlsOriginalDisplay = controlsPanel ? (controlsPanel as HTMLElement).style.display : '';
      if (controlsPanel) {
        (controlsPanel as HTMLElement).style.display = 'none';
      }
      
      Array.from(elements).forEach((el) => {
        const element = el as HTMLElement;
        originalStyles.push({
          transform: element.style.transform,
          transition: element.style.transition,
        });
        element.style.transform = element.style.transform.replace('translate3d', 'translate');
        element.style.transition = 'none';
      });

      const dataUrl = await toPng(flowRef.current, {
        backgroundColor: '#030712',
        quality: 1,
        pixelRatio: 2,
        style: {
          width: '100%',
          height: '100%',
        },
      });

      // Restore original styles
      Array.from(elements).forEach((el, index) => {
        const element = el as HTMLElement;
        element.style.transform = originalStyles[index].transform;
        element.style.transition = originalStyles[index].transition;
      });

      // Restore controls visibility
      if (controlsPanel) {
        (controlsPanel as HTMLElement).style.display = controlsOriginalDisplay;
      }

      // Create download link
      const link = document.createElement('a');
      link.download = 'flowcraft-diagram.png';
      link.href = dataUrl;
      link.click();
      
      toast.success("Flow diagram exported successfully! 🎨");
    } catch (error) {
      console.error('Error exporting image:', error);
      toast.error("Failed to export diagram", {
        description: "Please try again or contact support if the issue persists."
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
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const link = document.createElement('a');
      link.download = 'flowcraft-data.json';
      link.href = dataUri;
      link.click();
      
      toast.success("Flow data exported successfully! 📄");
    } catch (error) {
      console.error('Error exporting JSON:', error);
      toast.error("Failed to export flow data", {
        description: "Please try again or contact support if the issue persists."
      });
    }
  }, [reactFlowInstance]);

  return (
    <div className="absolute inset-0" ref={flowRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultViewport={defaultViewport}
        onInit={setReactFlowInstance}
        fitView
        fitViewOptions={{ padding: 0.2, duration: 200 }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#0e7490', strokeWidth: 2 },
        }}
        className="react-flow bg-[#030712]"
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
        <Controls
          className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg shadow-xl"
          showInteractive={false}
        />
        <Panel position="top-right" className="flex gap-2 react-flow__panel-top-right">
          <Button
            variant="secondary"
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:border-cyan-900/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300"
            onClick={handleExportImage}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PNG
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:border-cyan-900/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300"
            onClick={handleExportJSON}
          >
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:border-cyan-900/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300"
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