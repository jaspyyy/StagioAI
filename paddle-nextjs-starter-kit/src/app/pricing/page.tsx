'use client';

import { useState, useEffect } from 'react';
import { PricingBackground } from "@/components/gradients/pricing-page-background";
import { Toggle } from '@/components/shared/toggle/toggle';
import { PriceCards } from "@/components/home/pricing/price-cards";
import { BillingFrequency, IBillingFrequency } from '@/constants/billing-frequency';
import { Environments, initializePaddle, Paddle } from '@paddle/paddle-js';
import { usePaddlePrices } from '@/hooks/usePaddlePrices';
import { createClient } from '@/utils/supabase/client';
import { useUserInfo } from '@/hooks/useUserInfo';

export default function PricingPage() {
  const supabase = createClient();
  const { user } = useUserInfo(supabase);
  const [country, setCountry] = useState('US');
  const [frequency, setFrequency] = useState<IBillingFrequency>(BillingFrequency[0]);
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);

  const { prices, loading } = usePaddlePrices(paddle, country);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN && process.env.NEXT_PUBLIC_PADDLE_ENV) {
      initializePaddle({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
        environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
      }).then((paddle) => {
        if (paddle) {
          setPaddle(paddle);
        }
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen">
      <PricingBackground />
      
      <div className="relative z-10 px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include unlimited updates and basic support.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <Toggle frequency={frequency} setFrequency={setFrequency} />
          <PriceCards frequency={frequency} loading={loading} priceMap={prices} />
          
          {/* Contact Section */}
          <div className="text-center mt-12">
            <p className="text-gray-300">
              Need more photos? Contact{' '}
              <a 
                href="mailto:sales@stagioai.com" 
                className="text-white hover:text-gray-200 underline"
              >
                sales@stagioai.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 