"use client";

import type React from "react";
import { Plus, Workflow } from "lucide-react";
import { motion } from "framer-motion";

type ActionCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  hoverColor: string;
};

function ActionCard({
  icon,
  title,
  description,
  color,
  hoverColor,
}: ActionCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, backgroundColor: "rgba(161, 161, 170, 0.15)" }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="bg-zinc-900/30 backdrop-blur-md border border-zinc-700/90 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer group"
    >
      <div
        className={`w-16 h-16 mb-4 flex items-center justify-center ${color} rounded-full group-hover:${hoverColor} transition-colors`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-gray-400 mt-2">{description}</p>
    </motion.div>
  );
}

export function ActionCards() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      <ActionCard
        icon={<Workflow className="w-8 h-8 text-zinc-200 " />}
        title="Create a Blank Flow"
        description="Start from scratch"
        color="bg-zinc-600/50 "
        hoverColor="bg-zinc-700"
      />
    </motion.div>
  );
}
