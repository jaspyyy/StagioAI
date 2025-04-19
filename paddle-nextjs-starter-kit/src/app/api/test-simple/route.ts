import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Get environment variables for diagnostics
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    // Check if keys look valid (basic format check)
    const isAnonKeyFormatValid = typeof anonKey === 'string' && anonKey.startsWith('ey');
    const isServiceKeyFormatValid = typeof serviceKey === 'string' && serviceKey.startsWith('ey');
    
    // Create clients for testing
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const normalClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Basic connection tests with proper error handling
    let adminTest = null;
    let adminError = null;
    try {
      const response = await adminClient
        .from('_metadata')
        .select('*')
        .limit(1);
      adminTest = response.data;
      adminError = response.error;
    } catch (error: any) {
      adminError = { message: error.message || 'Connection failed' };
    }

    let normalTest = null;
    let normalError = null;
    try {
      const response = await normalClient
        .from('_metadata')
        .select('*')
        .limit(1);
      normalTest = response.data;
      normalError = response.error;
    } catch (error: any) {
      normalError = { message: error.message || 'Connection failed' };
    }

    // Check for projects table directly
    const { data: projectsData, error: projectsError } = await adminClient
      .from('projects')
      .select('*')
      .limit(5);

    // Get list of all tables (using metadata tables)
    let tablesData = null;
    let tablesError = null;
    try {
      const response = await adminClient
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      tablesData = response.data;
      tablesError = response.error;
    } catch (error: any) {
      tablesError = { message: error.message || 'Failed to fetch tables' };
    }

    // Check auth configuration
    let authSettings = null;
    let authError = null;
    try {
      const response = await adminClient
        .from('auth.config')
        .select('*')
        .limit(1);
      authSettings = response.data;
      authError = response.error;
    } catch (error: any) {
      authError = { message: error.message || 'Cannot access auth config' };
    }

    return NextResponse.json({
      env: {
        supabaseUrl,
        anonKeyPresent: !!anonKey,
        serviceKeyPresent: !!serviceKey,
        anonKeyFormatValid: isAnonKeyFormatValid,
        serviceKeyFormatValid: isServiceKeyFormatValid
      },
      connectionTests: {
        admin: {
          success: !adminError,
          error: adminError ? adminError.message : null
        },
        normal: {
          success: !normalError,
          error: normalError ? normalError.message : null
        }
      },
      tables: {
        list: tablesData,
        error: tablesError ? tablesError.message : null
      },
      projects: {
        exists: !projectsError,
        data: projectsData,
        error: projectsError ? projectsError.message : null
      },
      auth: {
        settings: authSettings,
        error: authError ? authError.message : null
      }
    });
  } catch (error: any) {
    console.error('Error testing Supabase connection:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
} 