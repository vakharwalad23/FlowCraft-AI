'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

 
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    // Skip if not mounted yet (prevents SSR issues)
    if (!isMounted || typeof window === 'undefined' || !cursorRef.current) return;

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

    // Function to handle mouse up
    const handleMouseUp = () => {
      setIsClicking(false);
    };

    // Function to handle mouse leave
    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Function to handle mouse enter
    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Add event listeners
    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Apply global cursor style
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      * {
        cursor: none !important;
      }
      
      a, button, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"]) {
        cursor: none !important;
      }
    `;
    document.head.appendChild(styleElement);

    // Clean up event listeners and styles on unmount
    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, [isMounted, pathname]);


  if (!isMounted) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className={`fixed pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ${isClicking ? 'scale-90' : 'scale-100'
        }`}
      style={{
        left: '-100px',
        top: '-100px',
        willChange: 'transform, left, top',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease, transform 0.1s ease'
      }}
    >
      <img
        src="/cursor.svg"
        alt="Custom Cursor"
        width={32}
        height={32}
        className="w-8 h-8"
      />
    </div>
  );
}
