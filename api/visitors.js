import { kv } from '@vercel/kv';

// Simple hash function for IP privacy
function hashIP(ip) {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get visitor IP from headers (Vercel provides this)
    const forwarded = req.headers['x-forwarded-for'];
    const ip = typeof forwarded === 'string' 
      ? forwarded.split(',')[0].trim() 
      : req.socket?.remoteAddress || 'unknown';

    // Hash the IP for privacy
    const hashedIP = hashIP(ip);
    const visitorKey = `visitor:${hashedIP}`;

    if (req.method === 'POST') {
      // Check if this visitor has been counted
      const exists = await kv.exists(visitorKey);

      if (!exists) {
        // Mark this IP as visited (expires in 365 days)
        await kv.set(visitorKey, true, { ex: 365 * 24 * 60 * 60 });
        
        // Increment unique visitor count
        await kv.incr('unique_visitor_count');
      }
    }

    // Get current count
    const count = await kv.get('unique_visitor_count') || 0;

    return res.status(200).json({ 
      count,
      success: true 
    });
  } catch (error) {
    console.error('Visitor tracking error:', error);
    return res.status(500).json({ 
      error: 'Failed to track visitor',
      count: 0,
      success: false 
    });
  }
}

