"use client";

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const supabase = createClientComponentClient();

  // Check session status on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setDebugInfo({ type: 'Session Check Error', message: error.message, details: error });
        } else if (data.session) {
          setDebugInfo({ type: 'Session Found', user: data.session.user });
        } else {
          setDebugInfo({ type: 'No Session' });
        }
      } catch (e: any) {
        setDebugInfo({ type: 'Exception', message: e.message, details: e });
      }
    };
    
    checkSession();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDebugInfo(null);

    try {
      console.log('Attempting to sign in with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        setError(`Authentication failed: ${error.message}`);
        setDebugInfo({ type: 'Auth Error', message: error.message, details: error });
      } else {
        console.log('Sign in successful:', data);
        setDebugInfo({ type: 'Sign In Success', session: data.session });
        
        // Let's explicitly wait a moment to ensure the session is properly set
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }
    } catch (e: any) {
      console.error('Exception during sign in:', e);
      setError(`An unexpected error occurred: ${e.message}`);
      setDebugInfo({ type: 'Exception', message: e.message, details: e });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-white text-center">Sign In</h1>
        
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-100/10 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4" name="signin-form">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            name="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <a href="/auth/signup" className="text-sm text-blue-400 hover:text-blue-300">
            Don't have an account? Sign up
          </a>
        </div>

        {/* Debug Info Section */}
        {debugInfo && (
          <div className="mt-8 p-4 bg-gray-700 rounded-md">
            <h3 className="text-sm font-medium text-white mb-2">Debug Information:</h3>
            <pre className="text-xs text-gray-300 overflow-auto max-h-40">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 