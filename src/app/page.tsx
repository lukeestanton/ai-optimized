import HeaderLegacy from '@/components/HeaderLegacy';
import HeroSection from '@/components/HeroSection';
import PilotTimelineSection from '@/components/PilotTimelineSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import AIWorkflowsSection from '@/components/AIWorkflowsSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';

// Maybe replace timeline with diff section
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeaderLegacy />
      <main>
        <HeroSection />
        <HowItWorksSection />
        {false && <PilotTimelineSection />}
        <AIWorkflowsSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}