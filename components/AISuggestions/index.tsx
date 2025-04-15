"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronUp,
  LightbulbIcon,
  PlusCircle,
  Wand2,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import useFlowStore from "@/store/useFlowStore";
import type { FlowStep } from "@/types/flow";

type Suggestion = {
  id: string;
  title: string;
  description: string;
  type: "improvement" | "addition" | "flow" | "warning";
  actionable: boolean;
  details?: string;
  preview?: string;
  impact?: "high" | "medium" | "low";
  before?: string;
  after?: string;
  components?: string[]; // Add this line to fix the error
};

interface AISuggestionsProps {
  className?: string;
}

export function AISuggestions({ className }: AISuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isImplementing, setIsImplementing] = useState<string | null>(null);

  const { nodes, edges, updateNode, addNode, setSteps } = useFlowStore();

  const nodeData = nodes.map((node) => node.data);

  const generateSuggestions = async () => {
    if (nodes.length === 0) {
      toast.error("Please create a flow first before requesting suggestions.");
      return;
    }

    setIsLoading(true);
    setSuggestions([]);

    try {
      const response = await fetch("/api/flow-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          steps: nodeData,
          connections: edges.map((edge) => ({
            source: edge.source,
            target: edge.target,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast.error("Failed to generate suggestions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const findBestNodePlacement = (suggestion: Suggestion) => {
    // Default to the last node

    // Try to extract positioning info from the suggestion description
    const description = suggestion.description.toLowerCase();
    const title = suggestion.title.toLowerCase();
    const combinedText = `${description} ${title}`;

    // Check for explicit step positioning
    const afterMatch =
      combinedText.match(/after ['"]([^'"]+)['"]/i) ||
      combinedText.match(/following ['"]([^'"]+)['"]/i);
    const beforeMatch =
      combinedText.match(/before ['"]([^'"]+)['"]/i) ||
      combinedText.match(/preceding ['"]([^'"]+)['"]/i);

    if (afterMatch) {
      const targetTitle = afterMatch[1].toLowerCase();
      // Find node with similar title
      const matchingNode = nodes.find(
        (node) =>
          node.data.title.toLowerCase().includes(targetTitle) ||
          targetTitle.includes(node.data.title.toLowerCase())
      );

      if (matchingNode) {
        return { sourceNodeId: matchingNode.id, isAfter: true };
      }
    }

    if (beforeMatch) {
      const targetTitle = beforeMatch[1].toLowerCase();
      // Find node with similar title
      const matchingNode = nodes.find(
        (node) =>
          node.data.title.toLowerCase().includes(targetTitle) ||
          targetTitle.includes(node.data.title.toLowerCase())
      );

      if (matchingNode) {
        return { sourceNodeId: matchingNode.id, isAfter: false };
      }
    }

    // If no specific positioning found, infer from context
    if (combinedText.includes("beginning") || combinedText.includes("start")) {
      return { sourceNodeId: nodes[0].id, isAfter: false };
    }

    if (combinedText.includes("end") || combinedText.includes("final")) {
      return { sourceNodeId: nodes[nodes.length - 1].id, isAfter: true };
    }

    // Find best contextual match
    let bestMatchScore = 0;
    let bestMatchIndex = nodes.length - 1;

    nodes.forEach((node, index) => {
      const nodeText =
        `${node.data.title} ${node.data.description}`.toLowerCase();
      const suggestionWords = combinedText.split(/\s+/);

      let matchScore = 0;
      suggestionWords.forEach((word) => {
        if (word.length > 3 && nodeText.includes(word)) {
          matchScore++;
        }
      });

      if (matchScore > bestMatchScore) {
        bestMatchScore = matchScore;
        bestMatchIndex = index;
      }
    });

    return {
      sourceNodeId: nodes[bestMatchIndex].id,
      isAfter: true,
    };
  };

  const handleApplySuggestion = async (suggestion: Suggestion) => {
    if (!suggestion.actionable) return;

    try {
      setIsImplementing(suggestion.id);

      // Simulate a brief delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (suggestion.type === "improvement") {
        // Find the node that needs improvement
        const nodeId = suggestion.id.split("-")[1];
        const node = nodes.find((n) => n.id === nodeId);

        if (node) {
          const updatedData: Partial<FlowStep> = {
            title: suggestion.title,
            description: suggestion.description,
          };

          updateNode(nodeId, updatedData);
          toast.success("Suggestion applied! Flow updated successfully.", {
            icon: <Check className="h-4 w-4 text-green-500" />,
          });

          // Close the suggestion after applying
          setIsOpen({ ...isOpen, [suggestion.id]: false });
        }
      } else if (suggestion.type === "addition") {
        // If it's a new step suggestion
        if (nodes.length > 0) {
          try {
            // Replace the existing code for finding sourceNodeId with:
            try {
              // First, add a loading state
              setIsImplementing(suggestion.id);

              // Find the best node to place this new suggestion near
              const { sourceNodeId, isAfter } =
                findBestNodePlacement(suggestion);

              console.log(
                `Adding node ${isAfter ? "after" : "before"} node "${
                  nodes.find((n) => n.id === sourceNodeId)?.data.title
                }" (ID: ${sourceNodeId})`
              );

              // Get a reference to the current nodes length before adding
              const previousNodesLength = nodes.length;

              // Add the node at the determined position
              addNode(sourceNodeId, isAfter);

              // Rest of your code remains the same...
              // Wait for React to update the state
              setTimeout(() => {
                // Get the updated nodes from the store
                const currentNodes = useFlowStore.getState().nodes;

                // Make sure a new node was actually added
                if (currentNodes.length <= previousNodesLength) {
                  toast.error("Failed to add the new node");
                  return;
                }

                // Find the newly created node
                // It should be at the position right after or before the source node
                const sourceIndex = currentNodes.findIndex(
                  (node) => node.id === sourceNodeId
                );
                const newNodeIndex = isAfter ? sourceIndex + 1 : sourceIndex;

                // Make sure the index is valid
                if (newNodeIndex >= 0 && newNodeIndex < currentNodes.length) {
                  const newNodeId = currentNodes[newNodeIndex].id;

                  // Update the new node with our suggestion data
                  updateNode(newNodeId, {
                    title: suggestion.title,
                    description: suggestion.description,
                    components: suggestion.components || [],
                  });

                  toast.success("New step added based on the suggestion!", {
                    icon: <Check className="h-4 w-4 text-green-500" />,
                  });

                  // Close the suggestion after applying
                  setIsOpen({ ...isOpen, [suggestion.id]: false });
                } else {
                  toast.error("Could not locate the newly added node");
                }
              }, 100); // Give React enough time to update the state
            } catch (error) {
              console.error("Error adding node:", error);
              toast.error("Failed to add the suggested node");
            }
          } catch (error) {
            console.error("Error adding node:", error);
            toast.error("Failed to add the suggested node");
          }
        }
      } else if (suggestion.type === "flow" && suggestion.preview) {
        // If it's a whole flow restructure suggestion
        try {
          // Ensure we have valid JSON by doing extra validation
          const preview =
            typeof suggestion.preview === "string"
              ? suggestion.preview.trim()
              : JSON.stringify(suggestion.preview);

          let newSteps: FlowStep[];

          try {
            // Try to parse the JSON preview
            newSteps = JSON.parse(preview) as FlowStep[];

            // Basic validation: ensure it's an array of steps
            if (!Array.isArray(newSteps)) {
              throw new Error("Preview data is not an array");
            }

            // Ensure each step has required properties
            newSteps = newSteps.map((step) => ({
              id:
                step.id ||
                `step-${Math.random().toString(36).substring(2, 11)}`,
              title: step.title || "Untitled Step",
              description: step.description || "",
              components: Array.isArray(step.components) ? step.components : [],
            }));

            // Apply the new steps to the flow
            setSteps(newSteps);

            toast.success("Flow restructured based on the suggestion!", {
              icon: <Check className="h-4 w-4 text-green-500" />,
            });
          } catch (parseError) {
            console.error("Error parsing flow preview JSON:", parseError);
            toast.error("Couldn't apply flow suggestion. Invalid JSON format.");
            return;
          }

          // Close the suggestion after applying
          setIsOpen({ ...isOpen, [suggestion.id]: false });
        } catch (e) {
          console.error("Error applying flow suggestion:", e);
          toast.error("Couldn't apply flow suggestion. Invalid format.");
        }
      }
    } catch (error) {
      console.error("Error applying suggestion:", error);
      toast.error("Failed to apply suggestion.");
    } finally {
      setIsImplementing(null);
    }
  };

  const toggleSuggestion = (id: string) => {
    setIsOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getTypeIcon = (type: Suggestion["type"]) => {
    switch (type) {
      case "improvement":
        return <Wand2 className="h-4 w-4 text-blue-400" />;
      case "addition":
        return <PlusCircle className="h-4 w-4 text-green-400" />;
      case "flow":
        return <RefreshCw className="h-4 w-4 text-purple-400" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      default:
        return <LightbulbIcon className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getTypeBadge = (type: Suggestion["type"]) => {
    switch (type) {
      case "improvement":
        return (
          <Badge
            variant="outline"
            className="bg-blue-950/30 text-blue-300 border-blue-800"
          >
            Improvement
          </Badge>
        );
      case "addition":
        return (
          <Badge
            variant="outline"
            className="bg-green-950/30 text-green-300 border-green-800"
          >
            Addition
          </Badge>
        );
      case "flow":
        return (
          <Badge
            variant="outline"
            className="bg-purple-950/30 text-purple-300 border-purple-800"
          >
            Flow Structure
          </Badge>
        );
      case "warning":
        return (
          <Badge
            variant="outline"
            className="bg-amber-950/30 text-amber-300 border-amber-800"
          >
            Warning
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-slate-800 text-slate-300">
            Suggestion
          </Badge>
        );
    }
  };

  const getImpactBadge = (impact?: "high" | "medium" | "low") => {
    if (!impact) return null;

    switch (impact) {
      case "high":
        return (
          <Badge className="bg-red-900/40 text-red-300 hover:bg-red-900/60">
            High Impact
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-yellow-900/40 text-yellow-300 hover:bg-yellow-900/60">
            Medium Impact
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-green-900/40 text-green-300 hover:bg-green-900/60">
            Low Impact
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredSuggestions = suggestions.filter((suggestion) => {
    if (activeTab === "all") return true;
    if (activeTab === "improvements") return suggestion.type === "improvement";
    if (activeTab === "additions") return suggestion.type === "addition";
    if (activeTab === "warnings") return suggestion.type === "warning";
    if (activeTab === "structure") return suggestion.type === "flow";
    return true;
  });

  const isValidSuggestion = (suggestion: Suggestion): boolean => {
    if (!suggestion.actionable) return false;

    if (suggestion.type === "improvement") {
      // Check if the node ID exists
      const nodeId = suggestion.id.split("-")[1];
      return !!nodes.find((n) => n.id === nodeId);
    }

    if (suggestion.type === "addition") {
      // Make sure we have at least one node to connect to
      return nodes.length > 0;
    }

    if (suggestion.type === "flow") {
      // Must have a preview to replace the flow
      return !!suggestion.preview && typeof suggestion.preview === "string";
    }

    return false;
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
          AI Suggestions
        </h2>
        <Button
          onClick={generateSuggestions}
          disabled={isLoading}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Analyzing...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Get Suggestions
            </>
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-[120px] w-full bg-zinc-800/50" />
          <Skeleton className="h-[120px] w-full bg-zinc-800/50" />
          <Skeleton className="h-[120px] w-full bg-zinc-800/50" />
        </div>
      ) : suggestions.length > 0 ? (
        <>
          <Tabs
            defaultValue="all"
            className="mb-4"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-5 mb-4 bg-zinc-900/50">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="improvements">Improve</TabsTrigger>
              <TabsTrigger value="additions">Add</TabsTrigger>
              <TabsTrigger value="structure">Structure</TabsTrigger>
              <TabsTrigger value="warnings">Warnings</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="m-0">
              <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-2">
                {filteredSuggestions.map((suggestion) => (
                  <Collapsible
                    key={suggestion.id}
                    open={isOpen[suggestion.id]}
                    onOpenChange={() => toggleSuggestion(suggestion.id)}
                    className={`
                      bg-zinc-800/40 border rounded-lg overflow-hidden
                      ${
                        isOpen[suggestion.id]
                          ? "border-blue-600/50"
                          : "border-zinc-700/50"
                      }
                      ${
                        isOpen[suggestion.id]
                          ? "shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                          : ""
                      }
                    `}
                  >
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => toggleSuggestion(suggestion.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(suggestion.type)}
                          <h3 className="font-medium text-white">
                            {suggestion.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTypeBadge(suggestion.type)}
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              {isOpen[suggestion.id] ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                      </div>
                    </div>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-3">
                        <div className="flex flex-wrap gap-2 items-center mb-2">
                          {getImpactBadge(suggestion.impact)}
                          {suggestion.actionable && (
                            <Badge
                              variant="outline"
                              className="bg-zinc-900/50 border-zinc-700"
                            >
                              Actionable
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-zinc-300 whitespace-pre-line">
                          {suggestion.description}
                        </p>

                        {suggestion.details && (
                          <div className="mt-3 bg-zinc-900/50 border border-zinc-700/50 rounded-md p-3">
                            <h4 className="text-xs uppercase text-zinc-500 font-semibold mb-2">
                              Details
                            </h4>
                            <p className="text-sm text-zinc-400">
                              {suggestion.details}
                            </p>
                          </div>
                        )}

                        {(suggestion.before || suggestion.after) && (
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            {suggestion.before && (
                              <div className="bg-zinc-900/80 border border-zinc-700/50 rounded-md p-3">
                                <h4 className="text-xs uppercase text-zinc-500 font-semibold mb-2">
                                  Before
                                </h4>
                                <p className="text-sm text-zinc-400 whitespace-pre-line">
                                  {suggestion.before}
                                </p>
                              </div>
                            )}
                            {suggestion.after && (
                              <div className="bg-zinc-900/80 border border-indigo-800/30 rounded-md p-3">
                                <h4 className="text-xs uppercase text-zinc-500 font-semibold mb-2">
                                  After
                                </h4>
                                <p className="text-sm text-indigo-300 whitespace-pre-line">
                                  {suggestion.after}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {suggestion.actionable &&
                          isValidSuggestion(suggestion) && (
                            <div className="flex justify-end mt-4">
                              <Button
                                variant="default"
                                size="sm"
                                disabled={isImplementing === suggestion.id}
                                onClick={() =>
                                  handleApplySuggestion(suggestion)
                                }
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                              >
                                {isImplementing === suggestion.id ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    Implementing...
                                  </>
                                ) : (
                                  <>
                                    Apply to Flow{" "}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-zinc-800/20 border border-dashed border-zinc-700 rounded-lg">
          <LightbulbIcon className="h-12 w-12 text-yellow-500/40 mb-4" />
          <h3 className="text-lg font-medium text-zinc-300">
            Ready for suggestions?
          </h3>
          <p className="text-sm text-zinc-400 mt-2 max-w-md">
            Click &quot;Get Suggestions&quot; to analyze your current flow and
            receive AI-powered recommendations for improvements, new steps, and
            structure optimization.
          </p>
        </div>
      )}
    </div>
  );
}
