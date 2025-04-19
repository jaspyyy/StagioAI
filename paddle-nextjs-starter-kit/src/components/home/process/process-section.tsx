import React from 'react';
import Link from 'next/link';
import { Upload, Wand2, Rocket } from 'lucide-react';

const PROCESS_STEPS = [
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
    icon: Rocket,
  },
];

export function ProcessSection() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-[32px]">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium mb-4 text-white">
            Transform Your Listings in Seconds
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Experience lightning-fast, cost-effective AI virtual staging
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {PROCESS_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.number}
                className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-yellow-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium text-white mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link 
            href="/signup" 
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-black bg-yellow-500 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Try Now!
          </Link>
        </div>
      </div>
    </section>
  );
} 