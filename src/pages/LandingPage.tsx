import React from 'react';
import { Header, Footer } from '@/src/components/layout';
import { 
  HeroSection, 
  FeaturesSection, 
  FeaturedSimulatorsSection, 
  CurriculumSection, 
  PricingSection 
} from '@/src/features/landing';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <FeaturedSimulatorsSection />
        <CurriculumSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
