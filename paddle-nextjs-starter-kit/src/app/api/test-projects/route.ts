import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Get environment variables for diagnostics
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    // Create clients for testing
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const normalClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Check if Supabase is accessible at all
    let healthCheck = null;
    let healthError = null;
    try {
      const { data, error } = await adminClient.rpc('get_service_role');
      healthCheck = data;
      healthError = error;
    } catch (e: unknown) {
      healthError = { message: e instanceof Error ? e.message : 'Unknown error' };
    }

    // Get a list of all tables
    const { data: tablesData, error: tablesError } = await adminClient
      .rpc('exec_sql', {
        sql_query: `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public';
        `
      });

    // Try accessing with admin client
    const { data: adminData, error: adminError } = await adminClient
      .from('projects')
      .select('*')
      .limit(5);

    // Try with normal client
    const { data: normalData, error: normalError } = await normalClient
      .from('projects')
      .select('*')
      .limit(5);

    // Check if projects table exists with more detailed query
    const { data: tableInfo, error: tableError } = await adminClient
      .rpc('exec_sql', {
        sql_query: `
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name = 'projects'
          );
        `
      });
    
    // Check RLS policies on the projects table
    const { data: rlsPolicies, error: rlsError } = await adminClient
      .rpc('exec_sql', {
        sql_query: `
          SELECT * FROM pg_policies 
          WHERE tablename = 'projects';
        `
      });

    // Create projects table if it doesn't exist
    let creationResult = null;
    let creationError = null;
    
    if (tableInfo && !tableInfo[0]?.exists) {
      const { data, error } = await adminClient.rpc('exec_sql', {
        sql_query: `
          -- Create projects table
          CREATE TABLE IF NOT EXISTS public.projects (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            render_id TEXT,
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
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- Set up row level security (RLS)
          ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

          -- Allow users to see only their own projects
          CREATE POLICY "Users can view their own projects" 
            ON public.projects FOR SELECT 
            USING (auth.uid() = user_id);

          -- Allow users to insert their own projects  
          CREATE POLICY "Users can create their own projects" 
            ON public.projects FOR INSERT 
            WITH CHECK (auth.uid() = user_id);

          -- Allow users to update only their own projects
          CREATE POLICY "Users can update their own projects" 
            ON public.projects FOR UPDATE
            USING (auth.uid() = user_id);
        `
      });
      
      creationResult = data;
      creationError = error;
    }

    return NextResponse.json({
      env: {
        supabaseUrl,
        hasAnonKey,
        hasServiceKey
      },
      healthCheck: {
        success: !healthError,
        error: healthError?.message
      },
      tables: {
        allTables: tablesData,
        error: tablesError?.message
      },
      tableExists: tableInfo?.[0]?.exists ?? false,
      adminAccess: {
        success: !adminError,
        data: adminData,
        error: adminError ? adminError.message : null
      },
      normalAccess: {
        success: !normalError,
        data: normalData,
        error: normalError ? normalError.message : null
      },
      rlsPolicies: {
        policies: rlsPolicies,
        error: rlsError?.message
      },
      tableCreation: {
        wasCreated: tableInfo && !tableInfo[0]?.exists,
        result: creationResult,
        error: creationError?.message
      }
    });
  } catch (error: any) {
    console.error('Error testing projects table access:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 