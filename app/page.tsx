import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { CtsSection } from "@/components/sections/CtsSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { BackgroundEffects } from "@/components/ui/background-effects";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-white relative overflow-hidden">
      <BackgroundEffects />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtsSection />
      <FooterSection />
    </main>
  );
}
