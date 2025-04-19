'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

interface FormData {
  email: string;
  password: string;
}

export async function signup(data: FormData) {
  const supabase = await createClient();
  
  const { error, data: authData } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
    }
  });

  if (error) {
    return { 
      error: true,
      message: error.message 
    };
  }

  // If email confirmations are enabled, notify the user
  if (authData?.user?.identities?.length === 0) {
    return {
      error: false,
      message: 'Check your email for the confirmation link.'
    };
  }

  // If email confirmations are disabled, sign in the user directly
  if (authData?.user) {
    revalidatePath('/', 'layout');
    redirect('/');
  }

  return { error: true, message: 'Something went wrong. Please try again.' };
}
