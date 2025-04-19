import React from 'react';
import Link from 'next/link';
import { Upload, Wand2, Trophy } from 'lucide-react';

const STEPS = [
  {
    number: 1,
    title: 'Upload Your Photo',
    description: 'Simply upload your property photos',
    icon: Upload,
  },
  {
    number: 2,
    title: 'AI Magic in Seconds',
    description: 'Our AI transforms your space instantly',
    icon: Wand2,
  },
  {
    number: 3,
    title: 'Stand Out & Sell Fast',
    description: 'Impress clients with stunning visuals',
    icon: Trophy,
  },
];

export function TransformSection() {
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-[32px]">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-medium mb-4 text-white">
            StagioAI Revolutionizes Real Estate
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto">
            Experience lightning-fast, cost-effective AI virtual staging
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 md:p-8 text-center"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 md:w-20 h-16 md:h-20 bg-yellow-500/20 border-2 border-yellow-500 rounded-full flex items-center justify-center mb-4 md:mb-6 relative">
                    <span className="absolute -top-3 -left-3 bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center font-medium">
                      {step.number}
                    </span>
                    <Icon className="w-8 md:w-10 h-8 md:h-10 text-yellow-500" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg md:text-xl font-medium text-white mb-2 md:mb-4">{step.title}</h3>
                  <p className="text-sm md:text-base text-gray-400">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link 
            href="/playground" 
            className="inline-flex items-center justify-center px-8 md:px-12 py-3 md:py-4 text-base md:text-xl font-medium text-black bg-yellow-500 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Try Now!
          </Link>
        </div>
      </div>
    </section>
  );
} 