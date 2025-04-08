import { Mic, Sparkles, FileJson, Save, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

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

export function FeaturesSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Standout Features
        </h2>
        <p className="text-xl text-gray-400 mb-12 text-center max-w-3xl mx-auto">
          Designed specifically for UX designers to streamline their workflow
          and enhance productivity.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className=" border-gray-800 bg-b ">
              <CardHeader>
                <div className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500">
                  {React.cloneElement(feature.icon, {
                    className:
                      "h-8 w-8 text-transparent fill-transparent stroke-[url('#icon-gradient')]",
                  })}
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
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
