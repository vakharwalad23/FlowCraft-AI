import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface File {
  id: string;
  name: string;
  createdAt: string; // Original ISO date string
  updatedAt: string; // Original ISO date string
  created?: string; // Formatted date (if parent component formats it)
  edited?: string; // Formatted date (if parent component formats it)
}

interface FilesTableProps {
  files: File[];
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onFlowClick: (id: string) => void;
}

export function FilesTable({
  files,
  onRename,
  onDelete,
  onFlowClick,
}: FilesTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleSave = () => {
    if (editingId && editName.trim()) {
      onRename(editingId, editName);
      setEditingId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleDeleteConfirmed = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  // Update the format functions to be more robust
  const formatCreatedDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Just created";
      }

      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      };

      return date.toLocaleDateString("en-US", options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Just created";
    }
  };

  // Format last edited date to show relative time
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Just now";
      }

      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffSeconds = Math.floor(diffTime / 1000);

      // Rest of your formatting logic...
      if (diffSeconds < 60) {
        return "Just now";
      }
      
      const diffMinutes = Math.floor(diffSeconds / 60);
      if (diffMinutes < 60) {
        return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
      }
      
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) {
        return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
      }
      
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) {
        return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
      }
      
      if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
      }
      
      if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
      }
      
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    } catch (error) {
      console.error("Error calculating relative time:", error);
      return "Just now";
    }
  };

  return (
    <>
      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-900">
            <TableRow className="hover:bg-zinc-900/50">
              <TableHead className="w-[50%] text-zinc-400 font-medium">
                Name
              </TableHead>
              <TableHead className="text-zinc-400 font-medium">
                Created
              </TableHead>
              <TableHead className="text-zinc-400 font-medium">
                Last edited
              </TableHead>
              <TableHead className="text-right text-zinc-400 font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-zinc-500"
                >
                  No flows found. Create your first flow to get started.
                </TableCell>
              </TableRow>
            ) : (
              files.map((file) => (
                <TableRow key={file.id} className="hover:bg-zinc-800/50">
                  <TableCell>
                    {editingId === file.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        autoFocus
                      />
                    ) : (
                      <div
                        className="cursor-pointer hover:text-blue-400 transition-colors"
                        onClick={() => onFlowClick(file.id)}
                      >
                        {file.name}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {file.created ||
                      (file.createdAt
                        ? formatCreatedDate(file.createdAt)
                        : "Just created")}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {file.edited ||
                      (file.updatedAt
                        ? formatRelativeTime(file.updatedAt)
                        : "Just now")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-zinc-400 hover:text-white"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-zinc-800 text-white border-zinc-700"
                      >
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-zinc-700"
                          onClick={() => onFlowClick(file.id)}
                        >
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-zinc-700"
                          onClick={() => handleEdit(file.id, file.name)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-700" />
                        <DropdownMenuItem
                          className="cursor-pointer text-red-500 hover:bg-zinc-700 hover:text-red-500"
                          onClick={() => confirmDelete(file.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent className="bg-zinc-900 text-white border-zinc-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This action cannot be undone. This will permanently delete this
              flow and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent text-white border-zinc-700 hover:bg-zinc-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteConfirmed}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
