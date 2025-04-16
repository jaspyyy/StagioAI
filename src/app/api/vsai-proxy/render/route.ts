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
    
    // Make request to Virtual Staging AI API
    const response = await fetch('https://api.virtualstagingai.app/v1/render/create', {
      method: 'POST',
      headers: {
        'Authorization': `Api-key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: body.image_url,
        room_type: body.room_type,
        style: body.style,
        remove_furniture: body.remove_furniture || false,
        wait_for_completion: false,
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
    console.error('Error in render proxy:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
} 