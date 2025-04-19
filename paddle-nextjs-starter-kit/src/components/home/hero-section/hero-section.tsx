import { Wand2, Palette, Sofa, Zap } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className={'mx-auto max-w-7xl px-[32px] relative flex flex-col md:flex-row items-center justify-between py-16 gap-12 md:gap-0'}>
      {/* Left side - Text content */}
      <div className={'w-full md:w-1/2 md:pr-8'}>
        <h1 className={'text-[36px] leading-[40px] md:text-[56px] md:leading-[60px] tracking-[-1.6px] font-medium'}>
          Transform Your Real Estate Business
        </h1>
        <p className={'mt-4 text-[18px] md:text-[20px] leading-[28px] md:leading-[30px] text-gray-600'}>
          Elevate your listings with AI-powered virtual staging.
        </p>
        
        <div className="mt-8">
          <Link 
            href="/playground"
            className="bg-yellow-500 text-black px-8 py-3 rounded-lg text-lg font-medium hover:bg-yellow-400 transition-colors inline-block"
          >
            Start Now
          </Link>
          <p className="mt-3 text-sm text-gray-500">
            Try now for free. No credit card required!
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <Wand2 className="w-6 h-6 text-yellow-500" />
            <h3 className="font-medium text-lg">AI-powered staging</h3>
          </div>
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 text-yellow-500" />
            <h3 className="font-medium text-lg">Multiple design styles</h3>
          </div>
          <div className="flex items-center gap-3">
            <Sofa className="w-6 h-6 text-yellow-500" />
            <h3 className="font-medium text-lg">Realistic furniture</h3>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-yellow-500" />
            <h3 className="font-medium text-lg">Instant results</h3>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className={'w-full md:w-1/2'}>
        <div className="bg-gray-100 rounded-lg p-4 aspect-[4/3] flex items-center justify-center">
          <p className="text-gray-500">Before/After Image Placeholder</p>
        </div>
      </div>
    </section>
  );
}
