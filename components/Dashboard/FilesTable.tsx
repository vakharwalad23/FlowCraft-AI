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

type FileRowProps = {
  file: File;
  index: number;
};

type FilesTableProps = {
  files: File[];
};

function FileRow({ file, index }: FileRowProps) {
  return (
    <motion.tr
      key={file.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 * index }}
      className="group"
    >
      <TableCell className="font-medium border-b border-zinc-800/50 group-hover:bg-zinc-800/20">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-zinc-800/30 flex items-center justify-center mr-3">
            <span className="text-xs font-bold text-zinc-300">
              {file.name.charAt(0)}
            </span>
          </div>
          {file.name}
        </div>
      </TableCell>
      <TableCell className="border-b border-zinc-800/50 group-hover:bg-zinc-800/20">
        {file.created}
      </TableCell>
      <TableCell className="border-b border-zinc-800/50 group-hover:bg-zinc-800/20">
        {file.edited}
      </TableCell>
      <TableCell className="border-b border-zinc-800/50 group-hover:bg-zinc-800/20">
        <FileActions />
      </TableCell>
    </motion.tr>
  );
}

function FileActions() {
  return (
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
        <DropdownMenuItem className="hover:bg-zinc-800/30 cursor-pointer">
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-zinc-800/30 cursor-pointer text-red-400">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function FilesTable({ files }: FilesTableProps) {
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
              <FileRow key={file.id} file={file} index={index} />
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
