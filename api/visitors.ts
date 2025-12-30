import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// These are automatically provided by Vercel when you connect the Supabase integration
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    // We use a table called 'site_stats' with columns 'name' (text, unique) and 'value' (int8)
    // You can create it in Supabase SQL editor:
    // create table site_stats (name text primary key, value int8 default 0);
    // insert into site_stats (name, value) values ('visitor_count', 0);

    const { data, error } = await supabase
      .rpc('increment_visitor_count_v2');

    // If RPC doesn't exist, fallback to manual update (less atomic but works without SQL setup)
    if (error) {
      console.warn('RPC failed, falling back to manual update:', error.message);
      
      const { data: selectData, error: selectError } = await supabase
        .from('site_stats')
        .select('value')
        .eq('name', 'visitor_count')
        .single();

      if (selectError) {
        // If row doesn't exist, create it
        const { data: insertData, error: insertError } = await supabase
          .from('site_stats')
          .upsert({ name: 'visitor_count', value: 1 }, { onConflict: 'name' })
          .select()
          .single();
        
        return response.status(200).json({ visitors: insertData?.value || 1 });
      }

      const newValue = (selectData.value || 0) + 1;
      const { data: updateData } = await supabase
        .from('site_stats')
        .update({ value: newValue })
        .eq('name', 'visitor_count')
        .select()
        .single();

      return response.status(200).json({ visitors: updateData?.value || newValue });
    }

    return response.status(200).json({ visitors: data });
  } catch (error) {
    console.error('Failed to update visitor count:', error);
    return response.status(500).json({ error: 'Failed to update visitor count' });
  }
}
