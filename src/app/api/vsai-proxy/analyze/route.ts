import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.VIRTUAL_STAGING_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key configuration error: Missing Virtual Staging API key' }, 
      { status: 500 }
    );
  }
  
  try {
    const body = await request.json();
    
    if (!body.image_url) {
      return NextResponse.json(
        { error: 'Missing image_url in request body' }, 
        { status: 400 }
      );
    }
    
    // Make request to Virtual Staging AI API for furniture analysis
    const response = await fetch('https://api.virtualstagingai.app/v1/furniture/analyze', {
      method: 'POST',
      headers: {
        'Authorization': `Api-key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: body.image_url,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Virtual Staging API error:', errorData);
      return NextResponse.json(
        { error: errorData.error || errorData.message || 'Virtual Staging API request failed' }, 
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('Error in furniture analysis proxy:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
} 