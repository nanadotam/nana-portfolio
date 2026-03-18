-- Migration: Add Master CV and Visitor Tracking tables
-- Run this in your Supabase SQL editor

-- ========================================
-- 1. MASTER CV TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS master_cv (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- JSON data (full master CV)
  json_data jsonb NOT NULL,

  -- Metadata
  version integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  uploaded_by text
);

CREATE INDEX IF NOT EXISTS idx_master_cv_active ON master_cv(is_active);
CREATE INDEX IF NOT EXISTS idx_master_cv_version ON master_cv(version);

ALTER TABLE master_cv ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active CV
CREATE POLICY "public_read_master_cv"
ON master_cv
FOR SELECT
TO anon
USING (is_active = true);

-- Allow authenticated users to read master CV
CREATE POLICY "authenticated_read_master_cv"
ON master_cv
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert master CV
CREATE POLICY "authenticated_insert_master_cv"
ON master_cv
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update master CV
CREATE POLICY "authenticated_update_master_cv"
ON master_cv
FOR UPDATE
TO authenticated
USING (true);

-- ========================================
-- 2. VISITOR TRACKING TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS visitor_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Visitor identification
  visitor_id text NOT NULL, -- from cookie
  ip_address text NOT NULL,
  user_agent text,

  -- Page information
  page_url text NOT NULL,
  page_title text,
  referrer text,

  -- Session information
  session_id text,
  timestamp timestamp with time zone DEFAULT now(),
  visit_duration_seconds integer, -- time spent on page

  -- Geographic (from IP geolocation - can be populated later)
  country text,
  city text,
  region text,
  latitude decimal,
  longitude decimal,

  -- Device info
  device_type text, -- mobile, tablet, desktop
  browser text,
  operating_system text,

  -- User interaction
  scroll_depth integer, -- percentage scrolled
  clicks_tracked integer,
  interaction_events jsonb, -- array of events

  -- Additional metadata
  is_bot boolean DEFAULT false,
  json_data jsonb,

  created_at timestamp with time zone DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_visitor_id ON visitor_tracking(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_ip ON visitor_tracking(ip_address);
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_page_url ON visitor_tracking(page_url);
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_timestamp ON visitor_tracking(timestamp);
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_session ON visitor_tracking(session_id);

ALTER TABLE visitor_tracking ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view visitor data
CREATE POLICY "authenticated_read_visitor_data"
ON visitor_tracking
FOR SELECT
TO authenticated
USING (true);

-- Only backend can insert visitor data
CREATE POLICY "backend_insert_visitor_data"
ON visitor_tracking
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ========================================
-- 3. VISITOR PERSONAS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS visitor_personas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Persona identification
  visitor_id text NOT NULL UNIQUE,
  persona_name text,
  persona_label text, -- e.g. "Recruiter", "Student", "Potential Client"
  confidence_score decimal, -- 0-100 score of persona match

  -- Profile data
  visit_count integer DEFAULT 1,
  total_session_duration_seconds integer DEFAULT 0,
  last_visit timestamp with time zone,
  first_visit timestamp with time zone,

  -- Geographic profile
  primary_country text,
  primary_city text,

  -- Device profile
  primary_device_type text,
  primary_browser text,
  primary_os text,

  -- Behavior profile
  most_visited_pages text[], -- array of URLs
  average_scroll_depth integer,
  total_clicks integer,
  estimated_interest jsonb, -- e.g. { "category": "projects", "score": 95 }

  -- Metadata
  last_updated timestamp with time zone DEFAULT now(),
  notes text,
  json_data jsonb,

  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_personas_visitor_id ON visitor_personas(visitor_id);
CREATE INDEX IF NOT EXISTS idx_personas_confidence ON visitor_personas(confidence_score DESC);
CREATE INDEX IF NOT EXISTS idx_personas_label ON visitor_personas(persona_label);

ALTER TABLE visitor_personas ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view personas
CREATE POLICY "authenticated_read_personas"
ON visitor_personas
FOR SELECT
TO authenticated
USING (true);

-- Only backend can insert/update personas
CREATE POLICY "backend_manage_personas"
ON visitor_personas
FOR INSERT, UPDATE, DELETE
TO authenticated
WITH CHECK (true);

-- ========================================
-- 4. VISITOR EVENTS TABLE (for detailed interaction logging)
-- ========================================
CREATE TABLE IF NOT EXISTS visitor_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  visitor_id text NOT NULL,
  session_id text NOT NULL,
  event_type text NOT NULL, -- click, scroll, form_submit, download, etc.
  event_target text, -- element clicked, form name, etc.
  event_value text, -- additional context

  timestamp timestamp with time zone DEFAULT now(),
  page_url text,

  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_visitor ON visitor_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_events_session ON visitor_events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON visitor_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON visitor_events(timestamp);

ALTER TABLE visitor_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_read_events"
ON visitor_events
FOR SELECT
TO authenticated
USING (true);

-- ========================================
-- 5. HELPER FUNCTION - Get visitor analytics
-- ========================================
CREATE OR REPLACE FUNCTION get_visitor_analytics(start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_DATE - INTERVAL '30 days')
RETURNS TABLE (
  total_visitors bigint,
  total_sessions bigint,
  unique_ips bigint,
  avg_session_duration decimal,
  total_pageviews bigint,
  bounce_rate decimal,
  top_pages TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT visitor_id)::bigint as total_visitors,
    COUNT(DISTINCT session_id)::bigint as total_sessions,
    COUNT(DISTINCT ip_address)::bigint as unique_ips,
    ROUND(AVG(COALESCE(visit_duration_seconds, 0))::decimal, 2) as avg_session_duration,
    COUNT(*)::bigint as total_pageviews,
    ROUND((COUNT(*) FILTER (WHERE visit_duration_seconds < 5) * 100.0 / COUNT(*))::decimal, 2) as bounce_rate,
    ARRAY_AGG(DISTINCT page_url ORDER BY COUNT(*) DESC LIMIT 5) as top_pages
  FROM visitor_tracking
  WHERE timestamp >= start_date AND is_bot = false;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 6. HELPER FUNCTION - Detect persona
-- ========================================
CREATE OR REPLACE FUNCTION detect_visitor_persona(
  p_visit_count INTEGER,
  p_pages TEXT[],
  p_avg_scroll_depth INTEGER,
  p_referrer TEXT
)
RETURNS TABLE (
  persona_label TEXT,
  confidence_score INTEGER
) AS $$
DECLARE
  v_score INTEGER := 0;
  v_persona TEXT := 'General Visitor';
BEGIN
  -- Scoring logic for persona detection
  -- Recruiters: visit projects, low scroll depth, short visits
  -- Clients: visit projects and about, higher engagement
  -- Students: visit blog, projects, longer engagement

  -- Check for recruiter signals
  IF ARRAY_LENGTH(p_pages, 1) > 0 AND p_pages @> ARRAY['/developer', '/projects'] THEN
    v_score := v_score + 30;
    v_persona := 'Potential Recruiter';
  END IF;

  -- Check for client signals
  IF ARRAY_LENGTH(p_pages, 1) > 0 AND (p_pages @> ARRAY['/designer'] OR p_pages @> ARRAY['/projects']) AND p_visit_count > 3 THEN
    v_score := v_score + 25;
    v_persona := 'Potential Client';
  END IF;

  -- Check for student/learner signals
  IF ARRAY_LENGTH(p_pages, 1) > 0 AND p_avg_scroll_depth > 50 THEN
    v_score := v_score + 20;
    v_persona := 'Student/Learner';
  END IF;

  -- If no strong signals, default
  IF v_score = 0 THEN
    v_persona := 'General Visitor';
    v_score := 50;
  END IF;

  RETURN QUERY SELECT v_persona::TEXT, v_score::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- SUCCESS
-- ========================================
SELECT 'Migration complete! Master CV and Visitor Tracking tables are ready.' as message;
