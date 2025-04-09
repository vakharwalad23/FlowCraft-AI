"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MoreVertical, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const files = [
  {
    id: 1,
    name: " App",
    location: "India",
    created: "2 months ago",
    edited: "2 months ago", 
    comments: 0,
  },
  {
    id: 2,
    name: "Marketing Plan",
    location: "Projects",
    created: "1 week ago",
    edited: "3 days ago",
    comments: 5,
  },
  {
    id: 3,
    name: "Budget 2024",
    location: "Finance",
    created: "1 month ago",
    edited: "2 weeks ago",
    comments: 2,
  },
  {
    id: 4,
    name: "Product Roadmap",
    location: "Strategy",
    created: "3 months ago",
    edited: "1 month ago",
    comments: 8,
  },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

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

  // Filter files based on search query
  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <Tabs defaultValue="all" className="w-full ">
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-popover/59"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="recents"
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-white  text-popover/59"
              >
                Recents
              </TabsTrigger>

              <TabsTrigger
                value="folders"
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-popover/59"
              >
                Folders
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search"
                className="w-64 pl-8 bg-gray-800 border-gray-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute right-2.5 top-2.5 text-xs text-gray-400">
                Ctrl + K
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-gray-800 transition-colors cursor-pointer">
            <div className="w-12 h-12 mb-4 flex items-center justify-center">
              <Workflow className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium">Create a Blank Flow </h3>
          </div>
        </div>

        <div className="bg-black rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-gray-800">
                <TableHead className="text-gray-400 font-medium">
                  NAME
                </TableHead>
                <TableHead className="text-gray-400 font-medium">
                  CREATED
                </TableHead>
                <TableHead className="text-gray-400 font-medium">
                  EDITED
                </TableHead>

                <TableHead className="text-gray-400 font-medium w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <TableRow
                    key={file.id}
                    className="hover:bg-gray-900 border-b border-gray-800 cursor-pointer"
                  >
                    <TableCell className="font-medium">{file.name}</TableCell>

                    <TableCell>{file.created}</TableCell>
                    <TableCell>{file.edited}</TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-black text-white border-gray-700 p-2"
                        >
                          <DropdownMenuItem>Open</DropdownMenuItem>
                          <DropdownMenuItem>Rename</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No files found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
