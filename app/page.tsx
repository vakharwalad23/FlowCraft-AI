import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { TechStackSection } from "@/components/sections/tech-stack-section";
import { CTASection } from "@/components/sections/cta-section";
import { FooterSection } from "@/components/sections/footer-section";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TechStackSection /> {/* // Remove later */}
      <CTASection />
      <FooterSection />
    </main>
  );
}
