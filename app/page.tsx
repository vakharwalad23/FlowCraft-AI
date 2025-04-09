import {FeaturesSection} from "@/components/Sections/FeaturesSection";
import { HowItWorksSection } from "@/components/Sections/HowItWorksSection";
import { CtsSection } from "@/components/Sections/CtsSection";
import { FooterSection } from "@/components/Sections/FooterSection";
import { HeroSection } from "@/components/Sections/HeroSection";
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
