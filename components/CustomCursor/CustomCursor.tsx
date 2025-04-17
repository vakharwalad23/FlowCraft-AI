"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isOverFlow, setIsOverFlow] = useState(false);
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Check if we're on the landing page
  const isLandingPage = pathname === "/";
  const isDashboardPage = pathname === "/dashboard";

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    // Skip if not mounted yet (prevents SSR issues) or not on landing page
    if (
      !isMounted ||
      typeof window === "undefined" ||
      !cursorRef.current ||
      (!isLandingPage && !isDashboardPage)
    )
      return;

    const cursor = cursorRef.current;

    const updatePosition = (e: MouseEvent) => {
      if (cursor) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      }
      setIsVisible(true);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Check if mouse is over React Flow
    const checkIfOverFlow = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Only consider the actual flow canvas and nodes as React Flow, not the outer container
      const isReactFlow =
        target.closest(".react-flow__pane") !== null ||
        target.closest(".react-flow__node") !== null ||
        target.closest(".react-flow__edge") !== null ||
        target.closest(".react-flow__handle") !== null;

      setIsOverFlow(isReactFlow);
    };

    document.addEventListener("mousemove", updatePosition);
    document.addEventListener("mousemove", checkIfOverFlow);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Apply global cursor style only on landing page and dashboard
    const styleElement = document.createElement("style");

    if (isDashboardPage) {
      // More aggressive style for dashboard to override all default cursors
      styleElement.innerHTML = `
        /* Hide default cursor globally */
        body, 
        button, 
        a, 
        input, 
        select, 
        textarea,
        [role="button"],
        .cursor-pointer,
        *[class*="cursor-"] {
          cursor: none !important;
        }
        
        /* Override any inline styles */
        *[style*="cursor"] {
          cursor: none !important;
        }
      `;
    } else if (!isMobile) {
      // Regular style for landing page (only on non-mobile)
      styleElement.innerHTML = `
        /* Hide default cursor globally */
        body {
          cursor: none !important;
        }
        
        /* Specific override for React Flow interactive elements */
        .react-flow__pane,
        .react-flow__node,
        .react-flow__edge,
        .react-flow__handle {
          cursor: auto !important;
        }
        
        /* Specific cursor styles for React Flow elements */
        .react-flow__handle {
          cursor: crosshair !important;
        }
        
        .react-flow__pane {
          cursor: grab !important;
        }
        
        .react-flow__pane.react-flow__pane-dragging {
          cursor: grabbing !important;
        }
        
        /* Preserving native cursor for Panel buttons inside React Flow */
        .react-flow__panel-top-right button,
        .react-flow__panel button,
        .react-flow__controls button {
          cursor: pointer !important;
        }
      `;
    }

    document.head.appendChild(styleElement);

    return () => {
      document.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mousemove", checkIfOverFlow);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, [isMounted, pathname, isLandingPage, isDashboardPage]);

  // Don't render anything if not on landing page, not mounted, or on mobile
  if (!isMounted || (!isLandingPage && !isDashboardPage) || isMobile) {
    return null;
  }

  // Only hide the custom cursor when over the interactive parts of React Flow
  if (isOverFlow && !isDashboardPage) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className={`fixed pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ${
        isClicking ? "scale-90" : "scale-100"
      }`}
      style={{
        left: "-100px",
        top: "-100px",
        willChange: "transform, left, top",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.2s ease, transform 0.1s ease",
      }}
    >
      <Image
        src="/cursor.svg"
        alt="Custom Cursor"
        width={32}
        height={32}
        className="w-8 h-8"
      />
    </div>
  );
}
