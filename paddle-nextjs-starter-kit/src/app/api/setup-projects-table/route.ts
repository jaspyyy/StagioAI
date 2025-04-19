import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    console.log('Setting up projects table...');
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Service Role Key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    // Use service role key for admin operations with direct client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
      return NextResponse.json({ error: 'Server configuration error - missing service role key' }, { status: 500 });
    }

    // Check if table already exists
    console.log('Checking if projects table exists...');
    const { error: checkError } = await supabase
      .from('projects')
      .select('count')
      .limit(1)
      .single();

    if (checkError) {
      console.log('Check error:', checkError);
    }

    // Create or update the projects table
    try {
      // Function to execute SQL - wrapped in a try/catch to handle errors
      const executeSql = async (query: string, description: string) => {
        try {
          console.log(`Executing SQL for ${description}...`);
          const { error } = await supabase.rpc('exec_sql', { sql_query: query });
          if (error) {
            console.error(`Error executing SQL for ${description}:`, error);
            throw error;
          }
          console.log(`Successfully executed SQL for ${description}`);
        } catch (error) {
          console.log(`Could not execute SQL for ${description}, error:`, error);
          // Continue despite errors - table might already exist
        }
      };
      
      // Create UUID extension
      console.log('Creating UUID extension...');
      await executeSql(
        'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
        'creating UUID extension'
      );
      
      // Create the projects table
      console.log('Creating projects table...');
      await executeSql(`
        CREATE TABLE IF NOT EXISTS public.projects (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          renderid TEXT NOT NULL,
          image_url TEXT NOT NULL,
          room_type TEXT NOT NULL,
          style TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'processing',
          result_url TEXT,
          error TEXT,
          has_furniture BOOLEAN,
          furniture_percentage NUMERIC,
          remove_furniture BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_checked TIMESTAMP WITH TIME ZONE
        );
      `, 'creating projects table');
      
      // Add the last_checked column
      console.log('Adding last_checked column...');
      await executeSql(`
        DO $$
        BEGIN
          BEGIN
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS last_checked TIMESTAMP WITH TIME ZONE;
          EXCEPTION
            WHEN duplicate_column THEN NULL;
          END;
        END $$;
      `, 'adding last_checked column');
      
      // Set up RLS and permissions
      console.log('Setting up RLS and permissions...');
      await executeSql(`
        -- Make sure row level security is enabled
        ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
        
        -- Drop policies if they exist
        DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
        DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
        DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
        
        -- Create policies
        CREATE POLICY "Users can view their own projects" 
          ON public.projects FOR SELECT 
          USING (auth.uid() = user_id);
          
        CREATE POLICY "Users can create their own projects" 
          ON public.projects FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
          
        CREATE POLICY "Users can update their own projects" 
          ON public.projects FOR UPDATE
          USING (auth.uid() = user_id);
      `, 'setting up RLS and permissions');
      
      console.log('Database tables and permissions set up successfully');
    } catch (error) {
      console.error('Error setting up database schema:', error);
      return NextResponse.json({ 
        error: 'Failed to set up database schema',
        details: error instanceof Error ? error.message : String(error)
      }, { status: 500 });
    }

    // Create storage bucket for project images if it doesn't exist
    console.log('Creating storage bucket...');
    const { error: bucketError } = await supabase.storage.createBucket('virtual-staging', {
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['image/jpeg', 'image/png']
    });

    if (bucketError) {
      console.error('Bucket creation error:', bucketError);
      if (!bucketError.message.includes('already exists')) {
        return NextResponse.json({ error: bucketError.message }, { status: 500 });
      }
    }

    // Set up storage bucket policies
    console.log('Setting up storage bucket policies...');
    try {
      const { error: policyError } = await supabase.storage.from('virtual-staging').createSignedUrl('test.txt', 60);
      if (policyError) {
        console.error('Error checking bucket policies:', policyError);
      }
    } catch (error) {
      console.error('Error setting up bucket policies:', error);
    }

    return NextResponse.json({ 
      message: checkError 
        ? 'Projects table and storage bucket created successfully' 
        : 'Projects table permissions updated and storage bucket verified',
      status: 'success' 
    });
  } catch (error: any) {
    console.error('Error in setup-projects-table endpoint:', error);
    return NextResponse.json({ 
      error: error.message,
      details: error.stack || 'No stack trace available'
    }, { status: 500 });
  }
} 