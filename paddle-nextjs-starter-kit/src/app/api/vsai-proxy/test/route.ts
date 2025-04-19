import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Testing VSAI API connection');
  
  const VSAI_API_KEY = process.env.VIRTUAL_STAGING_API_KEY;
  
  if (!VSAI_API_KEY) {
    console.error('VSAI API Key not found in environment variables');
    return NextResponse.json(
      { error: 'API Key configuration error' },
      { status: 500 }
    );
  }
  
  try {
    // Try endpoints explicitly mentioned in the documentation
    const apiEndpoints = [
      // V2 endpoints
      'https://api.virtualstagingai.app/v2/renders',
      // Endpoints from known issues documentation
      'https://us-central1-furniture-ai.cloudfunctions.net/apiCreateRender',
      // Try V1 endpoints as fallback
      'https://api.virtualstagingai.app/v1/render/create'
    ];
    
    // Use a sample image URL for testing (public domain image)
    const sampleImageUrl = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800";
    
    let response = null;
    let lastError = null;
    let workingEndpoint = null;
    
    // Try each endpoint with a real POST request
    for (const apiEndpoint of apiEndpoints) {
      try {
        console.log(`Testing connection to endpoint: ${apiEndpoint}`);
        
        // Prepare appropriate payload according to API version
        let payload;
        
        if (apiEndpoint.includes('/v2/')) {
          // V2 API requires config object
          payload = {
            image_url: sampleImageUrl,
            room_type: "living",
            style: "modern",
            variation_count: 1,
            config: {
              type: "staging",
              add_furniture: {
                style: "modern",
                room_type: "living"
              },
              analyze_only: true,
              wait_for_completion: false
            }
          };
        } else {
          // V1 API uses flatter structure
          payload = {
            image_url: sampleImageUrl,
            room_type: "living",
            style: "modern",
            wait_for_completion: false,
            analyze_only: true,
            add_furniture: true, // Boolean for V1 API
            config: {
              type: "staging"
            }
          };
        }
        
        console.log(`Testing with payload structure:`, Object.keys(payload));
        console.log(`Testing with config:`, payload.config);
        
        // Try with both authorization header formats
        // Documentation shows 'Api-Key' (capital K) but we've been using 'Api-key'
        response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Api-Key ${VSAI_API_KEY}`,
            'x-api-key': VSAI_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        console.log(`API test response status from ${apiEndpoint}: ${response.status}`);
        
        // If endpoint exists and doesn't return 404
        if (response.status !== 404) {
          console.log(`Successfully verified endpoint exists: ${apiEndpoint}`);
          workingEndpoint = apiEndpoint;
          break;
        } else {
          lastError = `API endpoint ${apiEndpoint} not found (404)`;
          console.error(lastError);
        }
      } catch (endpointError) {
        lastError = `Error connecting to ${apiEndpoint}: ${endpointError instanceof Error ? endpointError.message : String(endpointError)}`;
        console.error(lastError);
      }
    }
    
    // If no endpoints worked or all returned 404
    if (!response || (response.status === 404)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'API endpoints not found', 
          details: lastError || 'All endpoints returned 404 Not Found'
        },
        { status: 404 }
      );
    }
    
    // Check if the API key is invalid
    if (response.status === 401 || response.status === 403) {
      return NextResponse.json(
        {
          success: false,
          error: 'API key is invalid',
          details: `Authentication failed with status ${response.status}`
        },
        { status: response.status }
      );
    }
    
    // If we got here, the endpoint exists and the API key was accepted
    const isKeyValid = response.status !== 401 && response.status !== 403;
    
    console.log(`VSAI API Test result: Endpoint exists, API key is ${isKeyValid ? 'valid' : 'invalid'}`);
    
    // Get response data if available
    let responseData;
    try {
      // Only try to parse response as JSON if it has content
      if (response.status !== 204 && response.headers.get('content-length') !== '0') {
        const responseClone = response.clone();
        try {
          responseData = await responseClone.json();
        } catch (jsonError) {
          console.log('Failed to parse response as JSON, trying text');
          responseData = { text: await response.text() };
        }
      } else {
        responseData = { message: "No content returned" };
      }
    } catch (error) {
      console.error('Error reading response:', error);
      responseData = { error: "Could not read response body" };
    }
    
    const maskedKey = VSAI_API_KEY.substring(0, 4) + '...' + VSAI_API_KEY.substring(VSAI_API_KEY.length - 4);
    
    // Return a new JSON response with all the data
    return NextResponse.json({
      success: isKeyValid,
      statusCode: response.status,
      apiKeyMasked: maskedKey,
      endpoint: workingEndpoint,
      response: responseData,
    });
  } catch (error) {
    console.error('Error testing VSAI API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error testing API connection', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 