
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";

import { CTASection } from "@/components/sections/CtaSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { HeroSection } from "@/components/sections/HeroSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />

      <CTASection />
      <FooterSection />
    </main>
  );
}
