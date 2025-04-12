"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Workflow } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderSelector } from "@/components/Dashboard/FolderSelector";
import useFlowStore from "@/store/useFlowStore";

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
      className="bg-zinc-900/30 backdrop-blur-md border border-zinc-700/90 rounded-xl p-8 flex flex-col items-center justify-center text-center group"
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

interface ActionCardsProps {
  onFlowCreated?: () => void;
}

export function ActionCards({ onFlowCreated }: ActionCardsProps) {
  const [isCreateFlowDialogOpen, setIsCreateFlowDialogOpen] = useState(false);
  const [flowName, setFlowName] = useState("Untitled Flow");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedFolderName, setSelectedFolderName] = useState<string | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const { createNewFlow } = useFlowStore();

  const handleCreateFlow = async () => {
    if (!flowName.trim()) {
      toast.error("Please enter a flow name");
      return;
    }

    try {
      setIsCreating(true);

      // Create the flow with folder information
      const newFlow = await createNewFlow(
        flowName.trim(),
        selectedFolderId || undefined
      );

      // Success feedback
      toast.success(
        `Flow "${flowName}" created ${
          selectedFolderName ? `in folder "${selectedFolderName}"` : ""
        }`
      );
      setIsCreateFlowDialogOpen(false);

      // Reset the form
      setFlowName("Untitled Flow");
      setSelectedFolderId(null);
      setSelectedFolderName(null);

      // Call the callback if provided to refresh the dashboard
      if (onFlowCreated) {
        onFlowCreated();
      }

      // Navigate to the flow page
      router.push(`/flow/${newFlow.id}`);
    } catch (error) {
      console.error("Error creating flow:", error);
      toast.error("Failed to create flow. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleFolderSelect = (
    folderId: string | null,
    folderName: string | null
  ) => {
    setSelectedFolderId(folderId);
    setSelectedFolderName(folderName);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center mb-8"
      >
        <div className="w-full max-w-md">
          <ActionCard
            icon={<Workflow className="w-8 h-8 text-zinc-200" />}
            title="Create Flow"
            description="Start a new user flow diagram from scratch"
            color="bg-blue-600/50"
            hoverColor="bg-blue-700/50"
            onClick={() => setIsCreateFlowDialogOpen(true)}
          />
        </div>
      </motion.div>

      {/* Create Flow Dialog */}
      <Dialog
        open={isCreateFlowDialogOpen}
        onOpenChange={setIsCreateFlowDialogOpen}
      >
        <DialogContent className="bg-zinc-900 text-white border-zinc-700">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Create New Flow
            </DialogTitle>
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

            <div className="space-y-2">
              <Label htmlFor="folder">Folder (Optional)</Label>
              <FolderSelector
                onSelect={handleFolderSelect}
                selectedFolderId={selectedFolderId}
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
              {isCreating ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  <span>Creating...</span>
                </div>
              ) : (
                "Create Flow"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}