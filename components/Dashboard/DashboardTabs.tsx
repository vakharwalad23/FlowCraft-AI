"use client";

import { Star, Clock, Folder } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface DashboardTabsProps {
  onTabChange?: (tab: string) => void;
}

export function DashboardTabs({ onTabChange }: DashboardTabsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Tabs defaultValue="all" onValueChange={onTabChange}>
        <TabsList className="bg-zinc-800/30 border border-zinc-800/50 p-1">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-zinc-800/70 data-[state=active]:text-white text-gray-400 rounded-lg"
          >
            <Star className="w-4 h-4 mr-2" />
            All
          </TabsTrigger>
          <TabsTrigger
            value="unorganized"
            className="data-[state=active]:bg-zinc-800/70 data-[state=active]:text-white text-gray-400 rounded-lg"
          >
            <Clock className="w-4 h-4 mr-2" />
            Unorganized
          </TabsTrigger>
          <TabsTrigger
            value="folders"
            className="data-[state=active]:bg-zinc-800/70 data-[state=active]:text-white text-gray-400 rounded-lg"
          >
            <Folder className="w-4 h-4 mr-2" />
            Folders
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </motion.div>
  );
}
