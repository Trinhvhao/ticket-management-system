'use client';

import { 
  Header, 
  HeroSection, 
  StatsSection, 
  CapabilitiesSection, 
  WorkflowSection, 
  FeaturesShowcase,
  AIFeaturesSection,
  EcosystemSection,
  TicketDemoSection,
  Footer 
} from '@/components/landing';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <StatsSection />
      <CapabilitiesSection />
      <WorkflowSection />
      <AIFeaturesSection />
      <TicketDemoSection />
      <FeaturesShowcase />
      <EcosystemSection />
      <Footer />
    </div>
  );
}
