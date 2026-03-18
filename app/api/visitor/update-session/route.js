import { NextResponse } from 'next/server';
import { createBrowserClient } from '@supabase/ssr';

export async function POST(req) {
  try {
    const {
      visitor_id,
      session_id,
      scroll_depth,
      visit_duration_seconds,
      interaction_events
    } = await req.json();

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Update the most recent tracking record for this session
    const { error } = await supabase
      .from('visitor_tracking')
      .update({
        scroll_depth,
        visit_duration_seconds,
        interaction_events: interaction_events || []
      })
      .eq('visitor_id', visitor_id)
      .eq('session_id', session_id)
      .order('timestamp', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Update session error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    // Record individual interaction events
    if (interaction_events && interaction_events.length > 0) {
      const events = interaction_events.map(event => ({
        visitor_id,
        session_id,
        event_type: event.type,
        event_target: event.target,
        timestamp: new Date(event.timestamp).toISOString(),
        page_url: event.page_url || undefined
      }));

      const { error: eventError } = await supabase
        .from('visitor_events')
        .insert(events);

      if (eventError) {
        console.error('Event insertion error:', eventError);
      }
    }

    // Update persona with duration and engagement
    await updatePersonaDuration(supabase, visitor_id, visit_duration_seconds);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session update error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

async function updatePersonaDuration(supabase, visitorId, sessionDuration) {
  try {
    const { data: personas } = await supabase
      .from('visitor_personas')
      .select('total_session_duration_seconds')
      .eq('visitor_id', visitorId)
      .single();

    if (!personas) return;

    const newDuration = (personas.total_session_duration_seconds || 0) + sessionDuration;

    await supabase
      .from('visitor_personas')
      .update({
        total_session_duration_seconds: newDuration
      })
      .eq('visitor_id', visitorId);
  } catch (error) {
    console.error('Error updating persona duration:', error);
  }
}
