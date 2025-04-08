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
      <div className="relative text-center max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-purple-500 opacity-70"></div>
          <p className="text-sm md:text-base text-gray-400 uppercase tracking-widest">
            Introducing
          </p>
          <div className="h-px w-16 md:w-24 bg-gradient-to-r from-purple-500 to-transparent opacity-70"></div>
        </div>

        <div className="relative mx-auto w-fit px-12 py-6">
          {/* Top left dot */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-purple-500 rounded-full"></div>

          <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-purple-500 rounded-full"></div>

          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-purple-500 rounded-full"></div>

          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-purple-500 rounded-full"></div>

          {/* Top border */}
          <div className="absolute top-0 left-4 right-4 h-px   bg-gray-700"></div>
          {/* Bottom border */}
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gray-700"></div>
          {/* Left border */}
          <div className="absolute left-0 top-4 bottom-4 w-px bg-gray-700"></div>
          {/* Right border */}
          <div className="absolute right-0 top-4 bottom-4 w-px bg-gray-700"></div>

          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 [text-shadow:0_0_25px_rgba(168,85,247,0.4),0_0_30px_rgba(236,72,153,0.2)]">
            FlowCraft AI
          </h1>
        </div>

        <div className="h-20 w-full"></div>
        <h2 className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto [text-shadow:0_0_10px_rgba(255,255,255,0.3)]">
          Transform your{" "}
          <span className="font-bold text-[#f5cb5c] opacity-60">
            {" "}
            UX design{" "}
          </span>{" "}
          process with
          <span className="text-[#f5cb5c] font-bold  opacity-60">
            {" "}
            AI-powered{" "}
          </span>{" "}
          user flows and component suggestions.
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 [text-shadow:0_0_5px_rgba(255,255,255,0.6)]"
          >
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="default"
            className="[text-shadow:0_0_5px_rgba(255,255,255,0.4)]"
          >
            Learn More
          </Button>
        </div>
      </div>
      <div className="opacity-70">
        <PenTool className="absolute top-20 left-10 md:top-1/4 md:left-1/8 h-8 w-8 md:h-10 md:w-10 text-gray-700 transition-all duration-300 hover:scale-125 hover:text-purple-400 hover:rotate-12" />
        <Paintbrush className="absolute bottom-20 right-10 md:top-7/8 md:right-1/3 h-8 w-8 md:h-10 md:w-10 text-gray-700 transition-all duration-300 hover:scale-125 hover:text-pink-400 hover:-rotate-12" />
        <DraftingCompass className="absolute top-40 right-8 md:top-1/3 md:right-1/4 h-8 w-8 md:h-10 md:w-10 text-gray-700 transition-all duration-300 hover:scale-125 hover:text-indigo-400 hover:rotate-45" />
        <SplinePointer className="hidden sm:block sm:absolute sm:bottom-40 sm:left-8 md:bottom-4/8 md:left-1/3 h-8 w-8 md:h-10 md:w-10 text-gray-700 transition-all duration-300 hover:scale-125 hover:text-blue-400 hover:-rotate-45" />
        <Pencil className="absolute top-10 right-20 md:top-20 md:right-1/3 h-8 w-8 md:h-10 md:w-10 text-gray-700 transition-all duration-300 hover:scale-125 hover:text-violet-400 hover:rotate-180" />
        <MonitorSmartphone className="absolute bottom-10 right-30 md:bottom-1/8  md:left-1/4 h-8 w-8 md:h-10 md:w-10 text-gray-700 transition-all duration-300 hover:scale-125 hover:text-green-400 hover:rotate-60" />
        <Lightbulb className="absolute bottom-30 left-8 md:top-2/3 md:left-20 h-8 w-8 md:h-10 md:w-10 text-gray-700 transition-all duration-300 hover:scale-125 hover:text-yellow-400 hover:rotate-60" />
        <PencilRuler className="hidden sm:block sm:absolute sm:bottom-20 sm:right-20 md:bottom-40 md:right-40 h-8 w-8 md:h-10 md:w-10 text-gray-700 transition-all duration-300 hover:scale-125 hover:text-cyan-400 hover:rotate-60" />
      </div>
    </section>
  );
}
