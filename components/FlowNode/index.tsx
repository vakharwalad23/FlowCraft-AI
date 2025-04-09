"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Component,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import useFlowStore, { FlowStep } from "@/store/useFlowStore";
import { getComponentIcon } from "@/lib/componentIcons";
import { cn } from "@/lib/utils";

interface FlowNodeData {
  title: string;
  description: string;
  components: string[];
}

export const FlowNode = memo(({ data, id }: NodeProps<FlowNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [editedData, setEditedData] = useState(data);
  const { updateNode, deleteNode, addNode } = useFlowStore();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editedData.title.trim()) {
      toast.error("Title cannot be empty!");
      return;
    }
    const updatedStep: FlowStep = {
      id,
      ...editedData,
    };
    updateNode(id, updatedStep);
    setIsEditing(false);
    toast.success("Node updated successfully! ✨");
  };

  const handleCancel = () => {
    setEditedData(data);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteNode(id);
    toast.success("Node deleted successfully! 🗑️");
  };

  const handleAddNode = () => {
    addNode(id);
    toast.success("New node added! ✨");
  };

  const handleComponentAdd = () => {
    const newComponent = prompt("Enter new component name:");
    if (newComponent?.trim()) {
      setEditedData({
        ...editedData,
        components: [...editedData.components, newComponent.trim()],
      });
    }
  };

  const handleComponentDelete = (index: number) => {
    setEditedData({
      ...editedData,
      components: editedData.components.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="relative group">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-cyan-500 bg-[#030712] opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Card className="min-h-[200px] w-[320px] bg-slate-900/90 border border-slate-800 shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 backdrop-blur-sm">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="p-5 space-y-4">
            {/* Header with controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <div className="absolute inset-0 bg-cyan-400/20 blur-lg rounded-full" />
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.title}
                      onChange={(e) =>
                        setEditedData({ ...editedData, title: e.target.value })
                      }
                      className="bg-slate-800 text-white px-3 py-1.5 rounded-md border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none w-full"
                      placeholder="Enter step title..."
                    />
                  ) : (
                    <h3 className="font-medium text-white text-lg">{data.title}</h3>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {isEditing ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSave}
                      className="text-green-400 hover:text-green-300"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEdit}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAddNode}
                      className="text-emerald-400 hover:text-emerald-300 relative group/add"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="absolute -right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/add:opacity-100 group-hover/add:translate-x-4 transition-all duration-300">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </>
                )}
              </div>
            </div>

            <CollapsibleContent>
              {/* Description */}
              <div className="space-y-3 pt-2">
                {isEditing ? (
                  <textarea
                    value={editedData.description}
                    onChange={(e) =>
                      setEditedData({ ...editedData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-slate-800 text-white px-3 py-2 rounded-md border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none"
                    placeholder="Enter step description..."
                  />
                ) : (
                  <p className="text-sm text-slate-300 leading-relaxed">{data.description}</p>
                )}
              </div>

              {/* Components */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Component className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-medium text-slate-400">
                      Components
                    </span>
                  </div>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleComponentAdd}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(isEditing ? editedData.components : data.components).map(
                    (component, index) => {
                      const iconConfig = getComponentIcon(component);
                      const Icon = iconConfig.icon;
                      return (
                        <Badge
                          key={index}
                          variant="secondary"
                          className={cn(
                            "bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 backdrop-blur-sm",
                            "transition-all duration-300 group/badge py-1 px-2",
                            "hover:border-cyan-500/30 hover:shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            <Icon className={cn("w-3.5 h-3.5", iconConfig.color)} />
                            <span className="text-slate-300 group-hover/badge:text-white transition-colors">
                              {component}
                            </span>
                            {isEditing && (
                              <button
                                onClick={() => handleComponentDelete(index)}
                                className="ml-1 text-red-400 hover:text-red-300"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </Badge>
                      );
                    }
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </Card>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-cyan-500 bg-[#030712] opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
}); 