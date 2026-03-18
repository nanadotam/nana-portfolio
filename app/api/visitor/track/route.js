import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase';
import { createBrowserClient } from '@supabase/ssr';

export async function POST(req) {
  try {
    const {
      visitor_id,
      session_id,
      ip_address,
      page_url,
      page_title,
      referrer,
      user_agent,
      browser,
      operating_system,
      device_type,
      json_data
    } = await req.json();

    // Initialize Supabase client (server-side)
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Check if visitor is a bot
    const isBot = detectBot(user_agent);

    // Insert tracking record
    const { error } = await supabase.from('visitor_tracking').insert({
      visitor_id,
      session_id,
      ip_address,
      page_url,
      page_title,
      referrer,
      user_agent,
      browser,
      operating_system,
      device_type,
      is_bot: isBot,
      json_data: json_data || {},
      timestamp: new Date().toISOString()
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    // Try to update or create persona
    await updateVisitorPersona(supabase, visitor_id, page_url);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function detectBot(userAgent) {
  if (!userAgent) return false;

  const botPatterns = [
    'bot',
    'crawler',
    'spider',
    'scraper',
    'curl',
    'wget',
    'googlechrome',
    'postman'
  ];

  return botPatterns.some(pattern => userAgent.toLowerCase().includes(pattern));
}

async function updateVisitorPersona(supabase, visitorId, pageUrl) {
  try {
    // Get existing visitor data
    const { data: visits } = await supabase
      .from('visitor_tracking')
      .select('page_url, scroll_depth')
      .eq('visitor_id', visitorId)
      .order('timestamp', { ascending: false })
      .limit(10);

    if (!visits || visits.length === 0) return;

    const pages = visits.map(v => v.page_url);
    const avgScroll = Math.round(
      visits.reduce((sum, v) => sum + (v.scroll_depth || 0), 0) / visits.length
    );

    // Simple persona detection
    let personaLabel = 'General Visitor';
    let confidenceScore = 50;

    if (pages.some(p => p.includes('/developer')) || pages.some(p => p.includes('/projects'))) {
      personaLabel = 'Potential Recruiter';
      confidenceScore = 75;
    } else if (pages.some(p => p.includes('/designer')) && visits.length > 3) {
      personaLabel = 'Potential Client';
      confidenceScore = 70;
    } else if (avgScroll > 50) {
      personaLabel = 'Engaged Student/Learner';
      confidenceScore = 65;
    }

    // Update or insert persona
    const { error } = await supabase
      .from('visitor_personas')
      .upsert(
        {
          visitor_id: visitorId,
          persona_label: personaLabel,
          confidence_score: confidenceScore,
          visit_count: visits.length,
          most_visited_pages: pages,
          average_scroll_depth: avgScroll,
          last_visit: new Date().toISOString(),
          last_updated: new Date().toISOString()
        },
        { onConflict: 'visitor_id' }
      );

    if (error) {
      console.error('Persona update error:', error);
    }
  } catch (error) {
    console.error('Error updating visitor persona:', error);
  }
}
