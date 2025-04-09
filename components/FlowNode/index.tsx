"use client";

import { Handle, Position } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Component } from 'lucide-react';

interface FlowNodeProps {
  data: {
    title: string;
    description: string;
    components: string[];
  };
  isConnectable: boolean;
}

export function FlowNode({ data, isConnectable }: FlowNodeProps) {
  return (
    <Card className="w-[280px] p-4 bg-[#0A0A0A] border-[0.5px] border-slate-800 shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="!bg-cyan-500 !w-3 !h-3 !border-2 !border-cyan-700"
      />
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ChevronRight className="w-5 h-5 text-cyan-400" />
          <h3 className="font-medium text-slate-200">{data.title}</h3>
        </div>
        
        <p className="text-sm text-slate-400">{data.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {data.components.map((component, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-slate-900 text-cyan-400 border border-slate-800 hover:border-cyan-900/50"
            >
              <Component className="w-3 h-3 mr-1" />
              {component}
            </Badge>
          ))}
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="!bg-cyan-500 !w-3 !h-3 !border-2 !border-cyan-700"
      />
    </Card>
  );
} 