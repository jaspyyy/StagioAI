import React from 'react';
import { Quote } from 'lucide-react';

export function MoreTestimonials() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-[32px]">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium mb-4 text-white">
            More Success Stories
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Hear from more of our satisfied clients about how AI-powered virtual staging has transformed their business
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* First Testimonial */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 relative">
            <Quote className="absolute top-6 left-6 w-12 h-12 text-yellow-500" strokeWidth={1.5} />
            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center mb-3">
                {/* Placeholder for company logo */}
                <span className="text-yellow-500/70 text-xs">Logo</span>
              </div>
              <div className="text-center">
                <h3 className="font-medium text-white">Alex Johnson</h3>
                <p className="text-gray-400 text-sm">Professional Virtual Stager</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed pl-8">
              "Since implementing StagioAI, I've tripled my productivity. What used to take hours now takes minutes, allowing me to take on more projects while maintaining high-quality results."
            </p>
          </div>

          {/* Second Testimonial */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 relative">
            <Quote className="absolute top-6 left-6 w-12 h-12 text-yellow-500" strokeWidth={1.5} />
            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center mb-3">
                {/* Placeholder for company logo */}
                <span className="text-yellow-500/70 text-xs">Logo</span>
              </div>
              <div className="text-center">
                <h3 className="font-medium text-white">Michael Chang</h3>
                <p className="text-gray-400 text-sm">Architectural Visualizer</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed pl-8">
              "As someone who works with 3D renderings, I'm impressed by the quality and speed of AI virtual staging. It's become an invaluable tool in my workflow for quick concept presentations."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 