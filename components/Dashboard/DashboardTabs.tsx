"use client";

import { Star, Clock, Folder } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardTabsProps {
  onTabChange?: (tab: string) => void;
}

export function DashboardTabs({ onTabChange }: DashboardTabsProps) {
  return (
    <div>
      <Tabs defaultValue="all" onValueChange={onTabChange}>
        <TabsList className="bg-black/50 border border-zinc-700/90 p-1 flex gap-1 sm:gap-2 w-full overflow-x-auto">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-purple-500/60 data-[state=active]:text-white text-gray-400 rounded-lg text-xs sm:text-sm focus:ring-0 focus:outline-none"
          >
            <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            All
          </TabsTrigger>
          <TabsTrigger
            value="unorganized"
            className="data-[state=active]:bg-purple-500/60 data-[state=active]:text-white text-gray-400 rounded-lg text-xs sm:text-sm focus:ring-0 focus:outline-none"
          >
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Unorganized
          </TabsTrigger>
          <TabsTrigger
            value="folders"
            className="data-[state=active]:bg-purple-500/60 data-[state=active]:text-white text-gray-400 rounded-lg text-xs sm:text-sm focus:ring-0 focus:outline-none"
          >
            <Folder className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Folders
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
