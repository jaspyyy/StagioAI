'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUserInfo } from '@/hooks/useUserInfo';
import '../../styles/home-page.css';
import { HeroSection } from '@/components/home/hero-section/hero-section';
import { Testimonials } from '@/components/home/testimonials/testimonials';
import { BeforeAfterGallery } from '@/components/home/gallery/before-after-gallery';
import { ComparisonSection } from '@/components/home/comparison/comparison-section';
import { MoreTestimonials } from '@/components/home/testimonials/more-testimonials';
import { FAQSection } from '@/components/home/faq/faq-section';
import { FinalCTASection } from '@/components/home/cta/final-cta-section';
import { HomePageBackground } from '@/components/gradients/home-page-background';
import { TransformSection } from '@/components/home/transform/transform-section';

export function HomePage() {
  const supabase = createClient();
  const { user } = useUserInfo(supabase);
  const [country, setCountry] = useState('US');

  return (
    <>
      <div>
        <HomePageBackground />
        <HeroSection />
        <TransformSection />
        <Testimonials />
        <BeforeAfterGallery />
        <ComparisonSection />
        <MoreTestimonials />
        <FAQSection />
        <FinalCTASection />
      </div>
    </>
  );
}
