import { Inter } from 'next/font/google';
import '../styles/globals.css';
import '../styles/layout.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { LayoutContent } from '@/components/layout/layout-content';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'block',
  preload: true,
  adjustFontFallback: true,
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://paddle-billing.vercel.app'),
  title: 'StagioAI',
  description:
    'StagioAI is a powerful virtual staging platform. With plans for businesses of all sizes, streamline your workflow with AI-powered staging, advanced editing tools, and seamless collaboration.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const cookieStore = cookies();
  const supabase = createClient();
  const { data: { user } } = await (await supabase).auth.getUser();

  return (
    <html lang="en" className={`min-h-full dark ${inter.variable}`}>
      <body className="font-sans font-medium">
        <LayoutContent user={user}>
          {children}
        </LayoutContent>
        <Toaster />
      </body>
    </html>
  );
}
