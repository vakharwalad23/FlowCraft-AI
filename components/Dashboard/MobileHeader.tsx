"use client";

import { Menu, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface MobileHeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isMac: boolean;
}

export function MobileHeader({
  isSidebarOpen,
  toggleSidebar,
  searchQuery,
  setSearchQuery,
  isMac,
}: MobileHeaderProps) {
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="md:hidden flex items-center justify-between p-3 border-b border-zinc-700/90 bg-black/50 backdrop-blur-md sticky top-0 z-30">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="text-zinc-300 hover:bg-black/70 focus:ring-0 focus:outline-none"
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>
      
      <div className="flex-1 mx-3 relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={searchInputRef}
          type="search"
          placeholder="Search flows..."
          className="w-full pl-8 py-1 h-9 text-sm bg-black/50 focus:outline-none focus:ring-0 border-zinc-700/90 text-white rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
}
