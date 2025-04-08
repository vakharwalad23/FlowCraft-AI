import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Sparkles, Layout, Palette, Mic } from "lucide-react";
import React from "react";

const techStack = [
  {
    title: "Next.js",
    description: "App Router for frontend and API routes",
    icon: <Code className="h-6 w-6" />,
    color: "from-blue-400 to-indigo-500"
  },
  {
    title: "Vercel AI SDK",
    description: "Powers AI-driven flow generation and suggestions",
    icon: <Sparkles className="h-6 w-6" />,
    color: "from-purple-400 to-pink-500"
  },
  {
    title: "React Flow",
    description: "Interactive, editable flow diagram",
    icon: <Layout className="h-6 w-6" />,
    color: "from-indigo-400 to-blue-500"
  },
  {
    title: "Shadcn UI & Tailwind CSS",
    description: "Modern, responsive design components",
    icon: <Palette className="h-6 w-6" />,
    color: "from-pink-400 to-purple-500"
  },
  {
    title: "Web Speech API",
    description: "Voice-to-text functionality",
    icon: <Mic className="h-6 w-6" />,
    color: "from-purple-400 to-indigo-500"
  },
];

export function TechStackSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Tech Stack
        </h2>
        <p className="text-xl text-gray-400 mb-12 text-center max-w-3xl mx-auto">
          Built with modern technologies for optimal performance and user
          experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techStack.map((tech, index) => (
            <Card 
              key={index} 
              className="bg-gray-900 border-gray-800"
            >
              <CardHeader>
                <div className="flex items-center mb-2">
                  <div className={`mr-3 bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}>
                    {React.cloneElement(tech.icon, { 
                      className: `h-6 w-6 text-transparent stroke-[url('#tech-gradient-${index}')]` 
                    })}
                    <svg width="0" height="0" className="absolute">
                      <linearGradient id={`tech-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={tech.color.includes("blue") ? "#60A5FA" : 
                                                    tech.color.includes("purple") ? "#A78BFA" : 
                                                    tech.color.includes("pink") ? "#F472B6" : "#818CF8"} />
                        <stop offset="100%" stopColor={tech.color.includes("to-indigo") ? "#818CF8" : 
                                                      tech.color.includes("to-blue") ? "#60A5FA" : 
                                                      tech.color.includes("to-purple") ? "#A78BFA" : "#F472B6"} />
                      </linearGradient>
                    </svg>
                  </div>
                  <CardTitle className="text-white">{tech.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{tech.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 