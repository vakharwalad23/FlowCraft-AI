
"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export function CtsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  return (
    <motion.section
      ref={ref}
      className="py-32 px-4 relative overflow-hidden z-10"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* 3D floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="absolute top-20 left-[10%] w-32 h-32 rounded-full border border-purple-500/20 backdrop-blur-sm bg-gradient-to-br from-purple-500/5 to-transparent"
        />

        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 2,
          }}
          className="absolute top-40 right-[15%] w-24 h-24 rounded-full border border-pink-500/20 backdrop-blur-sm bg-gradient-to-br from-pink-500/5 to-transparent"
        />

        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, -30, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
          className="absolute bottom-20 left-[30%] w-48 h-48 rounded-full border border-indigo-500/20 backdrop-blur-sm bg-gradient-to-br from-indigo-500/5 to-transparent"
        />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-950/30 backdrop-blur-sm border border-purple-500/20 mb-8"
        >
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-300">Revolutionize Your Design Workflow</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 drop-shadow-[0_0_25px_rgba(168,85,247,0.5)] tracking-tight"
        >
          Ready to Transform Your <br className="hidden md:block" />
          UX Design Process?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_0_10px_rgba(219,39,119,0.3)]"
        >
          Join the growing community of designers using FlowCraft AI to streamline their workflow and create stunning
          experiences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative inline-block group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition duration-200"></div>
          <Button
            size="lg"
            className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white font-medium px-10 py-7 rounded-md shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
          >
            Get Started Now <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </motion.section>
  )
}
