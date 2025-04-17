"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Workflow, Clock, Folder } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ActionCards } from "@/components/Dashboard/ActionCards";
import { FilesTable } from "@/components/Dashboard/FilesTable";
import { Sidebar } from "@/components/Dashboard/Sidebar";
import { Skeleton } from "@/components/ui/skeleton";
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
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Pass activeTab and handleTabChange to Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main content */}
      <div className="flex-1 relative overflow-y-auto">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-500/20 to-transparent blur-[100px]" />
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-pink-500/20 to-transparent blur-[100px]" />
          <div className="absolute bottom-0 left-1/3 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-indigo-500/20 to-transparent blur-[100px]" />
        </div>

        <div className="container p-4 relative z-10">
          {/* Updated search bar container - centered and full width */}
          <div className="flex items-center justify-start mb-8 ml-6">
            <div className="relative border border-zinc-700/50 rounded-xl w-1/2 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search your flows..."
                className="w-full pl-10 py-6 h-12 text-base bg-black/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 border-zinc-700/50 text-white rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-zinc-800 px-2 py-1 rounded text-gray-400">
                Ctrl + K
              </span>
            </div>
          </div>

          <ActionCards onFlowCreated={fetchFlows} />

          {/* Add a title section that shows current tab */}
          <div className=" p-6 mt-6">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white flex items-center">
                {activeTab === "all" && (
                  <Workflow className="h-5 w-5 mr-2 text-purple-400" />
                )}
                {activeTab === "unorganized" && (
                  <Clock className="h-5 w-5 mr-2 text-purple-400" />
                )}
                {activeTab === "folders" && (
                  <Folder className="h-5 w-5 mr-2 text-purple-400" />
                )}
                {activeTab === "all" && "All Flows"}
                {activeTab === "unorganized" && "Unorganized Flows"}
                {activeTab === "folders" && "Folders"}
              </h2>
            </div>

            {isLoading ? (
              <div className="rounded-lg border border-zinc-700/90 overflow-hidden">
                {/* Table header skeleton */}
                <div className="bg-black/50 border-b border-zinc-800/70 p-3">
                  <div className="flex items-center w-full">
                    <Skeleton className="h-5 w-[50%] bg-zinc-800/80" />{" "}
                    <Skeleton className="h-5 w-[15%] bg-zinc-800/80 mx-2" />{" "}
                    {/* Created date */}
                    <Skeleton className="h-5 w-[15%] bg-zinc-800/80 mx-2" />{" "}
                    {/* Last edited */}
                    <div className="ml-auto">
                      <Skeleton className="h-5 w-16 bg-zinc-800/80" />{" "}
                      {/* Actions */}
                    </div>
                  </div>
                </div>

                {/* Table rows skeleton */}
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="flex items-center w-full p-4 hover:bg-black/30 border-b border-zinc-800/50 transition-colors"
                    >
                      {/* Name column with icon */}
                      <div className="flex items-center w-[50%]">
                        <Skeleton className="h-8 w-8 rounded-full bg-zinc-800/80" />
                        <Skeleton className="h-5 w-48 ml-3 bg-zinc-800/80" />
                      </div>

                      {/* Created date */}
                      <div className="w-[15%]">
                        <Skeleton className="h-4 w-24 bg-zinc-800/80" />
                      </div>

                      {/* Last edited */}
                      <div className="w-[15%]">
                        <Skeleton className="h-4 w-24 bg-zinc-800/80" />
                      </div>

                      {/* Actions */}
                      <div className="ml-auto text-right">
                        <Skeleton className="h-8 w-8 rounded-full inline-block bg-zinc-800/80" />
                      </div>
                    </div>
                  ))}
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
      </div>
    </div>
  );
}
