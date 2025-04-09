"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

type ParticleProps = {
  index: number
}

type ParticleBackgroundProps = {
  mousePosition: { x: number; y: number }
}

const Particle = ({ index }: ParticleProps) => {
  const size = Math.random() * 2 + 1
  const speed = Math.random() * 1 + 0.5
  const initialX = Math.random() * 100
  const initialY = Math.random() * 100
  const delay = Math.random() * 5

  return (
    <motion.div
      className="absolute rounded-full bg-purple-500/10"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top: `${initialY}%`,
        left: `${initialX}%`,
      }}
      animate={{
        y: [0, -100, 0],
        opacity: [0, 0.5, 0],
      }}
      transition={{
        duration: 10 / speed,
        repeat: Number.POSITIVE_INFINITY,
        delay: delay,
      }}
    />
  )
}

export function ParticleBackground({ mousePosition }: ParticleBackgroundProps) {
  const [particles, setParticles] = useState<React.ReactNode[]>([])

  useEffect(() => {
    // Generate particles only on client-side
    setParticles(Array.from({ length: 50 }, (_, i) => <Particle key={i} index={i} />))
  }, [])

  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        {particles}
        <div
          className="absolute rounded-full bg-purple-800/10 blur-3xl"
          style={{
            width: "40vw",
            height: "40vw",
            top: `${mousePosition.y / 10}px`,
            left: `${mousePosition.x / 10}px`,
            transform: "translate(-50%, -50%)",
            transition: "all 1s cubic-bezier(0.075, 0.82, 0.165, 1)",
          }}
        />
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-cyan-500/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-purple-500/10 blur-3xl rounded-full" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]"
        style={{ opacity: 0.4 }}
      />
    </>
  )
}
