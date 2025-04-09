"use client";

import { Star, Clock, Folder } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export function DashboardTabs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Tabs defaultValue="all" className="w-full ">
        <TabsList className="bg-zinc-900/50 backdrop-blur-md border border-zinc-700/60 rounded-xl p-1">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-zinc-800/70 data-[state=active]:text-white text-gray-400 rounded-lg"
          >
            <Star className="w-4 h-4 mr-2" />
            All
          </TabsTrigger>
          <TabsTrigger
            value="recents"
            className="data-[state=active]:bg-zinc-800/70 data-[state=active]:text-white text-gray-400 rounded-lg"
          >
            <Clock className="w-4 h-4 mr-2" />
            Recents
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
