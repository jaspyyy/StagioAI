import { NextResponse } from 'next/server';

export async function GET() {
  // Check if API key exists in environment variables
  const apiKey = process.env.VIRTUAL_STAGING_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Virtual Staging AI API key is not configured' }, 
      { status: 500 }
    );
  }
  
  return NextResponse.json({ status: 'ok' });
} 