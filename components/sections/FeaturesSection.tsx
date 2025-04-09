"use client";

import React from "react";

import { Mic, Sparkles, FileJson, Save, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const features = [
  {
    title: "Voice Input for Project Briefs",
    description:
      "Speak your project brief instead of typing, making input faster and more accessible.",
    icon: <Mic className="h-6 w-6" />,
  },
  {
    title: "AI-Powered Suggestions",
    description:
      "Get real-time AI suggestions for improvements or alternative steps as you modify the flow.",
    icon: <Sparkles className="h-6 w-6" />,
  },
  {
    title: "Multiple Export Options",
    description:
      "Export flows as structured JSON for developers, SVG for vector graphics, or PNG for quick sharing.",
    icon: <FileJson className="h-6 w-6" />,
  },
  {
    title: "Save and Load Flows",
    description:
      "Save your work to local storage and load it later without needing a backend.",
    icon: <Save className="h-6 w-6" />,
  },
  {
    title: "UI Suggestions Panel",
    description:
      "Visual icons for quick component identification when a step in the flow is selected.",
    icon: <Lightbulb className="h-6 w-6" />,
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <motion.section
      ref={ref}
      className="py-20 px-4 relative z-10"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            Standout Features
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Designed specifically for UX designers to streamline their workflow
            and enhance productivity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <FeatureCard feature={feature} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: { title: string; description: string; icon: React.ReactElement };
  index: number;
}) {
  return (
    <Card className="border-transparent  from-gray-900 to-black py-6 overflow-hidden group hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-all duration-300">
      <CardHeader className="relative">
        <div className="h-8 w-8 relative">
          <div className="fill-transparent stroke-[url('#feature-icon-gradient')]">
            {feature.icon}
          </div>
          <svg width="0" height="0" className="absolute">
            <linearGradient
              id="feature-icon-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
          </svg>
        </div>
        <CardTitle className="text-white text-xl bg-clip-text relative z-10">
          {feature.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-gray-400 relative z-10">{feature.description}</p>
      </CardContent>
    </Card>
  );
}
