"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Component,
  ArrowRight,
  Home,
  Search,
  UserCircle,
  Settings,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  FileText,
  Bell,
  Mail,
  Calendar,
  Image,
  Upload,
  Download,
  Users,
  LayoutDashboard,
  ListChecks,
  Boxes,
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

const AVAILABLE_COMPONENTS = [
  "Search Input",
  "Action Button",
  "Card Grid",
  "Form Input",
  "Data Table",
  "Navigation Menu",
  "Image Gallery",
  "List View",
  "Tab Panel",
  "Filter Controls",
  "Chat Interface",
  "Date Picker",
  "File Upload",
  "User Profile",
  "Map View",
  "Analytics Chart",
  "Text Editor",
  "Checkbox Group",
  "Alert Dialog",
];

const getNodeIcon = (title: string, description: string) => {
  const text = (title + " " + description).toLowerCase();
  
  // Define icon mappings based on keywords
  const iconMappings = [
    { keywords: ["home", "landing", "main", "welcome"], icon: Home },
    { keywords: ["search", "find", "filter", "browse"], icon: Search },
    { keywords: ["profile", "user", "account", "personal"], icon: UserCircle },
    { keywords: ["settings", "configure", "preferences"], icon: Settings },
    { keywords: ["cart", "shop", "purchase", "buy"], icon: ShoppingCart },
    { keywords: ["payment", "checkout", "billing"], icon: CreditCard },
    { keywords: ["chat", "message", "communication"], icon: MessageSquare },
    { keywords: ["form", "input", "details", "fill"], icon: FileText },
    { keywords: ["notification", "alert", "remind"], icon: Bell },
    { keywords: ["email", "contact", "subscribe"], icon: Mail },
    { keywords: ["schedule", "date", "time", "book"], icon: Calendar },
    { keywords: ["gallery", "photo", "media"], icon: Image },
    { keywords: ["upload", "import", "attach"], icon: Upload },
    { keywords: ["download", "export", "save"], icon: Download },
    { keywords: ["social", "community", "group"], icon: Users },
    { keywords: ["dashboard", "overview", "analytics"], icon: LayoutDashboard },
    { keywords: ["list", "todo", "task", "check"], icon: ListChecks },
    { keywords: ["product", "item", "catalog"], icon: Boxes },
  ];

  // Find matching icon based on keywords
  const matchedIcon = iconMappings.find(mapping => 
    mapping.keywords.some(keyword => text.includes(keyword))
  );

  // Return matched icon or default to Component icon
  return {
    icon: matchedIcon?.icon || Component,
    color: "text-cyan-400",
  };
};

export const FlowNode = memo(({ data, id }: NodeProps<FlowNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [editedData, setEditedData] = useState(data);
  const [isAddingComponent, setIsAddingComponent] = useState(false);
  const { updateNode, deleteNode, addNode } = useFlowStore();

  const nodeIcon = getNodeIcon(data.title, data.description);
  const Icon = nodeIcon.icon;

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

  const handleComponentAdd = (componentName: string) => {
    if (!editedData.components.includes(componentName)) {
      setEditedData({
        ...editedData,
        components: [...editedData.components, componentName],
      });
      setIsAddingComponent(false);
      toast.success(`Added ${componentName} component! ✨`);
    } else {
      toast.error("This component is already added!");
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
      <Card className="min-h-[280px] w-[360px] bg-slate-900/90 border border-slate-800 shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 backdrop-blur-sm hover:scale-[1.02] group-hover:border-cyan-500/30">
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
                    <Icon className="w-5 h-5 text-cyan-400" />
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
                    <Dialog open={isAddingComponent} onOpenChange={setIsAddingComponent}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border border-slate-800">
                        <DialogHeader>
                          <DialogTitle className="text-slate-100">Add Component</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <Select onValueChange={handleComponentAdd}>
                            <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-slate-100">
                              <SelectValue placeholder="Select a component" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              {AVAILABLE_COMPONENTS.filter(
                                (comp) => !editedData.components.includes(comp)
                              ).map((component) => (
                                <SelectItem
                                  key={component}
                                  value={component}
                                  className="text-slate-100 focus:bg-slate-700 focus:text-slate-100"
                                >
                                  {component}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </DialogContent>
                    </Dialog>
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