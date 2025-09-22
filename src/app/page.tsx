import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import PilotTimelineSection from '@/components/PilotTimelineSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import AIWorkflowsSection from '@/components/AIWorkflowsSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <PilotTimelineSection />
        <AIWorkflowsSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}