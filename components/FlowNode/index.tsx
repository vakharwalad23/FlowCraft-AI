"use client";

import { memo, useState, useMemo, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Calendar as CalendarIcon,
  Image as ImageIcon,
  Upload,
  Download,
  Users,
  LayoutDashboard,
  ListChecks,
  Boxes,
  Eye,
  MousePointerClick,
  LayoutGrid,
  Table,
  Navigation,
  GalleryHorizontal,
  List,
  PanelTop,
  SlidersHorizontal,
  MessagesSquare,
  CalendarDays,
  UploadCloud,
  CircleUserRound,
  Map,
  BarChart,
  Text,
  CheckSquare,
  AlertTriangle,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import useFlowStore, { FlowStep } from "@/store/useFlowStore";
import { cn } from "@/lib/utils";
import { FlowNodePreview } from "@/components/FlowNodePreview";

type FlowNodeData = FlowStep;

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
    { keywords: ["schedule", "date", "time", "book"], icon: CalendarIcon },
    { keywords: ["gallery", "photo", "media"], icon: ImageIcon },
    { keywords: ["upload", "import", "attach"], icon: Upload },
    { keywords: ["download", "export", "save"], icon: Download },
    { keywords: ["social", "community", "group"], icon: Users },
    { keywords: ["dashboard", "overview", "analytics"], icon: LayoutDashboard },
    { keywords: ["list", "todo", "task", "check"], icon: ListChecks },
    { keywords: ["product", "item", "catalog"], icon: Boxes },
  ];
  const matchedIcon = iconMappings.find((mapping) =>
    mapping.keywords.some((keyword) => text.includes(keyword))
  );
  return {
    icon: matchedIcon?.icon || Component,
    color: "text-cyan-400",
  };
};

const componentIconMapping: Record<string, React.ElementType> = {
  "Search Input": Search,
  "Action Button": MousePointerClick,
  "Card Grid": LayoutGrid,
  "Form Input": FileText,
  "Data Table": Table,
  "Navigation Menu": Navigation,
  "Image Gallery": GalleryHorizontal,
  "List View": List,
  "Tab Panel": PanelTop,
  "Filter Controls": SlidersHorizontal,
  "Chat Interface": MessagesSquare,
  "Date Picker": CalendarDays,
  "File Upload": UploadCloud,
  "User Profile": CircleUserRound,
  "Map View": Map,
  "Analytics Chart": BarChart,
  "Text Editor": Text,
  "Checkbox Group": CheckSquare,
  "Alert Dialog": AlertTriangle,
};

const getUIComponentIcon = (componentName: string) => {
  return componentIconMapping[componentName] || Component;
};

export const FlowNode = memo(({ data, id }: NodeProps<FlowNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editedData, setEditedData] = useState<FlowNodeData>(data);
  const [isAddingComponent, setIsAddingComponent] = useState(false);
  const { updateNode, deleteNode, addNode } = useFlowStore();

  const nodeIcon = useMemo(
    () => getNodeIcon(data.title, data.description),
    [data.title, data.description]
  );
  const Icon = nodeIcon.icon;

  useEffect(() => {
    setEditedData(data);
  }, [data]);

  const handleEdit = () => {
    setEditedData(data);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editedData.title.trim()) {
      toast.error("Title cannot be empty!");
      return;
    }
    updateNode(id, editedData);
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

  const handleInputChange = (
    field: keyof FlowNodeData,
    value: FlowNodeData[keyof FlowNodeData]
  ) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
      previewHtml: undefined,
    }));
  };

  const handleComponentAdd = (componentName: string) => {
    if (!editedData.components.includes(componentName)) {
      handleInputChange("components", [
        ...editedData.components,
        componentName,
      ]);
      setIsAddingComponent(false);
      toast.success(`Added ${componentName} component! ✨`);
    } else {
      toast.error("This component is already added!");
    }
  };

  const handleComponentDelete = (index: number) => {
    handleInputChange(
      "components",
      editedData.components.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="relative group flow-node">
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 border-2 border-cyan-500 bg-[#030712] opacity-0 group-hover:opacity-100 transition-opacity !-left-1.5"
      />
      <Card className="w-[350px] bg-slate-900 border border-slate-700 shadow-lg hover:shadow-cyan-500/15 transition-all duration-300 group-hover:border-cyan-600/50 rounded-xl">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div
            className={cn(
              "flex items-center justify-between p-4 border-b border-slate-800",
              isOpen && "pb-3"
            )}
          >
            <div className="flex items-center gap-2.5">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-md w-6 h-6"
                >
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <div className="relative w-5 h-5 flex items-center justify-center">
                <Icon className="w-5 h-5 text-cyan-400 z-10" />
                <div className="absolute inset-0 bg-cyan-500/10 blur-md rounded-full" />
              </div>
              {isEditing ? (
                <Input
                  type="text"
                  value={editedData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="h-8 bg-slate-800 text-white px-2 py-1 rounded border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-base font-medium"
                  placeholder="Step Title"
                />
              ) : (
                <h3 className="font-semibold text-white text-base leading-tight">
                  {data.title}
                </h3>
              )}
            </div>
            <div className="flex items-center gap-1">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSave}
                    className="text-green-400 hover:text-green-300 hover:bg-slate-800 rounded-md w-7 h-7"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCancel}
                    className="text-slate-400 hover:text-slate-300 hover:bg-slate-800 rounded-md w-7 h-7"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-md w-7 h-7"
                    onClick={() => setIsPreviewOpen(true)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEdit}
                    className="text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-md w-7 h-7"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-400 hover:bg-slate-800 rounded-md w-7 h-7"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </>
              )}
            </div>
          </div>

          <CollapsibleContent>
            <div className="p-4 space-y-3">
              {isEditing ? (
                <Textarea
                  value={editedData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Step description..."
                  className="w-full bg-slate-800 border-slate-700 text-sm text-slate-300 rounded-md p-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 min-h-[60px]"
                />
              ) : (
                <p className="text-sm text-slate-400 leading-relaxed">
                  {data.description || (
                    <span className="italic">No description</span>
                  )}
                </p>
              )}

              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                  Components
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(editedData.components || []).map((component, index) => {
                    const CompIcon = getUIComponentIcon(component);
                    return (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-normal relative group/badge cursor-default"
                      >
                        <CompIcon className="w-3 h-3 text-cyan-500" />
                        <span>{component}</span>
                        {isEditing && (
                          <button
                            onClick={() => handleComponentDelete(index)}
                            className="ml-1 -mr-1 text-slate-500 hover:text-red-400 opacity-0 group-hover/badge:opacity-100 transition-opacity p-0.5 leading-none focus:outline-none"
                            aria-label="Remove component"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </Badge>
                    );
                  })}
                  {isEditing && (
                    <Dialog
                      open={isAddingComponent}
                      onOpenChange={setIsAddingComponent}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-dashed border-slate-600 text-slate-400 hover:text-cyan-400 hover:border-cyan-600 hover:bg-slate-800 h-6 px-2 py-0 text-xs"
                        >
                          <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-800 text-white">
                        <DialogHeader>
                          <DialogTitle>Add Component</DialogTitle>
                        </DialogHeader>
                        <Select onValueChange={handleComponentAdd}>
                          <SelectTrigger className="w-full bg-slate-800 border-slate-700">
                            <SelectValue placeholder="Select a component..." />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-700 text-white">
                            {AVAILABLE_COMPONENTS.filter(
                              (comp) =>
                                !(editedData.components || []).includes(comp)
                            ).map((component) => (
                              <SelectItem
                                key={component}
                                value={component}
                                className="hover:bg-slate-800 focus:bg-slate-700"
                              >
                                {component}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <button
        onClick={handleAddNode}
        className={cn(
          "absolute left-1/2 -translate-x-1/2 -bottom-4",
          "w-7 h-7 rounded-full bg-cyan-600 hover:bg-cyan-500 border-2 border-slate-900",
          "flex items-center justify-center text-white shadow-md",
          "opacity-0 group-hover:opacity-100 transition-all duration-200 scale-75 group-hover:scale-100",
          "z-10"
        )}
        aria-label="Add node after this"
      >
        <Plus className="w-4 h-4" />
      </button>

      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 border-2 border-cyan-500 bg-[#030712] opacity-0 group-hover:opacity-100 transition-opacity !-right-1.5"
      />

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl h-[80vh] flex flex-col bg-slate-950 border-slate-800 p-0">
          <DialogHeader className="p-4 border-b border-slate-800 flex flex-row items-center justify-between">
            <DialogTitle className="text-slate-100 text-base font-medium">
              Component Preview: {data.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPreviewOpen(false)}
              className="text-slate-400 hover:text-white hover:bg-slate-800 w-7 h-7"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogHeader>
          <div className="flex-grow p-6 overflow-hidden">
            <FlowNodePreview
              nodeId={id}
              title={data.title}
              description={data.description}
              components={Array.isArray(data.components) ? data.components : []}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

FlowNode.displayName = "FlowNode";
