import React from "react";
import { motion } from "framer-motion";


interface DesignerLoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
}

export const DesignerLoader = ({
  size = "md"
}: DesignerLoaderProps) => {
  const getSize = () => {
    switch (size) {
      case "sm":
        return {
          container: "h-8 w-8",
          dot: "h-1.5 w-1.5",
          text: "text-xs",
          gap: "gap-3"
        };
      case "lg":
        return {
          container: "h-16 w-16",
          dot: "h-3 w-3",
          text: "text-lg",
          gap: "gap-5"
        };
      case "xl":
        return {
          container: "h-24 w-24",
          dot: "h-4 w-4",
          text: "text-xl",
          gap: "gap-6"
        };
      default:
        return {
          container: "h-12 w-12",
          dot: "h-2.5 w-2.5",
          text: "text-base",
          gap: "gap-4"
        };
    }
  };

  const sizeClasses = getSize();

  // Design elements animation variants
  const containerVariants = {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const dotVariants = {
    animate: (i: number) => ({
      scale: [1, 1.5, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        delay: i * 0.2,
        ease: "easeInOut"
      }
    })
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          duration: 1.5,
          delay: i * 0.2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        },
        opacity: {
          duration: 0.5,
          delay: i * 0.2,
          ease: "easeInOut"
        }
      }
    })
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="relative">
        {/* Rotating container */}
        <motion.div
          className={`relative ${sizeClasses.container} `}
          variants={containerVariants}
          animate="animate"
        >
          {/* Design elements */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
          >
            {/* Ruler line */}
            <motion.path
              d="M20,20 L80,20"
              stroke="rgba(168, 85, 247, 0.9)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
              custom={0}
            />

            {/* Pencil */}
            <motion.path
              d="M30,50 L70,50 L75,45 L70,40 L30,40 Z"
              stroke="rgba(168, 85, 247, 0.9)"
              strokeWidth="2"
              fill="none"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
              custom={1}
            />

            {/* Color palette */}
            <motion.circle
              cx="30"
              cy="70"
              r="10"
              stroke="rgba(168, 85, 247, 0.9)"
              strokeWidth="2"
              fill="none"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
              custom={2}
            />
            <motion.circle
              cx="50"
              cy="70"
              r="10"
              stroke="rgba(168, 85, 247, 0.9)"
              strokeWidth="2"
              fill="none"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
              custom={3}
            />
            <motion.circle
              cx="70"
              cy="70"
              r="10"
              stroke="rgba(168, 85, 247, 0.9)"
              strokeWidth="2"
              fill="none"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
              custom={4}
            />
          </svg>

          {/* Dots overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex space-x-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className={`${sizeClasses.dot} rounded-full bg-purple-600`}
                  variants={dotVariants}
                  animate="animate"
                  custom={i}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Glowing backdrop effect */}
        <div className="absolute inset-0 -z-10 blur-xl opacity-40 bg-gradient-to-r from-purple-600/30 to-purple-800/30 rounded-full" />
      </div>
    </div>
  );
};
