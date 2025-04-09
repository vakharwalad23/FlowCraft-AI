"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileJson, Lightbulb, Mic, Sparkles, Save } from "lucide-react";

function FeatureCard({
  feature,
  index,
}: {
  feature: { title: string; description: string; icon: React.ReactElement };
  index: number;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / 20;
    const y = (clientY - (rect.top + rect.height / 2)) / 20;
    setMousePosition({ x, y });
  };

  return (
    <Card
      className="from-gray-900 to-black py-6 overflow-hidden group hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-all duration-300 bg-transparent border-2 border-gray-900 opacity-70"
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1, 1, 1)`
          : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
        transition: "transform 0.1s ease-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
    >
      {/* Lighter background overlay that appears on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovering ? 0.05 : 0,
          backgroundImage:
            "radial-gradient(88% 100% at top, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0))",
        }}
      />

      {/* Inner content wrapper with counter-movement */}
      <div
        className="relative w-full h-full"
        style={{
          transform: isHovering
            ? `translate3d(${-mousePosition.x}px, ${-mousePosition.y}px, 0) scale3d(1.03, 1.03, 1)`
            : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
          transition: "transform 0.1s ease-out",
        }}
      >
        <CardHeader className="relative">
          <div className="h-8 w-8 relative">
            <div className="fill-transparent text-white/80 stroke-[url('#feature-icon-gradient')]">
              {feature.icon}
            </div>
            <svg width="0" height="0" className="absolute">
              <linearGradient
                id="feature-icon-gradient"
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
          <CardTitle className="text-left text-white px-2 text-xl bg-clip-text relative z-10">
            {feature.title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-gray-400 relative z-10 text-left">
            {feature.description}
          </p>
        </CardContent>
      </div>
    </Card>
  );
}

export function FeaturesSection() {
  const features = [
    {
      title: "Voice Input for Project Briefs",
      description:
        "Speak your project brief instead of typing, making input faster and more accessible.",
      icon: <Mic className="h-6 w-6" />,
    },
    {
      title: "AI-Powered Suggestions",
      description:
        "Get real-time AI suggestions for improvements or alternative steps as you modify the flow.",
      icon: <Sparkles className="h-6 w-6" />,
    },
    {
      title: "Multiple Export Options",
      description:
        "Export flows as structured JSON for developers, SVG for vector graphics, or PNG for quick sharing.",
      icon: <FileJson className="h-6 w-6" />,
    },
    {
      title: "Save and Load Flows",
      description:
        "Save your work to local storage and load it later without needing a backend.",
      icon: <Save className="h-6 w-6" />,
    },
    {
      title: "UI Suggestions Panel",
      description:
        "Visual icons for quick component identification when a step in the flow is selected.",
      icon: <Lightbulb className="h-6 w-6" />,
    },
  ];

  return (
    <section className="py-12 bg-black">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-semibold text-white mb-8">
          Our Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
