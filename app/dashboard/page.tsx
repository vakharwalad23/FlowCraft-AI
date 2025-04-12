"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ActionCards } from "@/components/Dashboard/ActionCards";
import { FilesTable } from "@/components/Dashboard/FilesTable";
import { DashboardTabs } from "@/components/Dashboard/DashboardTabs";
import type { Flow, FlowFolder } from "@/types/flow";

// Update File interface in dashboard/page.tsx
interface File {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  created?: string;
  edited?: string;
  folderId?: string;
  folderName?: string;
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    fetchFlows();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Update the fetchFlows function to maintain folder structure
  const fetchFlows = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/flows");

      if (!response.ok) {
        throw new Error("Failed to fetch flows");
      }

      const data = await response.json();


      const flowFiles: File[] = [];

      // Add flows from folders
      data.folders.forEach((folder: FlowFolder) => {
        folder.flows.forEach((flow: Flow) => {
          // Ensure we have valid dates, default to current time if not
          const createdAt = flow.createdAt || new Date().toISOString();
          const updatedAt = flow.updatedAt || new Date().toISOString();

          flowFiles.push({
            id: flow.id,
            name: flow.name,
            createdAt: createdAt,
            updatedAt: updatedAt,
            folderId: folder.id,
            folderName: folder.name,
          });
        });
      });

      // Add unorganized flows
      data.unorganizedFlows.forEach((flow: Flow) => {
        const createdAt = flow.createdAt || new Date().toISOString();
        const updatedAt = flow.updatedAt || new Date().toISOString();

        flowFiles.push({
          id: flow.id,
          name: flow.name,
          createdAt: createdAt,
          updatedAt: updatedAt,
        });
      });

      setFiles(flowFiles);
    } catch (error) {
      console.error("Error fetching flows:", error);
      toast.error("Failed to load flows");
    } finally {
      setIsLoading(false);
    }
  };


  // Filter files based on search and active tab
  const getFilteredFiles = () => {
    let filtered = files;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by tab selection
    if (activeTab === "folders") {
      filtered = filtered.filter((file) => file.folderId);
    } else if (activeTab === "unorganized") {
      filtered = filtered.filter((file) => !file.folderId);
    }

    return filtered;
  };



  const handleRenameFlow = async (id: string, newName: string) => {
    try {
      const response = await fetch(`/api/flows/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        throw new Error("Failed to rename flow");
      }

      const now = new Date().toISOString();

      setFiles((prevFiles) =>
        prevFiles.map((file) => {
          if (file.id === id) {
            return {
              ...file,
              name: newName,
              updatedAt: now, // Update raw date
              edited: "Just now", // Update formatted date
            };
          }
          return file;
        })
      );
      toast.success(`Flow renamed to "${newName}"`);
    } catch (error) {
      console.error("Error renaming flow:", error);
      toast.error("Failed to rename flow");
    }
  };

  const handleDeleteFlow = async (id: string) => {
    try {
      const response = await fetch(`/api/flows/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete flow");
      }

      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
      toast.success("Flow deleted successfully");
    } catch (error) {
      console.error("Error deleting flow:", error);
      toast.error("Failed to delete flow");
    }
  };

  const handleMoveToFolder = async (
    id: string,
    folderId: string | null,
    folderName: string | null
  ) => {
    try {
      const response = await fetch(`/api/flows/${id}/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folderId }),
      });

      if (!response.ok) {
        throw new Error("Failed to move flow");
      }

      // Update the files state
      setFiles((prevFiles) =>
        prevFiles.map((file) => {
          if (file.id === id) {
            return {
              ...file,
              folderId: folderId || undefined,
              folderName: folderName || undefined,
            };
          }
          return file;
        })
      );

      toast.success(
        folderId
          ? `Flow moved to folder "${folderName}"`
          : "Flow removed from folder"
      );
    } catch (error) {
      console.error("Error moving flow:", error);
      toast.error("Failed to move flow");
    }
  };

  const handleFlowClick = (id: string) => {
    router.push(`/flow/${id}`);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white">
      <div className="container mx-auto p-4 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <DashboardTabs onTabChange={handleTabChange} />

          <div className="flex items-center gap-2 border border-zinc-700/50 rounded-xl">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search"
                className="w-64 pl-8 bg-zinc-800/50 focus:outline-none focus:ring-0 focus:border-0 border-zinc-700/50 text-white rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute right-2.5 top-2.5 text-xs text-gray-400">
                Ctrl + K
              </span>
            </div>
          </div>
        </div>

        <ActionCards onFlowCreated={fetchFlows} />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
            <span className="ml-3">Loading flows...</span>
          </div>
        ) : (
          <FilesTable
            files={getFilteredFiles()}
            onRename={handleRenameFlow}
            onDelete={handleDeleteFlow}
            onFlowClick={handleFlowClick}
            onMoveToFolder={handleMoveToFolder}
          />
        )}
      </div>
    </div>
  );
}
