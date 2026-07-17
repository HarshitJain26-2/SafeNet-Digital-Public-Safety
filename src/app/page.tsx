import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/sections/hero";
import { PlatformCapabilities } from "@/components/sections/platform-capabilities";
import { ComparisonSection } from "@/components/sections/comparison";
import { IntelligenceEngine } from "@/components/sections/intelligence-engine";
import { MultiRoleImpact } from "@/components/sections/multi-role-impact";
import { ExpectedImpact } from "@/components/sections/expected-impact";
import { ArchitectureSection } from "@/components/sections/architecture";
import { FinalCTA } from "@/components/sections/final-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <PlatformCapabilities />
        <ComparisonSection />
        <IntelligenceEngine />
        <MultiRoleImpact />
        <ExpectedImpact />
        <ArchitectureSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
