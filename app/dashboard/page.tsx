"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DashboardTabs } from "@/components/Dashboard/DashboardTabs";
import { ActionCards } from "@/components/Dashboard/ActionCards";
import { FilesTable } from "@/components/Dashboard/FilesTable";
import { toast } from "sonner";
import { Flow } from "@/types/flow";
import { useRouter } from "next/navigation";

export type File = {
  id: string;
  name: string;
  created: string;
  edited: string;
};

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFlows = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/flows");
        
        if (!response.ok) {
          throw new Error("Failed to fetch flows");
        }
        
        const data = await response.json();
        
        // Convert flow data to file format for the table
        const flowFiles: File[] = [];
        
        // Add flows from folders
        data.folders.forEach((folder: any) => {
          folder.flows.forEach((flow: Flow) => {
            flowFiles.push({
              id: flow.id,
              name: flow.name,
              created: formatDate(flow.createdAt),
              edited: formatDate(flow.updatedAt),
            });
          });
        });
        
        // Add unorganized flows
        data.unorganizedFlows.forEach((flow: Flow) => {
          flowFiles.push({
            id: flow.id,
            name: flow.name,
            created: formatDate(flow.createdAt),
            edited: formatDate(flow.updatedAt),
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRenameFile = async (id: string, newName: string) => {
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

      setFiles((prevFiles) =>
        prevFiles.map((file) => {
          if (file.id === id) {
            return {
              ...file,
              name: newName,
              edited: "Just now",
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

  const handleDeleteFile = async (id: string) => {
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

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white">
      <div className="container mx-auto p-4 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <DashboardTabs />

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

        <ActionCards />
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
            <span className="ml-3">Loading flows...</span>
          </div>
        ) : (
          <FilesTable 
            files={filteredFiles} 
            onRename={handleRenameFile}
            onDelete={handleDeleteFile}
          />
        )}
      </div>
    </div>
  );
}
