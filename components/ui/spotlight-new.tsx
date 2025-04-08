"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type SpotlightProps = {
  gradientFirst?: string;
  gradientSecond?: string;
  gradientThird?: string;
  duration?: number;
};

export const Spotlight = ({
  gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)",
  gradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)",
  gradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)",
  duration = 7,
}: SpotlightProps = {}) => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isMediumScreen, setIsMediumScreen] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setIsMediumScreen(window.innerWidth >= 768); // 768px is the md breakpoint in Tailwind
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Don't render anything on small screens
  if (!isMediumScreen) return null;

  // Calculate responsive sizes
  const spotlightWidth = dimensions.width * 0.4;
  const spotlightHeight = dimensions.height * 1.2;
  const smallWidth = dimensions.width * 0.15;

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 1.5,
      }}
      className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
    >
      {/* Left spotlight */}
      <motion.div
        animate={{
          x: ["-20%", "10%", "-20%"],
          y: ["0%", "15%", "0%"],
        }}
        transition={{
          duration,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-1/2 h-full z-40 pointer-events-none"
      >
        <div
          style={{
            background: gradientFirst,
            width: `${spotlightWidth}px`,
            height: `${spotlightHeight}px`,
            position: "absolute",
            top: "-30%",
            left: "-10%",
            transform: "rotate(-45deg)",
          }}
        />

        <div
          style={{
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${spotlightHeight}px`,
            position: "absolute",
            top: "-20%",
            left: "10%",
            transform: "rotate(-45deg)",
          }}
        />

        <div
          style={{
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${spotlightHeight}px`,
            position: "absolute",
            top: "-10%",
            left: "20%",
            transform: "rotate(-45deg)",
          }}
        />
      </motion.div>

      {/* Right spotlight */}
      <motion.div
        animate={{
          x: ["20%", "-10%", "20%"],
          y: ["0%", "15%", "0%"],
        }}
        transition={{
          duration,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-0 right-0 w-1/2 h-full z-40 pointer-events-none"
      >
        <div
          style={{
            background: gradientFirst,
            width: `${spotlightWidth}px`,
            height: `${spotlightHeight}px`,
            position: "absolute",
            top: "-30%",
            right: "-10%",
            transform: "rotate(45deg)",
          }}
        />

        <div
          style={{
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${spotlightHeight}px`,
            position: "absolute",
            top: "-20%",
            right: "10%",
            transform: "rotate(45deg)",
          }}
        />

        <div
          style={{
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${spotlightHeight}px`,
            position: "absolute",
            top: "-10%",
            right: "10%",
            transform: "rotate(45deg)",
          }}
        />
      </motion.div>
    </motion.div>
  );
};
