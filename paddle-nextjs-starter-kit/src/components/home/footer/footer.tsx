import React from 'react';
import Link from 'next/link';
import { FileText, Shield, RefreshCw, Cookie, Home, PlayCircle, HelpCircle, DollarSign } from 'lucide-react';

const FOOTER_LINKS = {
  quickLinks: [
    { 
      label: 'Home', 
      href: '/',
      icon: Home,
      description: 'Return to homepage'
    },
    { 
      label: 'Playground', 
      href: '/playground',
      icon: PlayCircle,
      description: 'Try our AI staging demo'
    },
    { 
      label: 'FAQ', 
      href: '/#faq',
      icon: HelpCircle,
      description: 'Common questions answered'
    },
    { 
      label: 'Pricing', 
      href: '/pricing',
      icon: DollarSign,
      description: 'View our pricing plans'
    },
  ],
  legal: [
    { 
      label: 'Terms of Service', 
      href: '/terms-of-service',
      icon: FileText,
      description: 'Service usage terms and conditions'
    },
    { 
      label: 'Privacy Policy', 
      href: '/privacy-policy',
      icon: Shield,
      description: 'How we handle your data'
    },
    { 
      label: 'Refund Policy', 
      href: '/refund-policy',
      icon: RefreshCw,
      description: 'Our money-back guarantee terms'
    },
    { 
      label: 'Cookie Policy', 
      href: '/cookie-policy',
      icon: Cookie,
      description: 'How we use cookies'
    },
  ],
};

export function Footer() {
  return (
    <footer className="relative py-12 md:py-16 border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-[32px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Quick Links */}
          <div>
            <h3 className="text-base md:text-lg font-medium text-white mb-4 md:mb-6">Quick Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FOOTER_LINKS.quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.href}
                    href={link.href}
                    className="p-4 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-gray-800 group-hover:bg-gray-700 transition-colors">
                        <Icon className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white mb-1">{link.label}</div>
                        <div className="text-xs text-gray-400">{link.description}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-base md:text-lg font-medium text-white mb-4 md:mb-6">Legal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FOOTER_LINKS.legal.map((link) => {
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.href}
                    href={link.href}
                    className="p-4 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-gray-800 group-hover:bg-gray-700 transition-colors">
                        <Icon className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white mb-1">{link.label}</div>
                        <div className="text-xs text-gray-400">{link.description}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
