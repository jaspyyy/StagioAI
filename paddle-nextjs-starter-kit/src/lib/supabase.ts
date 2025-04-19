import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use createBrowserClient for client-side components to include auth context
export const supabase = typeof window !== 'undefined' 
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : createClient(supabaseUrl, supabaseAnonKey);

export async function uploadImage(file: File, userId: string): Promise<string> {
  const timestamp = new Date().getTime();
  const fileName = `${userId}/${timestamp}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('virtual-staging')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('virtual-staging')
    .getPublicUrl(data.path);

  return publicUrl;
}

export async function checkRenderStatus(renderId: string, projectId: string) {
  try {
    console.log(`Checking render status for render ID: ${renderId}, project ID: ${projectId}`);
    
    // First, check if the project already has a result URL (to avoid unnecessary API calls)
    const { data: existingProject, error: existingError } = await supabase
      .from('projects')
      .select('status, result_url')
      .eq('id', projectId)
      .single();
    
    if (existingError) {
      console.error(`Error fetching existing project: ${existingError.message}`);
    } else if (existingProject && existingProject.status === 'completed' && existingProject.result_url) {
      console.log(`Project ${projectId} already has a completed status and result URL. Skipping status check.`);
      return;
    }
    
    // Make request to check render status
    console.log(`Making API request to check status for render ID: ${renderId}`);
    const response = await fetch(`/api/vsai-proxy/check-status?renderId=${renderId}`);
    
    if (!response.ok) {
      console.error(`Error checking render status: ${response.status}`);
      const errorText = await response.text();
      console.error(`Response error details: ${errorText}`);
      
      // If we get a 404, the render might have been deleted or expired
      if (response.status === 404) {
        console.log(`Render ID ${renderId} not found (404). Marking project as failed.`);
        await supabase
          .from('projects')
          .update({
            status: 'failed',
            error: 'Render not found or expired',
            last_checked: new Date().toISOString(),
          })
          .eq('id', projectId);
      }
      
      return;
    }
    
    // Parse API response
    const data = await response.json();
    console.log(`Render status check response:`, data);
    
    // Extract result URL from response if available
    let resultUrl = null;
    let status = 'processing';
    let errorMessage = null;
    
    if (data.status === 'completed' || data.status === 'done') {
      status = 'completed';
      
      // Find the first available result image URL
      if (data.variations && data.variations.length > 0) {
        console.log(`Found ${data.variations.length} variations, using the first one`);
        
        const firstVariation = data.variations[0];
        if (firstVariation.url) {
          resultUrl = firstVariation.url;
          console.log(`Found result URL in variation.url: ${resultUrl.substring(0, 50)}...`);
        } else if (firstVariation.result_url) {
          resultUrl = firstVariation.result_url;
          console.log(`Found result URL in variation.result_url: ${resultUrl.substring(0, 50)}...`);
        } else if (firstVariation.image_url) {
          resultUrl = firstVariation.image_url;
          console.log(`Found result URL in variation.image_url: ${resultUrl.substring(0, 50)}...`);
        }
      } else if (data.render && data.render.url) {
        resultUrl = data.render.url;
        console.log(`Found result URL in render.url: ${resultUrl.substring(0, 50)}...`);
      } else if (data.url) {
        resultUrl = data.url;
        console.log(`Found result URL in root url property: ${resultUrl.substring(0, 50)}...`);
      } else if (data.image_url) {
        resultUrl = data.image_url;
        console.log(`Found result URL in root image_url property: ${resultUrl.substring(0, 50)}...`);
      }
      
      if (!resultUrl) {
        console.error('Render marked as completed but no result URL found!', data);
        errorMessage = 'Render completed but no result URL available';
      }
    } else if (data.status === 'failed' || data.status === 'error') {
      status = 'failed';
      errorMessage = data.error || data.message || 'Rendering failed';
      console.error(`Render failed with error: ${errorMessage}`);
    } else if (data.status === 'processing' || data.status === 'pending' || data.status === 'queued') {
      status = 'processing';
      console.log(`Render still processing: ${data.status}`);
    }
    
    // Update project in Supabase with snake_case column names
    console.log(`Updating project ${projectId} with status: ${status}`);
    
    const updateData: any = {
      status,
      last_checked: new Date().toISOString(),
    };
    
    if (resultUrl) {
      updateData.result_url = resultUrl;
    }
    
    if (errorMessage) {
      updateData.error = errorMessage;
    }
    
    const { error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId);
    
    if (error) {
      console.error(`Error updating project status in Supabase:`, error);
    } else {
      console.log(`Successfully updated project ${projectId} with status ${status}`);
      if (resultUrl) {
        console.log(`Result URL saved: ${resultUrl.substring(0, 50)}...`);
      }
    }
    
    // If still processing, schedule another check in 30 seconds
    if (status === 'processing') {
      console.log(`Scheduling next status check for render ${renderId} in 30 seconds`);
      setTimeout(() => checkRenderStatus(renderId, projectId), 30000);
    } else {
      console.log(`Final status for render ${renderId}: ${status}`);
    }
  } catch (error) {
    console.error(`Exception checking render status:`, error);
    
    // Try to update the project to show the error
    try {
      await supabase
        .from('projects')
        .update({
          error: `Error checking status: ${error instanceof Error ? error.message : String(error)}`,
          last_checked: new Date().toISOString(),
        })
        .eq('id', projectId);
    } catch (updateError) {
      console.error(`Failed to update project with error: ${updateError}`);
    }
  }
} 