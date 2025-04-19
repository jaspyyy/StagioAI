import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    console.log('VSAI Status Check API: Request received');
    
    // Get renderId from URL params
    const url = new URL(request.url);
    const renderId = url.searchParams.get('renderId');
    
    if (!renderId) {
      console.log('VSAI Status Check API: Missing renderId');
      return NextResponse.json({ error: 'Render ID is required' }, { status: 400 });
    }
    
    console.log('VSAI Status Check API: Checking API key');
    const VSAI_API_KEY = process.env.VIRTUAL_STAGING_API_KEY;
    
    if (!VSAI_API_KEY) {
      console.error('VSAI Status Check API: API key not found in environment variables');
      return NextResponse.json({ error: 'API key configuration error' }, { status: 500 });
    }

    console.log(`VSAI Status Check API: Checking status for render ID: ${renderId}`);
    
    // First, decide which endpoint to use for status check
    // V2 API uses a different endpoint format than V1
    const statusEndpoints = [
      `https://api.virtualstagingai.app/v2/renders/${renderId}`, // V2 API
      `https://us-central1-furniture-ai.cloudfunctions.net/apiGetRender?id=${renderId}`, // Legacy endpoint
      `https://api.virtualstagingai.app/v1/render/get?id=${renderId}` // V1 API
    ];
    
    let response = null;
    let lastError = null;
    
    // Try each endpoint until one works
    for (const endpoint of statusEndpoints) {
      try {
        console.log(`VSAI Status Check API: Trying endpoint: ${endpoint}`);
        
        response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Api-Key ${VSAI_API_KEY}`,
            'Content-Type': 'application/json',
            'x-api-key': VSAI_API_KEY,
          },
        });
            
        console.log(`VSAI Status Check API: Response status from ${endpoint}: ${response.status}`);
        
        // If we got a valid response (not 404), break the loop
        if (response.status !== 404) {
          console.log(`VSAI Status Check API: Got response from endpoint: ${endpoint}`);
          break;
        } else {
          lastError = `API endpoint ${endpoint} not found (404)`;
          console.error(`VSAI Status Check API: ${lastError}`);
        }
      } catch (endpointError) {
        lastError = `Error connecting to ${endpoint}: ${endpointError instanceof Error ? endpointError.message : String(endpointError)}`;
        console.error(`VSAI Status Check API: ${lastError}`);
      }
    }
    
    // If no endpoints worked or all returned 404
    if (!response || response.status === 404) {
      return NextResponse.json({ 
        error: 'No working API endpoints found',
        details: lastError || 'All endpoints returned 404 Not Found'
      }, { status: 404 });
    }
    
    // Check for auth failures
    if (response.status === 401 || response.status === 403) {
      console.error(`VSAI Status Check API: Authentication failed with status ${response.status}`);
      return NextResponse.json({ 
        error: 'API authentication failed',
        details: `The API key was rejected with status ${response.status}`
      }, { status: response.status });
    }
    
    // Check for other errors
    if (!response.ok) {
      let errorMessage;
      try {
        const responseClone = response.clone();
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || `API request failed with status ${response.status}`;
          console.error('VSAI Status Check API: Error response:', errorData);
        } catch (jsonError) {
          const errorText = await responseClone.text();
          errorMessage = errorText || `API request failed with status ${response.status}`;
          console.error('VSAI Status Check API: Error text:', errorText);
        }
      } catch (parseError) {
        errorMessage = `API request failed with status ${response.status}`;
        console.error('VSAI Status Check API: Could not parse error response');
      }
      
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }
    
    // Process successful response
    let data;
    try {
      data = await response.json();
      console.log('VSAI Status Check API: Successful response format:', Object.keys(data));
      
      return NextResponse.json(data);
    } catch (parseError) {
      console.error('VSAI Status Check API: Error parsing response as JSON:', parseError);
      return NextResponse.json({ 
        error: 'Error parsing API response',
        details: parseError instanceof Error ? parseError.message : String(parseError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('VSAI Status Check API: Exception in proxy route:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 