import { Mic, Sparkles, Code, ImageIcon } from "lucide-react";
import React from "react";

const howItWorks = [
  {
    title: "Input Your Brief",
    description: "Type or speak your project brief to get started.",
    icon: <Mic className="h-10 w-10" />,
    color: "from-purple-400 to-blue-500",
  },
  {
    title: "Generate Flow",
    description:
      "AI processes your brief to create a 4-6 step user flow with UI component suggestions.",
    icon: <Sparkles className="h-10 w-10" />,
    color: "from-pink-400 to-purple-500",
  },
  {
    title: "Edit and Refine",
    description:
      "Drag and drop nodes, add or remove steps, and connect nodes to refine your flow.",
    icon: <Code className="h-10 w-10" />,
    color: "from-indigo-400 to-blue-500",
  },
  {
    title: "Export Your Work",
    description:
      "Export your flow as JSON, SVG, or PNG to integrate into your design workflow.",
    icon: <ImageIcon className="h-10 w-10" />,
    color: "from-blue-400 to-indigo-500",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl text-white font-bold mb-4 text-center">
          How It Works
        </h2>
        <p className="text-xl text-gray-400 mb-12 text-center max-w-3xl mx-auto">
          A simple, intuitive process from brief to finished user flow.
        </p>
      
        <div className="max-w-2xl mx-auto space-y-16">
          {howItWorks.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 shadow-lg">
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500">
                    {React.cloneElement(step.icon, {
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
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
