"use client";

import React from "react";
import {
  ArrowRight,
  DraftingCompass,
  Paintbrush,
  PenTool,
  Lightbulb,
  SparklesIcon,
  SplinePointer,
  Pencil,
  MonitorSmartphone,
  PencilRuler,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <motion.section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="opacity-70 z-10">
        <FloatingObject
          icon={
            <PenTool className="h-8 w-8 md:h-10 md:w-10 text-gray-700 transition-all duration-300 hover:scale-125 hover:text-purple-400 hover:rotate-12" />
          }
          positionClass="top-20 left-10 md:top-1/4 md:left-1/8"
          delay={0}
        />
        <FloatingObject
          icon={
            <Paintbrush className="h-8 w-8 md:h-10 md:w-10 text-gray-700 transition-all duration-300 hover:scale-125 hover:text-pink-400 hover:-rotate-12" />
          }
          positionClass="bottom-20 right-10 md:top-7/8 md:right-1/3"
          delay={0.2}
        />
        <FloatingObject
          icon={
            <DraftingCompass className="h-8 w-8 md:h-10 md:w-10 text-gray-700 transition-all duration-300 hover:scale-125 hover:text-indigo-400 hover:rotate-45" />
          }
          positionClass="top-40 right-8 md:top-1/3 md:right-1/4"
          delay={0.4}
        />
        <FloatingObject
          icon={
            <SplinePointer className="h-8 w-8 md:h-10 md:w-10 text-gray-700 transition-all duration-300 hover:scale-125 hover:text-blue-400 hover:-rotate-45" />
          }
          positionClass="hidden sm:block sm:bottom-40 sm:left-8 md:bottom-6/8 md:left-1/3"
          delay={0.5}
        />
        <FloatingObject
          icon={
            <MonitorSmartphone className="h-8 w-8 md:h-10 md:w-10 text-gray-700 transition-all duration-300 hover:scale-125 hover:text-green-400 hover:rotate-60" />
          }
          positionClass="bottom-10 right-30 md:bottom-1/8 md:left-1/4"
          delay={0.6}
        />
        <FloatingObject
          icon={
            <Lightbulb className="h-8 w-8 md:h-10 md:w-10 text-gray-700 transition-all duration-300 hover:scale-125 hover:text-yellow-400 hover:rotate-60" />
          }
          positionClass="bottom-30 left-8 md:top-2/3 md:left-20"
          delay={0.7}
        />
        <FloatingObject
          icon={
            <PencilRuler className="h-8 w-8 md:h-10 md:w-10 text-gray-700 transition-all duration-300 hover:scale-125 hover:text-cyan-400 hover:rotate-60" />
          }
          positionClass="hidden sm:block sm:bottom-20 sm:right-20 md:bottom-40 md:right-40"
          delay={0.8}
        />
        <FloatingObject
          icon={
            <Pencil className="h-8 w-8 md:h-10 md:w-10 text-gray-700 transition-all duration-300 hover:scale-125 hover:text-cyan-400 hover:rotate-60" />
          }
          positionClass="top-10 right-10 md:top-20 md:right-50"
          delay={0.9}
        />
      </div>

      {/* Content */}
      <div className="relative text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <SparklesIcon className="h-6 w-6 text-purple-400" />
          <p className="text-sm md:text-base text-gray-400 uppercase tracking-widest">
            Introducing
          </p>
          <SparklesIcon className="h-6 w-6 text-purple-400" />
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 [text-shadow:0_0_25px_rgba(168,85,247,0.4),0_0_30px_rgba(236,72,153,0.2)]">
            FlowCraft AI
          </h1>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-light"
        >
          Transform your <GlowingText>UX design</GlowingText> process with
          <GlowingText> AI-powered</GlowingText> user flows and component
          suggestions.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 [text-shadow:0_0_5px_rgba(255,255,255,0.6)] transition-all duration-300 transform hover:scale-105"
          >
            Get Started{" "}
            <motion.span
              animate={{
                x: [0, 5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            >
              <ArrowRight className="ml-2 h-4 w-4" />
            </motion.span>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-purple-500/30 bg-accent-foreground hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
          >
            Learn More
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}

function FloatingObject({
  icon,
  positionClass,
  delay = 0,
}: {
  icon: React.ReactElement;
  positionClass: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute ${positionClass} h-16 w-16 md:h-20 md:w-20`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay }}
    >
      <motion.div
        className="relative flex items-center justify-center w-full h-full"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: Math.random() * 2,
        }}
      >
        <div className="absolute   rounded-full blur-xl"></div>
        <div className="relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16  backdrop-blur-md borde rounded-2xl shadow-xl transform rotate-12">
          <div className="h-6 w-6 md:h-8 md:w-8 text-transparent stroke-[url('#icon-gradient')]">
            {icon}
          </div>
          <svg width="0" height="0" className="absolute">
            <linearGradient
              id="icon-gradient"
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
    </motion.div>
  );
}

function GlowingText({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500 [text-shadow:0_0_8px_rgba(250,204,21,0.4)]">
      {children}
    </span>
  );
}
