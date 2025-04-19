import { NextResponse } from 'next/server';

// Mock furniture analysis response to use for all analysis requests
// This prevents ANY API calls and avoids credit usage
const MOCK_FURNITURE_ANALYSIS = {
  hasFurniture: true,
  furniturePercentage: 35,
  items: [
    { name: "chair", confidence: 0.95, bbox: [100, 100, 200, 300] },
    { name: "table", confidence: 0.92, bbox: [300, 200, 500, 400] },
    { name: "sofa", confidence: 0.89, bbox: [50, 400, 450, 600] }
  ]
};

export async function POST(request: Request) {
  try {
    console.log('VSAI Analyze API: Using MOCK data only to prevent API calls');
    
    const body = await request.json();
    const { image_url, room_type } = body;

    if (!image_url) {
      console.log('VSAI Analyze API: Missing image_url');
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Log the request details but don't actually call any APIs
    console.log(`VSAI Analyze API: Image URL: ${image_url.substring(0, 50)}...`);
    console.log(`VSAI Analyze API: Room type: ${room_type || "not specified"}`);
    
    // ⚠️ IMPORTANT: No actual API calls are made - only mock data is returned ⚠️
    console.log('VSAI Analyze API: Returning mock furniture analysis data');
    
    // Add a short delay to simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // IMPORTANT: Include the original image_url in the response
    // to maintain continuity in the workflow
    return NextResponse.json({
      ...MOCK_FURNITURE_ANALYSIS,
      _source: 'mock_data',
      message: 'Using mock data to avoid API costs. NO REAL API CALLS ARE MADE.',
      room_type: room_type,
      // Include the original image URL to ensure it's preserved
      original_image_url: image_url
    });
  } catch (error) {
    console.error('VSAI Analyze API: Exception:', error);
    
    // Even on error, return mock data
    return NextResponse.json({
      ...MOCK_FURNITURE_ANALYSIS,
      _source: 'error_fallback',
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
      message: 'Using fallback data due to error. NO API CALLS WERE MADE.'
    });
  }
} 