import React from 'react';
import Link from 'next/link';

const COMPARISON_DATA = {
  ai: [
    'Lightning-fast results',
    'Consistent high-quality images',
    'Cost-effective bulk staging',
    'Multiple style options',
    'Available 24/7',
    'Seamless workflow integration',
  ],
  manual: [
    'Time-consuming process',
    'Inconsistent quality',
    'Higher costs',
    'Limited style options',
    'Subject to availability',
    'More communication needed',
  ],
};

export function ComparisonSection() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-[32px]">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium mb-4 text-white">
            AI vs. Manual Virtual Staging: The Clear Winner
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Discover why AI-powered virtual staging is revolutionizing the real estate industry
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {/* AI Virtual Staging */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-medium text-white mb-4 flex items-center justify-center">
              <div className="w-8 h-8 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center mr-3">
                <span className="text-yellow-500">AI</span>
              </div>
              AI Virtual Staging
            </h3>
            <ul className="space-y-3">
              {COMPARISON_DATA.ai.map((feature, index) => (
                <li key={index} className="flex items-center justify-center gap-2 text-gray-300">
                  <span className="text-yellow-500 flex-shrink-0">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Manual Virtual Staging */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-medium text-white mb-4 flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-400">M</span>
              </div>
              Manual Virtual Staging
            </h3>
            <ul className="space-y-3">
              {COMPARISON_DATA.manual.map((feature, index) => (
                <li key={index} className="flex items-center justify-center gap-2 text-gray-400">
                  <span className="text-gray-500 flex-shrink-0">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link 
            href="/playground" 
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-black bg-yellow-500 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Experience AI Virtual Staging Now
          </Link>
        </div>
      </div>
    </section>
  );
} 