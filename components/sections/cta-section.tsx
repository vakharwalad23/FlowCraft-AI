import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500">
          Ready to Transform Your UX Design Process?
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
          Join the growing community of designers using FlowCraft AI to
          streamline their workflow.
        </p>
        <Button
          size="lg"
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white font-medium px-8 py-6 rounded-md shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-purple-900/10 pointer-events-none"></div>
    </section>
  );
} 