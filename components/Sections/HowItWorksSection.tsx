"use client";

import React from "react";

import { Mic, Sparkles, Code, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

interface Step {
  title: string;
  description: string;
  icon: React.ReactElement;
  color: string;
}

const howItWorks: Step[] = [
  {
    title: "Input Your Brief",
    description: "Type or speak your project brief to get started.",
    icon: <Mic className="h-10 w-10" />,
    color: "from-purple-400 to-blue-500",
  },
  {
    title: "Generate Flow",
    description:
      "AI processes your brief to create a 4-6 step user flow with UI component suggestions.",
    icon: <Sparkles className="h-10 w-10" />,
    color: "from-pink-400 to-purple-500",
  },
  {
    title: "Edit and Refine",
    description:
      "Drag and drop nodes, add or remove steps, and connect nodes to refine your flow.",
    icon: <Code className="h-10 w-10" />,
    color: "from-indigo-400 to-blue-500",
  },
  {
    title: "Export Your Work",
    description:
      "Export your flow as JSON, SVG, or PNG to integrate into your design workflow.",
    icon: <ImageIcon className="h-10 w-10" />,
    color: "from-blue-400 to-indigo-500",
  },
];

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <motion.section
      ref={ref}
      id="how-it-works"
      className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 relative z-10"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2
            className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400"
          >
            How It Works
          </h2>
          <p
            className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-2"
          >
            A simple, intuitive process from brief to finished user flow.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {howItWorks.map((step, index) => (
            <motion.div
              key={index}
              className="mb-12 sm:mb-16 md:mb-20 last:mb-0"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={
                isInView
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }
              }
              transition={{ duration: 0.6, delay: 0.15 * index }}
            >
              <WorkflowStep step={step} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function WorkflowStep({ step, index }: { step: Step; index: number }) {
  return (
    <div className="relative flex items-start gap-3 sm:gap-4 md:gap-6">
      {/* Connection line */}
      {index < howItWorks.length - 1 && (
        <div className="absolute left-6 sm:left-7 md:left-8 top-16 sm:top-18 md:top-20 w-0.5 h-[calc(100%+3rem)] sm:h-[calc(100%+4rem)] md:h-[calc(100%+5rem)] bg-gradient-to-b from-purple-500/50 to-transparent"></div>
      )}

      <motion.div
        className="relative flex items-center justify-center shrink-0"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-full blur-xl"></div>
        <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black/50 backdrop-blur-md border border-zinc-700/90 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          <div className="flex items-center justify-center h-5 w-5 ">
            <div className="fill-transparent stroke-[url('#workflow-icon-gradient')]">
              {step.icon}
            </div>
          </div>
          <svg width="0" height="0" className="absolute">
            <linearGradient
              id="workflow-icon-gradient"
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
      </motion.div>

      <div className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">
            {index + 1}. {step.title}
          </h3>
          <p className="text-gray-400 text-base sm:text-lg">{step.description}</p>
        </motion.div>
      </div>
    </div>
  );
}
