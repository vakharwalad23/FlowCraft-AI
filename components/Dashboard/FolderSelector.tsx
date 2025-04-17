"use client";

import { useEffect, useState } from "react";
import { Check, FolderPlus, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Folder {
  id: string;
  name: string;
}

interface FolderSelectorProps {
  onSelect: (folderId: string | null, folderName: string | null) => void;
  selectedFolderId?: string | null;
}

export function FolderSelector({
  onSelect,
  selectedFolderId,
}: FolderSelectorProps) {
  const [open, setOpen] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  useEffect(() => {
    if (open) {
      fetchFolders();
    }
  }, [open]);

  useEffect(() => {
    // Set selected folder when selectedFolderId prop changes and folders are loaded
    if (selectedFolderId && folders.length > 0) {
      const folder = folders.find((f) => f.id === selectedFolderId) || null;
      setSelectedFolder(folder);
    }
  }, [selectedFolderId, folders]);

  const fetchFolders = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/folders");
      if (!response.ok) {
        throw new Error("Failed to fetch folders");
      }
      const data = await response.json();
      setFolders(data || []);
    } catch (error) {
      console.error("Error fetching folders:", error);
      toast.error("Failed to load folders");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }

    setCreating(true);
    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newFolderName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to create folder");
      }

      const newFolder = await response.json();
      setFolders((prev) => [...prev, newFolder]);
      setSelectedFolder(newFolder);
      onSelect(newFolder.id, newFolder.name);
      setNewFolderName("");
      toast.success(`Folder "${newFolder.name}" created`);

      // Optionally close the popover
      // setOpen(false);
    } catch (error: unknown) {
      console.error("Error creating folder:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Failed to create folder");
      } else {
        toast.error("Failed to create folder");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleSelectFolder = (folder: Folder | null) => {
    setSelectedFolder(folder);
    onSelect(folder?.id || null, folder?.name || null);
    setOpen(false);
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between bg-transparent border-zinc-700/90 text-zinc-300 hover:bg-black/70 hover:text-white transition-colors focus:ring-0 focus:outline-none"
          >
            {selectedFolder ? (
              <span>{selectedFolder.name}</span>
            ) : (
              <span className="text-zinc-400">Select folder (optional)</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 bg-black/50 border-zinc-700/90 text-zinc-100 w-[90vw] sm:w-[280px] shadow-lg overflow-hidden">
          <Command className="bg-transparent">
            <CommandInput
              placeholder="Search folders..."
              className="focus:ring-0 focus:outline-none border-zinc-700/90 transition-colors text-zinc-200 bg-transparent"
            />
            {loading ? (
              <div className="flex items-center justify-center p-4 sm:p-6">
                <Loader2 className="h-5 w-5 text-zinc-400 animate-spin" />
                <span className="ml-2 text-zinc-400 text-sm">Loading folders...</span>
              </div>
            ) : (
              <CommandList className="max-h-[300px]">
                <CommandEmpty className="py-3 text-zinc-400 text-sm">No folders found</CommandEmpty>
                <CommandGroup heading="Folders" className="text-zinc-400 text-xs px-2 sm:px-3">
                  <CommandItem
                    value="none"
                    onSelect={() => handleSelectFolder(null)}
                    className="cursor-pointer hover:bg-black/70 text-zinc-300 focus:ring-0 focus:outline-none"
                  >
                    <span>No folder (Default)</span>
                    {!selectedFolder && <Check className="ml-auto h-4 w-4 text-emerald-500" />}
                  </CommandItem>
                  {folders.map((folder) => (
                    <CommandItem
                      key={folder.id}
                      value={folder.name}
                      onSelect={() => handleSelectFolder(folder)}
                      className="cursor-pointer hover:bg-black/70 text-zinc-300 focus:ring-0 focus:outline-none"
                    >
                      <span>{folder.name}</span>
                      {selectedFolder?.id === folder.id && (
                        <Check className="ml-auto h-4 w-4 text-emerald-500" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator className="bg-zinc-700/90 my-1" />
                <CommandGroup heading="Create New" className="text-zinc-400 text-xs px-2 sm:px-3">
                  <div className="p-2 sm:p-3 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Input
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="New folder name"
                        className="bg-black/50 border-zinc-700/90 text-zinc-200 text-sm focus:outline-none focus:ring-0"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleCreateFolder();
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        onClick={handleCreateFolder}
                        disabled={creating || !newFolderName.trim()}
                        className="bg-black/50 hover:bg-black/70 border border-zinc-700/90 text-zinc-200 transition-colors focus:ring-0 focus:outline-none"
                      >
                        {creating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <FolderPlus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {creating && (
                      <p className="text-xs text-zinc-400">Creating folder...</p>
                    )}
                  </div>
                </CommandGroup>
              </CommandList>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
