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
            className="justify-between bg-zinc-800/50 border-zinc-700/30 text-zinc-200 hover:bg-zinc-800 hover:text-white"
          >
            {selectedFolder ? (
              <span>{selectedFolder.name}</span>
            ) : (
              <span>Select folder (optional)</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 bg-zinc-800 border-zinc-700 text-zinc-100 w-[250px]">
          <Command>
            <CommandInput
              placeholder="Search folders..."
              className="bg-zinc-800 text-white border-b border-zinc-700"
            />
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 text-zinc-400 animate-spin" />
                <span className="ml-2 text-zinc-400">Loading folders...</span>
              </div>
            ) : (
              <CommandList>
                <CommandEmpty>No folders found</CommandEmpty>
                <CommandGroup heading="Folders">
                  <CommandItem
                    value="none"
                    onSelect={() => handleSelectFolder(null)}
                    className="cursor-pointer"
                  >
                    <span>No folder (Default)</span>
                    {!selectedFolder && <Check className="ml-auto h-4 w-4" />}
                  </CommandItem>
                  {folders.map((folder) => (
                    <CommandItem
                      key={folder.id}
                      value={folder.name}
                      onSelect={() => handleSelectFolder(folder)}
                      className="cursor-pointer"
                    >
                      <span>{folder.name}</span>
                      {selectedFolder?.id === folder.id && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator className="bg-zinc-700" />
                <CommandGroup heading="Create New">
                  <div className="p-2 flex gap-2">
                    <Input
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="New folder name"
                      className="bg-zinc-900 border-zinc-700 text-white text-sm"
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
                      className="bg-zinc-700 hover:bg-zinc-600"
                    >
                      {creating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <FolderPlus className="h-4 w-4" />
                      )}
                    </Button>
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
