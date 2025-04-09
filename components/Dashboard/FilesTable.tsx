"use client";

import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import type { File } from "@/app/dashboard/page";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type FileRowProps = {
  file: File;
  index: number;
  onRename: (id: number, newName: string) => void;
  onDelete: (id: number) => void;
};

type FilesTableProps = {
  files: File[];
  onRename?: (id: number, newName: string) => void;
  onDelete?: (id: number) => void;
};

function FileRow({ file, index, onRename, onDelete }: FileRowProps) {
  return (
    <motion.tr
      key={file.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 * index }}
      className="group"
    >
      <TableCell className="font-medium border-b border-zinc-800/50 group-hover:bg-zinc-800/20">
        {file.name}
      </TableCell>
      <TableCell className="border-b border-zinc-800/50 group-hover:bg-zinc-800/20">
        {file.created}
      </TableCell>
      <TableCell className="border-b border-zinc-800/50 group-hover:bg-zinc-800/20">
        {file.edited}
      </TableCell>
      <TableCell className="border-b border-zinc-800/50 group-hover:bg-zinc-800/20">
        <FileActions file={file} onRename={onRename} onDelete={onDelete} />
      </TableCell>
    </motion.tr>
  );
}

type FileActionsProps = {
  file: File;
  onRename: (id: number, newName: string) => void;
  onDelete: (id: number) => void;
};

function FileActions({ file, onRename, onDelete }: FileActionsProps) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState(file.name);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleRename = () => {
    onRename(file.id, newFileName);
    setIsRenameDialogOpen(false);
  };

  const handleDelete = () => {
    onDelete(file.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-zinc-800/50"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-zinc-900 text-white border-zinc-700 backdrop-blur-md"
        >
          <DropdownMenuItem className="hover:bg-zinc-800/30 cursor-pointer">
            Open
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:bg-zinc-800/30 cursor-pointer"
            onClick={() => {
              setNewFileName(file.name);
              setIsRenameDialogOpen(true);
            }}
          >
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:bg-zinc-800/30 cursor-pointer text-red-400"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="bg-zinc-900 text-white border-zinc-700">
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
          </DialogHeader>
          <Input
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
            autoFocus
          />
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
              className="bg-transparent text-white border-zinc-700 hover:bg-zinc-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-zinc-900 text-white border-zinc-700">
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{file.name}</span>? This action
            cannot be undone.
          </p>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-transparent text-white border-zinc-700 hover:bg-zinc-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function FilesTable({ files, onRename, onDelete }: FilesTableProps) {
  const handleRename = (id: number, newName: string) => {
    if (onRename) {
      onRename(id, newName);
    } else {
      console.log(`Rename file ${id} to ${newName}`);
      // Default implementation if no handler is provided
    }
  };

  const handleDelete = (id: number) => {
    if (onDelete) {
      onDelete(id);
    } else {
      console.log(`Delete file ${id}`);
      // Default implementation if no handler is provided
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-zinc-900/30 backdrop-blur-md border border-zinc-700/90 rounded-xl overflow-hidden p-3"
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-zinc-800/50">
            <TableHead className="text-gray-400 font-medium">NAME</TableHead>
            <TableHead className="text-gray-400 font-medium">CREATED</TableHead>
            <TableHead className="text-gray-400 font-medium">EDITED</TableHead>
            <TableHead className="text-gray-400 font-medium w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.length > 0 ? (
            files.map((file, index) => (
              <FileRow
                key={file.id}
                file={file}
                index={index}
                onRename={handleRename}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-6 border-b border-zinc-800/50"
              >
                No files found matching your search.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
}
