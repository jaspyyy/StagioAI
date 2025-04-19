'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AuthenticationForm } from '@/components/authentication/authentication-form';
import { signup } from '@/app/signup/actions';
import { useToast } from '@/components/ui/use-toast';
import { Logo } from '@/components/shared/logo';

export function SignupForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignup() {
    if (!email || !password) {
      toast({
        description: 'Please enter both email and password',
        variant: 'destructive'
      });
      return;
    }

    if (password.length < 6) {
      toast({
        description: 'Password must be at least 6 characters long',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await signup({ email, password });
      if (response?.error) {
        console.error('Signup error:', response.message);
        toast({ 
          description: response.message || 'Something went wrong. Please try again',
          variant: 'destructive' 
        });
      } else if (response?.message) {
        toast({ 
          description: response.message,
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Unexpected error during signup:', error);
      toast({ 
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form action={'#'} className={'px-6 md:px-16 pb-6 py-8 gap-6 flex flex-col items-center justify-center'}>
      <Logo size="lg" />
      <div className={'text-[30px] leading-[36px] font-medium tracking-[-0.6px] text-center'}>Create an account</div>
      <AuthenticationForm
        email={email}
        onEmailChange={(email) => setEmail(email)}
        password={password}
        onPasswordChange={(password) => setPassword(password)}
      />
      <Button 
        formAction={() => handleSignup()} 
        type={'submit'} 
        variant={'secondary'} 
        className={'w-full'}
        disabled={isLoading}
      >
        {isLoading ? 'Signing up...' : 'Sign up'}
      </Button>
    </form>
  );
}
