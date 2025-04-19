'use client';

import { ReactNode } from 'react';
import Header from '@/components/home/header/header';
import { Footer } from '@/components/home/footer/footer';
import { LocalizationWrapper } from '@/components/home/header/localization-wrapper';
import { User } from '@supabase/supabase-js';

interface LayoutContentProps {
  children: ReactNode;
  user: User | null;
}

export function LayoutContent({ children, user }: LayoutContentProps) {
  return (
    <>
      <LocalizationWrapper />
      <Header user={user} />
      <main>{children}</main>
      <Footer />
    </>
  );
} 