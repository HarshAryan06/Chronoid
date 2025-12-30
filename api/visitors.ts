import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // Check for environment variables - Vercel Supabase integration may use different names
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      availableEnvVars: Object.keys(process.env).filter(k => k.includes('SUPABASE') || k.includes('POSTGRES'))
    });
    return response.status(500).json({ 
      error: 'Database not configured',
      debug: {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey
      }
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // First, try the RPC function (most efficient)
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('increment_visitor_count_v2');

    if (!rpcError && rpcData !== null) {
      return response.status(200).json({ visitors: rpcData });
    }

    // RPC failed - log the error and try fallback
    if (rpcError) {
      console.warn('RPC failed:', rpcError.message);
    }

    // Fallback: manual select and update
    const { data: selectData, error: selectError } = await supabase
      .from('site_stats')
      .select('value')
      .eq('name', 'visitor_count')
      .single();

    if (selectError) {
      console.warn('Select failed:', selectError.message);
      
      // Table or row doesn't exist - try to create it
      const { data: upsertData, error: upsertError } = await supabase
        .from('site_stats')
        .upsert({ name: 'visitor_count', value: 1 }, { onConflict: 'name' })
        .select('value')
        .single();

      if (upsertError) {
        console.error('Upsert failed:', upsertError);
        return response.status(500).json({ 
          error: 'Failed to initialize visitor count',
          details: upsertError.message
        });
      }

      return response.status(200).json({ visitors: upsertData?.value || 1 });
    }

    // Update the count
    const newValue = (selectData.value || 0) + 1;
    const { data: updateData, error: updateError } = await supabase
      .from('site_stats')
      .update({ value: newValue })
      .eq('name', 'visitor_count')
      .select('value')
      .single();

    if (updateError) {
      console.error('Update failed:', updateError);
      return response.status(500).json({ 
        error: 'Failed to update visitor count',
        details: updateError.message
      });
    }

    return response.status(200).json({ visitors: updateData?.value || newValue });
  } catch (error) {
    console.error('Unexpected error:', error);
    return response.status(500).json({ 
      error: 'Failed to update visitor count',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
