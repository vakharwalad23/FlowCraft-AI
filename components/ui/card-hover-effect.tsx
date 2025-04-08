"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface HoverEffectProps {
  items: {
    title: string;
    description: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}

export const HoverEffect: React.FC<HoverEffectProps> = ({
  items,
  className,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="group relative overflow-hidden rounded-lg bg-gray-900 p-8 transition-all hover:bg-gray-800"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="relative z-10 flex flex-col items-start">
            {item.icon && <div className="mb-4">{item.icon}</div>}
            <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.description}</p>
          </div>
          <div
            className={`absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 opacity-0 transition-opacity duration-300 ${
              hoveredIndex === idx ? "opacity-10" : ""
            }`}
          />
        </div>
      ))}
    </div>
  );
}; 