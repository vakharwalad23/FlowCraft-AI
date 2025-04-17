"use client"

import { useEffect, useState } from "react"

export function CreativeBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Main gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-black to-zinc-900 opacity-80" />

      {/* Radial gradient accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.zinc.800/30),transparent_50%)]" />

      {/* Diagonal stripes */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,theme(colors.zinc.900/50)_25%,transparent_25%,transparent_50%,theme(colors.zinc.900/50)_50%,theme(colors.zinc.900/50)_75%,transparent_75%,transparent)] bg-[length:100px_100px] opacity-10" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(theme(colors.white/5)_1px,transparent_1px),linear-gradient(90deg,theme(colors.white/5)_1px,transparent_1px)] bg-[size:50px_50px] opacity-10" />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 rounded-full bg-white/5 blur-3xl opacity-20" />
      <div className="absolute bottom-1/3 right-1/3 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full bg-zinc-300/10 blur-3xl opacity-20" />

      {/* Gradient accent lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-700/90 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-700/90 to-transparent" />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)]" />
    </>
  )
}
