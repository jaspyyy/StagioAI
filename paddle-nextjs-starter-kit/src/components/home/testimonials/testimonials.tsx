import React from 'react';
import { Quote } from 'lucide-react';

export function Testimonials() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-[32px] py-24">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium mb-4 text-white">
            What Our Clients Say About Virtual Staging
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Hear from our satisfied clients about how AI-powered virtual staging has transformed their business
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
                <h3 className="font-medium text-white">Michael Reynolds</h3>
                <p className="text-gray-400 text-sm">Real Estate Agent</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed pl-8">
              "Since implementing AI virtual staging, I get my staged images in minutes instead of days. Traditional virtual stagers used to make me wait 24-48 hours, which delayed my listings. Now I can list properties the same day I photograph them."
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
                <h3 className="font-medium text-white">James Wilson</h3>
                <p className="text-gray-400 text-sm">Real Estate Photographer</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed pl-8">
              "As a photographer, I now offer AI virtual staging as a premium add-on service. My clients love the instant results, and it's become my most profitable upsell. I can show them different style options right on the spot, leading to higher satisfaction and more referrals."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 