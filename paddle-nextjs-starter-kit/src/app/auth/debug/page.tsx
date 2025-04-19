"use client";

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function AuthDebug() {
  const [authState, setAuthState] = useState<any>(null);
  const [cookies, setCookies] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [signInResult, setSignInResult] = useState<any>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Test credentials
  const email = 'test@example.com';
  const password = 'test12345';

  useEffect(() => {
    // Check current session
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        setAuthState({
          sessionData: data,
          sessionError: error,
          timestamp: new Date().toISOString(),
        });

        if (error) {
          setError(`Session error: ${error.message}`);
        } else if (!data.session) {
          setError('No active session found');
        }
      } catch (e: any) {
        setError(`Exception checking auth: ${e.message}`);
      }
      
      // Check cookies
      setCookies(document.cookie);
    };

    checkAuth();
  }, []);

  const handleTestSignIn = async () => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setSignInResult({
        data,
        error,
        timestamp: new Date().toISOString(),
      });

      if (error) {
        setError(`Sign in error: ${error.message}`);
      } else {
        // Immediately check session again
        const { data: sessionData } = await supabase.auth.getSession();
        setAuthState({
          sessionData,
          timestamp: new Date().toISOString(),
          note: 'Updated after sign in',
        });
        setCookies(document.cookie);
      }
    } catch (e: any) {
      setError(`Exception during sign in: ${e.message}`);
    }
  };

  const handleCreateTestUser = async () => {
    try {
      setError(null);
      
      // Use API route to create a test user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setError(`Failed to create test user: ${result.error}`);
      } else {
        await handleTestSignIn();
      }
    } catch (e: any) {
      setError(`Exception creating user: ${e.message}`);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Authentication Debug Page</h1>
      
      {error && (
        <div className="p-4 mb-4 bg-red-100 border border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Actions</h2>
          <button 
            onClick={handleTestSignIn} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 w-full"
          >
            Test Sign In with {email}
          </button>
          
          <button 
            onClick={handleCreateTestUser} 
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Create Test User & Sign In
          </button>
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Current Auth State</h2>
          {authState ? (
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-60">
              {JSON.stringify(authState, null, 2)}
            </pre>
          ) : (
            <p>Loading auth state...</p>
          )}
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Cookies</h2>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-60">
            {cookies || 'No cookies found'}
          </pre>
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Sign In Result</h2>
          {signInResult ? (
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-60">
              {JSON.stringify(signInResult, null, 2)}
            </pre>
          ) : (
            <p>No sign in attempted yet</p>
          )}
        </div>
      </div>
    </div>
  );
} 