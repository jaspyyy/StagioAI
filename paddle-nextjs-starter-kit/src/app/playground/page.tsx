import React from 'react';
import { PricingBackground } from "@/components/gradients/pricing-page-background";

const ROOM_TYPES = [
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'home-office', label: 'Home Office' },
  { value: 'dining-room', label: 'Dining Room' },
  { value: 'kids-room', label: 'Kids Room' },
  { value: 'outdoor', label: 'Outdoor' },
];

const FURNITURE_STYLES = [
  { value: 'standard', label: 'Standard' },
  { value: 'modern', label: 'Modern' },
  { value: 'scandinavian', label: 'Scandinavian' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'midcentury', label: 'Midcentury' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'coastal', label: 'Coastal' },
  { value: 'farmhouse', label: 'Farm House' },
];

export default function PlaygroundPage() {
  return (
    <div className="relative min-h-screen">
      <PricingBackground />
      
      <div className="relative z-10 mx-auto max-w-7xl px-[32px] py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-medium mb-4 text-white">
            Virtual Staging Playground
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Test our AI-powered virtual staging technology. Upload a room photo and see the transformation in seconds
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Side - Controls */}
          <div className="space-y-8">
            {/* Options */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
              {/* Furniture Options */}
              <div className="space-y-6 mb-8">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    id="remove-furniture"
                    className="w-4 h-4 bg-gray-900 border-gray-700 rounded"
                  />
                  <label htmlFor="remove-furniture" className="text-white">
                    Remove existing furniture
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    id="add-furniture"
                    className="w-4 h-4 bg-gray-900 border-gray-700 rounded"
                    defaultChecked
                  />
                  <label htmlFor="add-furniture" className="text-white">
                    Add furniture
                  </label>
                </div>
              </div>

              {/* Room Type */}
              <div className="mb-6">
                <label className="block text-white mb-2">Room type</label>
                <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white">
                  {ROOM_TYPES.map((type) => (
                    <option key={type.value} value={type.value} className="py-2">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Furniture Style */}
              <div className="mb-8">
                <label className="block text-white mb-2">Furniture style</label>
                <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white">
                  {FURNITURE_STYLES.map((style) => (
                    <option key={style.value} value={style.value} className="py-2">
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Process Button */}
              <button className="w-full bg-yellow-500 text-black font-medium py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors">
                Process photo
              </button>
            </div>
          </div>

          {/* Right Side - Upload Area */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 border-dashed rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-white text-lg mb-2">Upload an image or drag and drop</p>
                <p className="text-gray-400">or use an example image</p>
              </div>
              <button className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                Choose file
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 