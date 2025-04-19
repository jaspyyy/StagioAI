import React from 'react';
import { FileText, Shield, RefreshCw, Cookie } from 'lucide-react';
import Link from 'next/link';
import { PricingBackground } from "@/components/gradients/pricing-page-background";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

const LEGAL_PAGES = [
  { 
    label: 'Terms of Service', 
    href: '/terms-of-service',
    icon: FileText,
  },
  { 
    label: 'Privacy Policy', 
    href: '/privacy-policy',
    icon: Shield,
  },
  { 
    label: 'Refund Policy', 
    href: '/refund-policy',
    icon: RefreshCw,
  },
  { 
    label: 'Cookie Policy', 
    href: '/cookie-policy',
    icon: Cookie,
  },
];

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="relative min-h-screen">
      <PricingBackground />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        {/* Header - Centered */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-medium mb-4 text-white">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-gray-300">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(640px,_800px)_280px] gap-12 justify-center">
          {/* Main Content */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-8 border border-gray-800/40">
            <div className="prose prose-invert prose-gray max-w-none prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300">
              <div className="space-y-8">
                {children}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-xl bg-gray-900/50 p-6 backdrop-blur-sm border border-gray-800">
              <h2 className="text-lg font-medium text-white mb-4">Legal Documents</h2>
              <div className="space-y-3">
                {LEGAL_PAGES.map((page) => {
                  const Icon = page.icon;
                  const isActive = page.href.includes(title.toLowerCase().replace(/\s+/g, '-'));
                  return (
                    <Link
                      key={page.href}
                      href={page.href}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-yellow-500/10 text-yellow-500' 
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{page.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 