import React from 'react';
import { Hero } from '@/components/home/Hero';
import { PortfolioPreview } from '@/components/home/PortfolioPreview';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { ProcessSection } from '@/components/home/ProcessSection';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Testimonials } from '@/components/home/Testimonials';
import { FinalCTA } from '@/components/home/FinalCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PortfolioPreview />
      <ServicesPreview />
      <ProcessSection />
      <WhyChooseUs />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
