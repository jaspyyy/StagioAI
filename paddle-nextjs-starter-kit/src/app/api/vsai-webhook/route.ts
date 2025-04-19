import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const payload = await req.json();

  // Validate webhook payload
  if (!payload.render_id || !payload.event_type) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  try {
    if (payload.event_type === 'done') {
      // Update project status in database
      const { error } = await supabase
        .from('projects')
        .update({
          status: 'completed',
          resultUrl: payload.result.url,
          updatedAt: new Date().toISOString(),
        })
        .eq('renderId', payload.render_id);

      if (error) throw error;
    } else if (payload.event_type === 'error') {
      // Update project status to failed
      const { error } = await supabase
        .from('projects')
        .update({
          status: 'failed',
          error: payload.error_message,
          updatedAt: new Date().toISOString(),
        })
        .eq('renderId', payload.render_id);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 