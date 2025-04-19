import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('VSAI Render API: Request received');
    
    const body = await request.json();
    const { image_url, room_type, style, remove_furniture } = body;

    if (!image_url) {
      console.log('VSAI Render API: Missing image_url');
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    if (!room_type) {
      console.log('VSAI Render API: Missing room_type');
      return NextResponse.json({ error: 'Room type is required' }, { status: 400 });
    }

    if (!style) {
      console.log('VSAI Render API: Missing style');
      return NextResponse.json({ error: 'Style is required' }, { status: 400 });
    }
    
    // Map room types to API expected values
    const mapRoomTypeToAPIFormat = (roomType: string): string => {
      const mapping: { [key: string]: string } = {
        'bedroom': 'bed',
        'dining-room': 'dining',
        'kids-room': 'kids_room',
        'home-office': 'home_office',
      };
      
      return mapping[roomType] || roomType; // Return mapped value or original if no mapping exists
    };
    
    const apiRoomType = mapRoomTypeToAPIFormat(room_type);
    
    console.log('VSAI Render API: Checking API key');
    const VSAI_API_KEY = process.env.VIRTUAL_STAGING_API_KEY;
    
    if (!VSAI_API_KEY) {
      console.error('VSAI Render API: API key not found in environment variables');
      return NextResponse.json({ error: 'API key configuration error' }, { status: 500 });
    }

    console.log('VSAI Render API: Making request to create render');
    console.log(`VSAI Render API: Using image URL: ${image_url.substring(0, 50)}...`);
    console.log(`VSAI Render API: Room type: ${room_type}`);
    console.log(`VSAI Render API: Style: ${style}`);
    console.log(`VSAI Render API: Remove furniture: ${remove_furniture ? 'Yes' : 'No'}`);
    
    // We prefer to use a single endpoint to avoid creating multiple renders
    // Let's use the V1 endpoint since it's more stable according to the docs
    const endpoint = 'https://api.virtualstagingai.app/v1/render/create';
    
    let response = null;
    
    try {
      console.log(`VSAI Render API: Using endpoint: ${endpoint}`);
      
      // Create a simple V1 API payload
      const payload = {
        image_url,
        room_type: apiRoomType,
        style,
        // CRITICALLY IMPORTANT: These settings ensure only ONE variation is created
        variation_count: 1,
        generate_additional_renders: false,
        auto_create_renders: false,
        prevent_multiple_renders: true,
        wait_for_completion: false,
        ...(remove_furniture ? { remove_furniture: true } : { add_furniture: true }),
        // Adding metadata to help track API usage
        metadata: {
          source: "paddle-next-starter-kit",
          single_variation_only: true
        }
      };
      
      // Add webhook URL if provided in environment variables
      const webhookUrl = process.env.VSAI_WEBHOOK_URL;
      if (webhookUrl) {
        console.log(`VSAI Render API: Adding webhook URL: ${webhookUrl}`);
        (payload as any).webhook_url = webhookUrl;
      }
      
      console.log(`VSAI Render API: Payload (single variation only):`, payload);
      
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Api-Key ${VSAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
          
      console.log(`VSAI Render API: Response status: ${response.status}`);
      
      // If the main endpoint fails, try the backup endpoint from the docs
      if (response.status === 404) {
        const backupEndpoint = 'https://us-central1-furniture-ai.cloudfunctions.net/apiCreateRender';
        console.log(`VSAI Render API: Main endpoint failed, trying backup: ${backupEndpoint}`);
        
        // For the backup endpoint, use the same explicit single variation settings
        response = await fetch(backupEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Api-Key ${VSAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        
        console.log(`VSAI Render API: Backup response status: ${response.status}`);
      }
    } catch (endpointError) {
      const errorMessage = `Error connecting to endpoint: ${endpointError instanceof Error ? endpointError.message : String(endpointError)}`;
      console.error(`VSAI Render API: ${errorMessage}`);
      
      return NextResponse.json({ 
        error: 'API connection failed',
        details: errorMessage
      }, { status: 500 });
    }
    
    // Check for auth failures
    if (response.status === 401 || response.status === 403) {
      console.error(`VSAI Render API: Authentication failed with status ${response.status}`);
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
          console.error('VSAI Render API: Error response:', errorData);
        } catch (jsonError) {
          const errorText = await responseClone.text();
          errorMessage = errorText || `API request failed with status ${response.status}`;
          console.error('VSAI Render API: Error text:', errorText);
        }
      } catch (parseError) {
        errorMessage = `API request failed with status ${response.status}`;
        console.error('VSAI Render API: Could not parse error response');
      }
      
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }
    
    // Process successful response
    let data;
    try {
      data = await response.json();
      console.log('VSAI Render API: Successful response format:', Object.keys(data));
      console.log('VSAI Render API: Response data:', JSON.stringify(data, null, 2));
      
      // Fix the ID field name if needed - the handleSubmit function expects an 'id'
      // but the API might return 'render_id'
      const renderIdValue = data.render_id || data.id;
      
      if (!renderIdValue) {
        console.error('VSAI Render API: No render ID found in response!', data);
        return NextResponse.json({
          error: 'No render ID received from the API',
          details: 'API response did not contain render_id or id field',
          raw_response: data
        }, { status: 500 });
      }
      
      console.log(`VSAI Render API: Found render ID: ${renderIdValue}`);
      
      // Create enhanced response with guaranteed id field
      const enhancedData = {
        ...data,
        // ALWAYS add an explicit id field, prioritizing existing render_id
        id: renderIdValue,
        render_id: renderIdValue, // Add both formats to be safe
        message: "Render created successfully. The image will be processed asynchronously.",
        estimated_completion_time: data.eta || "30-60 seconds",
        progress: 0,
        single_variation_confirmed: true
      };
      
      console.log('VSAI Render API: Enhanced response:', JSON.stringify(enhancedData, null, 2));
      return NextResponse.json(enhancedData);
    } catch (parseError) {
      console.error('VSAI Render API: Error parsing response as JSON:', parseError);
      return NextResponse.json({ 
        error: 'Error parsing API response',
        details: parseError instanceof Error ? parseError.message : String(parseError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('VSAI Render API: Exception in proxy route:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 