# Visitor Tracking & Analytics System

This guide explains the visitor tracking and analytics system that has been added to your portfolio.

## Overview

The system tracks:
- **Visitor IDs** (persistent cookies)
- **Session IDs** (per-session cookies)
- **IP Addresses** (to identify location/uniqueness)
- **Page visits** (URL, title, referrer)
- **User engagement** (scroll depth, time on page, clicks)
- **Device info** (browser, OS, device type)
- **Visitor personas** (auto-detected profiles like "Recruiter", "Client", "Student")

## Architecture

### Database Tables (Supabase PostgreSQL)

1. **`master_cv`** - Stores CV data versions
   - `id` - UUID primary key
   - `json_data` - Full CV JSON
   - `version` - Version number
   - `is_active` - Currently active CV
   - `uploaded_by` - Who uploaded it
   - `created_at`, `updated_at` - Timestamps

2. **`visitor_tracking`** - Records each page visit
   - `visitor_id` - From cookie (persists 1 year)
   - `session_id` - From cookie (expires after 30 min inactivity)
   - `ip_address` - Client IP
   - `page_url`, `page_title`, `referrer` - Page info
   - `scroll_depth` - % of page scrolled
   - `visit_duration_seconds` - Time on page
   - `browser`, `operating_system`, `device_type` - User agent parsing
   - `is_bot` - Automatically detected bot traffic
   - Additional metadata

3. **`visitor_personas`** - Visitor profiles
   - `visitor_id` - Unique visitor
   - `persona_label` - e.g., "Potential Recruiter", "Student", "Client"
   - `confidence_score` - 0-100 accuracy
   - `visit_count` - Total visits
   - `most_visited_pages` - User's interests
   - `primary_device_type`, `primary_browser` - Preferred device
   - `estimated_interest` - JSON of inferred interests

4. **`visitor_events`** - Detailed interaction logging
   - `visitor_id`, `session_id` - Visitor tracking
   - `event_type` - "click", "scroll", "form_submit", etc.
   - `event_target` - What was clicked
   - `timestamp` - When

## Implementation

### Files Added/Modified

```
lib/
  supabase.js                          # Supabase client setup
  cookies.js                           # Cookie utilities (visitor IDs, sessions)

hooks/
  useVisitorTracking.js                # React hook for tracking

components/
  VisitorTracker.jsx                   # Tracking component (added to root layout)

app/
  layout.jsx                           # MODIFIED - Added VisitorTracker
  api/visitor/
    ip/route.js                        # Get client IP
    track/route.js                     # Record initial visit + persona detection
    update-session/route.js            # Update session metrics
  admin/
    master-cv/page.jsx                 # Master CV management + upload
    analytics/page.jsx                 # Visitor analytics dashboard

migrations.sql                          # Database schema (run in Supabase)
```

## Setup Instructions

### 1. Run Database Migrations

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Open **SQL Editor**
4. Copy all SQL from `migrations.sql`
5. Paste and run
6. Confirm all tables are created

### 2. Update Root Layout

The `VisitorTracker` component has been added to `/app/layout.jsx` in the `<body>` tag. This enables tracking on all pages automatically.

### 3. Test the System

1. Visit your portfolio in a browser
2. Open DevTools → Application → Cookies
3. Look for:
   - `nana_portfolio_visitor_id` (1 year)
   - `nana_portfolio_session_id` (30 min)
4. Check Supabase: visitor data should appear in `visitor_tracking` table

### 4. Access Admin Pages

- **Master CV Management**: `/admin/master-cv`
  - Upload/edit master CV JSON
  - Download as JSON or CSV
  - Version history in database

- **Analytics Dashboard**: `/admin/analytics`
  - View real-time visitor stats
  - See visitor personas
  - Charts: traffic, devices, browsers, pages
  - Filter by time range (7/30/90 days)

## How Tracking Works

### On Page Load
1. User visits your site
2. `VisitorTracker` component mounts
3. `useVisitorTracking()` hook:
   - Generates/retrieves `visitor_id` and `session_id` from cookies
   - Gets client IP via `/api/visitor/ip`
   - Collects device info (browser, OS, device type)
   - Sends to `/api/visitor/track`
4. Visitor record inserted into `visitor_tracking` table
5. Persona automatically detected and stored in `visitor_personas`

### During Page Visit
1. Scroll events update `scrollDepthRef`
2. Click events logged to `interactionEventsRef`
3. Time tracking in `pageStartTimeRef`

### On Page Leave / Periodic (5 min)
1. Session data sent to `/api/visitor/update-session`
2. Scroll depth, duration, and interactions updated
3. Individual events inserted into `visitor_events`
4. Persona confidence score recalculated

## Persona Detection Logic

The system automatically assigns personas based on visitor behavior:

| Persona | Signals | Confidence |
|---------|---------|-----------|
| **Potential Recruiter** | Visits /developer or /projects pages | 75% |
| **Potential Client** | Visits /designer, multiple visits | 70% |
| **Student/Learner** | High scroll depth (>50%) | 65% |
| **General Visitor** | Default (no strong signals) | 50% |

You can customize this logic in `/app/api/visitor/track/route.js` → `updateVisitorPersona()`.

## Privacy & Compliance

### Data Collected
- ✅ IP address (identifies location/uniqueness)
- ✅ Device info (user agent parsing)
- ✅ Page URLs (what they visit)
- ✅ Scroll depth & time (engagement)
- ❌ **No passwords, no sensitive data**
- ❌ **No tracking across other sites (first-party only)**
- ❌ **No personal identifiable info (PII)**

### Recommendations
1. **Add Privacy Policy** linking to `/admin/analytics`
   - Disclose cookie usage
   - Explain visitor tracking
   - Detail data retention (suggest 90 days auto-delete)

2. **Add Cookie Banner** (optional but recommended)
   - Show on first visit
   - Let users opt-out
   - Set `nana_portfolio_tracking_consent` cookie

3. **Bot Detection**
   - System automatically filters out bots
   - See `is_bot` flag in `visitor_tracking` table

## API Routes

### `GET /api/visitor/ip`
Returns client's public IP address.

**Response:**
```json
{ "ip": "203.0.113.45" }
```

### `POST /api/visitor/track`
Records initial page visit.

**Body:**
```json
{
  "visitor_id": "uuid",
  "session_id": "uuid",
  "ip_address": "203.0.113.45",
  "page_url": "https://nanaamoako.dev/developer",
  "page_title": "Developer Projects",
  "referrer": "https://google.com",
  "user_agent": "Mozilla/5.0...",
  "browser": "Chrome",
  "operating_system": "macOS",
  "device_type": "desktop"
}
```

### `POST /api/visitor/update-session`
Updates session metrics when user leaves or periodically.

**Body:**
```json
{
  "visitor_id": "uuid",
  "session_id": "uuid",
  "scroll_depth": 75,
  "visit_duration_seconds": 245,
  "interaction_events": [
    { "type": "click", "target": "button", "timestamp": "2026-03-18T..." }
  ]
}
```

## Analytics Dashboard Features

### Metrics
- **Total Visitors** - Unique visitor IDs
- **Sessions** - Unique session IDs
- **Pageviews** - Total page visits
- **Avg Duration** - Average time on site
- **Bounce Rate** - Sessions <5 seconds

### Visualizations
- **Daily Traffic** - Line chart of visits over time
- **Traffic by Device** - Pie chart (mobile/tablet/desktop)
- **Top Pages** - Bar chart of most visited URLs
- **Browser Distribution** - Browser usage stats

### Visitor Personas Table
- Shows 50 most confident personas
- Visitor ID (truncated)
- Persona label + confidence score
- Visit count & total duration
- Last visit timestamp

## Master CV Management

### Upload New CV
1. Go to `/admin/master-cv`
2. Click **📤 Upload JSON** to select a `master_cv.json` file
3. JSON is validated (must have required keys)
4. Click **💾 Save CV** to store in database
5. Old versions automatically deactivated

### Required JSON Structure
```json
{
  "personal_info": {
    "name": "Nana Amoako",
    "email": "nana@example.com",
    "phone": "+1234567890",
    "location": "Accra, Ghana",
    "linkedin": "https://linkedin.com/in/nana",
    "github": "https://github.com/nanadotam",
    "portfolio": "https://nanaamoako.dev"
  },
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "location": "City, Country",
      "start": "2024-01",
      "end": "Present",
      "achievements": ["Bullet 1", "Bullet 2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Name",
      "location": "City",
      "start": "2020-09",
      "end": "2024-05",
      "status": "Graduated"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Description",
      "tech": ["React", "Node.js"],
      "start": "2024-01",
      "end": "2024-03",
      "highlights": ["Achievement 1"]
    }
  ],
  "skills": {
    "languages": ["JavaScript", "Python"],
    "frameworks": ["React", "Next.js"],
    "tools": ["Git", "Docker"],
    "design": ["Figma"],
    "databases": ["PostgreSQL"]
  }
}
```

### Download CV Data
- **JSON** - Full structured data
- **CSV** - Flattened table format for Excel/Sheets

## Customization

### Change Persona Detection
Edit `/app/api/visitor/track/route.js` → `updateVisitorPersona()`:

```javascript
if (pages.some(p => p.includes('/your-page'))) {
  personaLabel = 'Your Persona';
  confidenceScore = 80;
}
```

### Change Cookie Expiry
Edit `/lib/cookies.js`:
```javascript
const VISITOR_ID_KEY_EXPIRY = 365 * 24 * 60; // Change days
const SESSION_TIMEOUT = 30 * 60 * 1000; // Change milliseconds
```

### Track Custom Events
In your components:
```javascript
import { getOrCreateVisitorId, getOrCreateSessionId } from '@/lib/cookies';

const handleCustomEvent = async () => {
  await fetch('/api/visitor/update-session', {
    method: 'POST',
    body: JSON.stringify({
      visitor_id: getOrCreateVisitorId(),
      session_id: getOrCreateSessionId(),
      // ... your data
    })
  });
};
```

## Database Cleanup

To delete old visitor data (recommended for GDPR/privacy):

```sql
-- Delete tracking data older than 90 days
DELETE FROM visitor_tracking
WHERE timestamp < NOW() - INTERVAL '90 days';

-- Delete personas not updated in 180 days
DELETE FROM visitor_personas
WHERE last_updated < NOW() - INTERVAL '180 days';
```

## Troubleshooting

### No visitor data appearing?
1. Check Supabase migrations ran successfully
2. Check browser console for JS errors
3. Verify RLS policies allow public inserts: `/api/visitor/track` and `/api/visitor/update-session`
4. Check network tab - API calls should return 200

### Analytics page shows 0 visitors?
1. Make sure you visited the site with JavaScript enabled
2. Wait 10-20 seconds for tracking to complete
3. Hard-refresh the analytics page (Cmd+Shift+R)
4. Check `is_bot = false` filter is applied

### Cookies not persisting?
1. Check browser privacy settings
2. Verify cookies are enabled
3. Check for HTTPS (required for SameSite=Lax)
4. Try incognito mode to rule out blocked cookies

## Next Steps

### Optional Enhancements
1. **Geolocation** - Use IP geolocation API to add city/country
2. **Heatmaps** - Track mouse movements
3. **Session Replay** - Record user interactions (privacy-sensitive)
4. **A/B Testing** - Show variants, track which converts better
5. **Email Integration** - Send weekly analytics summaries
6. **Alerts** - Notify on traffic spikes or new high-confidence persona

### Export Features
1. CSV export of visitor data
2. PDF analytics reports
3. Slack webhook notifications

---

Questions? Check the code comments in:
- `hooks/useVisitorTracking.js` - How tracking works
- `/app/api/visitor/*` - API endpoints
- `migrations.sql` - Database schema with helpful comments
