"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DashboardTabs } from "@/components/Dashboard/DashboardTabs";
import { ActionCards } from "@/components/Dashboard/ActionCards";
import { FilesTable } from "@/components/Dashboard/FilesTable";
import { toast } from "sonner";

export type File = {
  id: number;
  name: string;
  created: string;
  edited: string;
};

// TODO: Remove this and use the actual files from the local storage
// atleast add id , name , created and edited at the time of storing in local storage
// these three are required for the files table and the search functionality
const SAMPLE_FILES: File[] = [
  {
    id: 1,
    name: "Demo File ",
    created: "2 months ago",
    edited: "2 months ago",
  },
  {
    id: 2,
    name: "Marketing Plan",
    created: "1 week ago",
    edited: "3 days ago",
  },
  {
    id: 3,
    name: "Budget 2024",
    created: "1 month ago",
    edited: "2 weeks ago",
  },
  {
    id: 4,
    name: "Product Roadmap",
    created: "3 months ago",
    edited: "1 month ago",
  },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>(SAMPLE_FILES);

  useEffect(() => {
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

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRenameFile = (id: number, newName: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) => {
        if (file.id === id) {
          return {
            ...file,
            name: newName,
            edited: "Just now", // Update the edited timestamp
          };
        }
        return file;
      })
    );
    toast.success(`File renamed to "${newName}"`);
  };

  const handleDeleteFile = (id: number) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    toast.success("File deleted successfully");
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
        <FilesTable 
          files={filteredFiles} 
          onRename={handleRenameFile}
          onDelete={handleDeleteFile}
        />
      </div>
    </div>
  );
}
