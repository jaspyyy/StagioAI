import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/shared/logo';

interface Props {
  user: User | null;
}

export default function Header({ user }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="relative z-50">
      <div className="mx-auto max-w-7xl relative px-[32px] py-[18px] flex items-center justify-between bg-background">
        <div className="flex flex-1 items-center justify-start">
          <Link className="flex items-center" href={'/'}>
            <Logo size="md" />
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-end">
          <div className="flex space-x-4">
            <Button variant="ghost" asChild={true}>
              <Link href="/playground">Playground</Link>
            </Button>
            <Button variant="ghost" asChild={true}>
              <Link href="/pricing">Pricing</Link>
            </Button>
            {user?.id ? (
              <Button variant={'secondary'} asChild={true}>
                <Link href={'/dashboard'}>Dashboard</Link>
              </Button>
            ) : (
              <Button asChild={true} variant={'secondary'}>
                <Link href={'/login'}>Sign in</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-black/95">
              <SheetTitle className="text-lg font-semibold mb-4">Menu</SheetTitle>
              <nav className="flex flex-col space-y-3">
                <Link 
                  href="/playground" 
                  className="block px-3 py-2 text-base font-medium text-gray-200 hover:text-white transition-colors rounded-md hover:bg-gray-900"
                >
                  Playground
                </Link>
                <Link 
                  href="/pricing" 
                  className="block px-3 py-2 text-base font-medium text-gray-200 hover:text-white transition-colors rounded-md hover:bg-gray-900"
                >
                  Pricing
                </Link>
                {user?.id ? (
                  <Link 
                    href="/dashboard" 
                    className="block px-3 py-2 text-base font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-md"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link 
                    href="/login" 
                    className="block px-3 py-2 text-base font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-md"
                  >
                    Sign in
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
