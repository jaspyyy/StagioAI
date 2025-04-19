import React from 'react';
import Link from 'next/link';

const GALLERY_ITEMS = [
  {
    title: 'Living Room',
    description: 'Transform empty spaces into inviting, stylish living areas.',
    beforeImage: '/placeholder-before.jpg', // Replace with actual image paths
    afterImage: '/placeholder-after.jpg',
  },
  {
    title: 'Bedroom',
    description: 'Create cozy and appealing bedroom spaces that showcase comfort.',
    beforeImage: '/placeholder-before.jpg',
    afterImage: '/placeholder-after.jpg',
  },
  {
    title: 'Kitchen',
    description: 'Highlight the heart of the home with modern appliances and decor.',
    beforeImage: '/placeholder-before.jpg',
    afterImage: '/placeholder-after.jpg',
  },
  {
    title: 'Home Office',
    description: 'Stage functional and inspiring spaces for remote workers.',
    beforeImage: '/placeholder-before.jpg',
    afterImage: '/placeholder-after.jpg',
  },
];

export function BeforeAfterGallery() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-[32px]">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium mb-4 text-white">
            See the Difference: Before & After
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Experience the transformative power of our AI-powered virtual staging
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {GALLERY_ITEMS.map((item, index) => (
            <div key={index} className="flex flex-col">
              <div className="text-center h-[100px] flex flex-col items-center justify-center mb-6">
                <h3 className="text-2xl font-medium text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 max-w-md mx-auto text-base">{item.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[4/3] bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-400">Before {item.title}</span>
                  </div>
                </div>
                <div className="relative aspect-[4/3] bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-400">After {item.title}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link 
            href="/playground" 
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-black bg-yellow-500 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Try Virtual Staging Now
          </Link>
        </div>
      </div>
    </section>
  );
} 