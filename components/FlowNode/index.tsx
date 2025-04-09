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
      ...editedData
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
      <Card className="w-[300px] bg-slate-900/90 border border-slate-800 shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="p-4 space-y-4">
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
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.title}
                    onChange={(e) =>
                      setEditedData({ ...editedData, title: e.target.value })
                    }
                    className="bg-slate-800 text-white px-2 py-1 rounded-md border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                  />
                ) : (
                  <h3 className="font-medium text-white">{data.title}</h3>
                )}
              </div>
              <div className="flex items-center gap-1">
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
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <CollapsibleContent>
              {/* Description */}
              <div className="space-y-2">
                {isEditing ? (
                  <textarea
                    value={editedData.description}
                    onChange={(e) =>
                      setEditedData({ ...editedData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-slate-800 text-white px-2 py-1 rounded-md border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none"
                  />
                ) : (
                  <p className="text-sm text-slate-300">{data.description}</p>
                )}
              </div>

              {/* Components */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400">
                    Components
                  </span>
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
                    (component, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700"
                      >
                        {component}
                        {isEditing && (
                          <button
                            onClick={() => handleComponentDelete(index)}
                            className="ml-1 text-red-400 hover:text-red-300"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    )
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