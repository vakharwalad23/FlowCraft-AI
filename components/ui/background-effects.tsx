"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const particleCount = 100;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    let animationFrameId: number;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.forEach((particle) => {
        particle.resetPosition(canvas.width, canvas.height);
      });
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-30"
      />

      {/* Gradient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-500/20 to-transparent blur-[100px]"
          animate={{
            x: ["-20%", "10%", "-15%"],
            y: ["-20%", "15%", "-10%"],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-pink-500/20 to-transparent blur-[100px]"
          animate={{
            x: ["10%", "-15%", "5%"],
            y: ["5%", "-15%", "10%"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-0 left-1/3 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-indigo-500/20 to-transparent blur-[100px]"
          animate={{
            x: ["-10%", "15%", "-5%"],
            y: ["10%", "-10%", "15%"],
          }}
          transition={{
            duration: 30,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      </div>
    </>
  );
}

class Particle {
  x: number | undefined;
  y: number | undefined;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.resetPosition(canvasWidth, canvasHeight);
    this.size = Math.random() * 3 + 0.5;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;

    // Purple, pink, indigo palette
    const colors = ["#C084FC", "#EC4899", "#818CF8"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.5 + 0.1;
  }

  resetPosition(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
  }
  update() {
    if (this.x !== undefined && this.y !== undefined) {
      this.x += this.speedX;
      this.y += this.speedY;
    }

    // Slowly change opacity for twinkling effect
    this.opacity += Math.random() * 0.01 - 0.005;
    if (this.opacity < 0.1) this.opacity = 0.1;
    if (this.opacity > 0.6) this.opacity = 0.6;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.x !== undefined && this.y !== undefined) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle =
        this.color +
        Math.floor(this.opacity * 255)
          .toString(16)
          .padStart(2, "0");
      ctx.fill();
    }
  }
}
