"use client";

import type React from "react";
import { Plus, Workflow } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

type ActionCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  hoverColor: string;
  onClick?: () => void;
};

function ActionCard({
  icon,
  title,
  description,
  color,
  hoverColor,
  onClick,
}: ActionCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, backgroundColor: "rgba(161, 161, 170, 0.15)" }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="bg-zinc-900/30 backdrop-blur-md border border-zinc-700/90 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer group"
      onClick={onClick}
    >
      <div
        className={`w-16 h-16 mb-4 flex items-center justify-center ${color} rounded-full group-hover:${hoverColor} transition-colors`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-gray-400 mt-2">{description}</p>
    </motion.div>
  );
}

export function ActionCards() {
  const [isCreateFlowDialogOpen, setIsCreateFlowDialogOpen] = useState(false);
  const [flowName, setFlowName] = useState("Untitled Flow");
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  // Direct client-side flow creation that bypasses API authentication
  const handleCreateFlow = async () => {
    if (!flowName.trim()) {
      toast.error("Please enter a flow name");
      return;
    }

    try {
      setIsCreating(true);
      
      // Generate a new flow ID
      const flowId = uuidv4();
      
      // Create a basic flow skeleton
      const initialStep = {
        id: `step-${uuidv4()}`,
        title: "Initial Step",
        description: "Start building your flow",
        components: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Store flow name in sessionStorage for retrieval in flow page
      sessionStorage.setItem(`flow-${flowId}-name`, flowName.trim());
      
      // Success feedback
      toast.success("Flow created successfully!");
      setIsCreateFlowDialogOpen(false);
      
      // Navigate to the flow page directly
      router.push(`/flow/${flowId}`);
    } catch (error) {
      console.error("Error creating flow:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <ActionCard
          icon={<Workflow className="w-8 h-8 text-zinc-200 " />}
          title="Create a Blank Flow"
          description="Start from scratch"
          color="bg-zinc-600/50 "
          hoverColor="bg-zinc-700"
          onClick={() => setIsCreateFlowDialogOpen(true)}
        />
      </motion.div>

      {/* Create Flow Dialog */}
      <Dialog open={isCreateFlowDialogOpen} onOpenChange={setIsCreateFlowDialogOpen}>
        <DialogContent className="bg-zinc-900 text-white border-zinc-700">
          <DialogHeader>
            <DialogTitle>Create New Flow</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="flow-name">Flow Name</Label>
              <Input
                id="flow-name"
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Enter flow name"
                autoFocus
              />
            </div>
          </div>
          
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsCreateFlowDialogOpen(false)}
              className="bg-transparent text-white border-zinc-700 hover:bg-zinc-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFlow}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create Flow"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
