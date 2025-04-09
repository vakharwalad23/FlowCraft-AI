"use client";

import { useCallback, useEffect } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FlowNode } from '@/components/FlowNode';
import useFlowStore from '@/store/useFlowStore';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, Undo } from 'lucide-react';
import html2canvas from 'html2canvas';

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

  // Re-fit view when nodes change
  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 200 });
      }, 100);
    }
  }, [nodes.length, fitView]);

  const handleExportImage = useCallback(async () => {
    const element = document.querySelector('.react-flow') as HTMLElement;
    if (element) {
      const canvas = await html2canvas(element, {
        backgroundColor: '#030712',
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'flow-diagram.png';
      link.href = dataUrl;
      link.click();
    }
  }, []);

  const handleExportJSON = useCallback(() => {
    const data = {
      nodes,
      edges,
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.download = 'flow-data.json';
    link.href = dataUri;
    link.click();
  }, [nodes, edges]);

  return (
    <div className="absolute inset-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultViewport={defaultViewport}
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
        <Panel position="top-right" className="space-x-2">
          <Button
            variant="secondary"
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400"
            onClick={handleExportImage}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PNG
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400"
            onClick={handleExportJSON}
          >
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400"
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