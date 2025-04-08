import Link from "next/link";
import {
  ArrowRight,
  DraftingCompass,
  Paintbrush,
  Pencil,
  PenTool,
  SplinePointer,
  MonitorSmartphone,
  Lightbulb,
  PencilRuler,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      <div className="relative  text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500">
          FlowCraft AI
        </h1>
        <div className="h-20 w-full"></div>
        <h2 className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Transform your UX design process with AI-powered user flows and
          component suggestions.
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="default">
            Learn More
          </Button>
        </div>
      </div>
      <PenTool className="absolute top-1/4 left-1/4 h-10 w-10  text-gray-700  transition-all duration-300 hover:scale-125 hover:text-purple-400 hover:rotate-12" />
      <Paintbrush className="absolute top-6/8 right-1/3 h-10 w-10 text-gray-700  transition-all duration-300 hover:scale-125 hover:text-pink-400 hover:-rotate-12" />
      <DraftingCompass className="absolute top-1/3 right-1/4 h-10 w-10 text-gray-700  transition-all duration-300 hover:scale-125 hover:text-red-400 hover:rotate-45" />
      <SplinePointer className="absolute bottom-1/3 left-1/3 h-10 w-10 text-gray-700  transition-all duration-300 hover:scale-125 hover:text-blue-400 hover:-rotate-45" />
      <Pencil className="absolute top-20 right-2/10 h-10 w-10 text-gray-700  transition-all duration-300 hover:scale-125 hover:text-emerald-500 hover:rotate-180" />
      <MonitorSmartphone className="absolute top-1/8 left-1/8 h-10 w-10 text-gray-700  transition-all duration-300 hover:scale-125 hover:text-green-400 hover:rotate-60" />
      <Lightbulb className="absolute top-2/3 left-20 h-10 w-10 text-gray-700  transition-all duration-300 hover:scale-125 hover:text-yellow-400 hover:rotate-60" />
      <PencilRuler className="absolute bottom-40 right-40 h-10 w-10 text-gray-700  transition-all duration-300 hover:scale-125 hover:text-cyan-400 hover:rotate-60" />
    </section>
  );
}
