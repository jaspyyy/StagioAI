import React from 'react';
import Link from 'next/link';
import { Zap, Palette, ImageIcon } from 'lucide-react';

const FEATURES = [
  {
    title: 'Instant Results',
    description: 'Get professionally staged images in seconds, not days. Our AI works tirelessly to deliver stunning results 24/7.',
    icon: Zap,
  },
  {
    title: 'Endless Possibilities',
    description: 'Choose from a wide range of styles and furniture options to create the perfect look for any property.',
    icon: Palette,
  },
  {
    title: 'Stunning Quality',
    description: 'Our AI produces high-resolution, photorealistic images that are indistinguishable from traditional staging photos.',
    icon: ImageIcon,
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-[32px]">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium mb-4 text-white">
            Transform Your Listings in Seconds
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Experience the power of AI-driven virtual staging and elevate your real estate game
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 text-center"
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-yellow-500/10 border-2 border-yellow-500/20 rounded-full flex items-center justify-center mb-6">
                    <Icon className="w-10 h-10 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
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
            Try For Free Now
          </Link>
          <p className="mt-3 text-sm text-gray-400">
            No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
} 