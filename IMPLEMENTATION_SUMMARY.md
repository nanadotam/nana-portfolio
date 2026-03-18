# Implementation Summary: Visitor Tracking & Analytics + Master CV Management

## What Was Built

A comprehensive **visitor tracking system** with **database schema**, **admin dashboards**, and **analytics** that collects IP addresses, tracks visitor behavior, and builds automatic personas.

Plus: **Master CV management system** for managing CV versions in the database.

---

## What's New

### 1. Database Schema (`migrations.sql`)

Four new Supabase PostgreSQL tables:

- **`master_cv`** - Store CV data versions
- **`visitor_tracking`** - Record each page visit with IP, device, engagement
- **`visitor_personas`** - Auto-detected visitor profiles ("Recruiter", "Client", "Student", etc.)
- **`visitor_events`** - Detailed interaction logging (clicks, scrolls, etc.)

**Status**: Schema file created. **Action required**: Run in Supabase SQL editor (see guide).

---

### 2. Tracking Infrastructure

#### Core Files Created:

| File | Purpose |
|------|---------|
| `lib/supabase.js` | Supabase client setup |
| `lib/cookies.js` | Cookie utilities (visitor ID, session ID, device detection) |
| `hooks/useVisitorTracking.js` | React hook that runs tracking logic |
| `components/VisitorTracker.jsx` | Component added to root layout |
| `app/layout.jsx` | **MODIFIED** - Added VisitorTracker component |

#### How It Works:

1. **On page load**: VisitorTracker component mounts
2. **Cookie management**:
   - `nana_portfolio_visitor_id` - Persists 1 year (identifies unique visitor)
   - `nana_portfolio_session_id` - Expires after 30 min inactivity (identifies session)
3. **Data collection**:
   - Calls `/api/visitor/ip` to get client IP
   - Collects device info: browser, OS, device type
   - Tracks scroll depth, time on page, interactions
4. **Periodic updates**: Every 5 minutes or on page leave, send metrics

---

### 3. API Routes

Three new tracking endpoints:

#### `GET /api/visitor/ip`
Returns client's public IP.

#### `POST /api/visitor/track`
Records initial visit. Creates persona automatically.
- Detects bots and filters them out
- Calls persona detection logic

#### `POST /api/visitor/update-session`
Updates session metrics (scroll, duration, events).

---

### 4. Admin Pages

#### `/admin/master-cv` - Master CV Management
- Upload/edit CV JSON
- Download as JSON or CSV
- Version history in database
- Real-time JSON preview

#### `/admin/analytics` - Visitor Analytics Dashboard
- **Key metrics**: Total visitors, sessions, pageviews, avg duration, bounce rate
- **Charts**: Daily traffic (line), device distribution (pie), top pages (bar), browsers
- **Visitor personas table**: Shows detected personas with confidence scores
- **Time filter**: View data from last 7/30/90 days
- **Real-time updates**: Refreshable dashboard

---

### 5. Visitor Persona Detection

Automatic persona classification:

| Persona | Signal | Confidence |
|---------|--------|-----------|
| **Potential Recruiter** | Visits /developer or /projects | 75% |
| **Potential Client** | Visits /designer + multiple visits | 70% |
| **Student/Learner** | High scroll depth (>50%) | 65% |
| **General Visitor** | Default | 50% |

Update logic in: `/app/api/visitor/track/route.js` → `updateVisitorPersona()`

---

## File Structure

```
migrations.sql                              # Database schema - RUN IN SUPABASE
VISITOR_TRACKING_GUIDE.md                  # Detailed setup & customization guide
IMPLEMENTATION_SUMMARY.md                  # This file

lib/
  supabase.js                              # Supabase client
  cookies.js                               # Cookie utilities

hooks/
  useVisitorTracking.js                    # Main tracking hook

components/
  VisitorTracker.jsx                       # Tracking component

app/
  layout.jsx                               # MODIFIED - Added VisitorTracker
  api/visitor/
    ip/route.js                            # Get client IP
    track/route.js                         # Record visit + detect persona
    update-session/route.js                # Update session metrics
  admin/
    master-cv/page.jsx                     # CV management dashboard
    analytics/page.jsx                     # Analytics dashboard
```

---

## Getting Started

### Step 1: Run Database Migrations ⚠️ REQUIRED

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. **SQL Editor** → Create new query
4. Copy entire content of `migrations.sql`
5. Paste and run
6. Verify all tables created: `master_cv`, `visitor_tracking`, `visitor_personas`, `visitor_events`

### Step 2: Install Dependencies

```bash
npm install mammoth recharts@2.15.0
```

Already installed:
- `groq-sdk` ✅
- `docx` ✅
- `file-saver` ✅
- `@supabase/supabase-js` ✅

### Step 3: Test Tracking

1. Visit your portfolio homepage
2. Open DevTools → **Application** → **Cookies**
3. Look for `nana_portfolio_visitor_id` and `nana_portfolio_session_id`
4. Open `/admin/analytics`
5. Refresh page and wait 10-20 seconds
6. Your visitor should appear in the analytics dashboard

### Step 4: Upload Master CV

1. Create `master_cv.json` with the required structure (see VISITOR_TRACKING_GUIDE.md)
2. Go to `/admin/master-cv`
3. Click **📤 Upload JSON**
4. Click **💾 Save CV**
5. CV is now in database

---

## Key Features

### ✅ Visitor Tracking
- IP address collection (identifies location & uniqueness)
- Device fingerprinting (browser, OS, device type)
- Session tracking (persists across pages)
- Scroll depth monitoring
- Time-on-page measurement
- Click tracking
- Bot detection and filtering

### ✅ Analytics Dashboard
- 6 key metrics (visitors, sessions, pageviews, duration, bounce rate, top pages)
- 4 interactive charts (daily traffic, devices, browsers, pages)
- 50 visitor personas with confidence scores
- Time range filtering (7/30/90 days)
- Real-time data updates

### ✅ Persona Detection
- Automatic classification based on behavior
- Confidence scoring (0-100%)
- Interest inference (which pages visited)
- Device & browser preferences
- Engagement tracking

### ✅ Master CV Management
- Version control in database
- Upload/edit JSON
- Download as JSON or CSV
- Real-time preview
- Required structure validation

---

## Data Flow Diagram

```
User Visits Site
    ↓
VisitorTracker Component Loads
    ↓
useVisitorTracking() Hook Initializes
    ├─ Get/Create visitor_id (cookie)
    ├─ Get/Create session_id (cookie)
    └─ Fetch client IP
    ↓
POST /api/visitor/track
    ├─ Insert into visitor_tracking
    ├─ Detect bot traffic
    ├─ Call updateVisitorPersona()
    └─ Upsert into visitor_personas
    ↓
Track Engagement (scroll, clicks, time)
    ↓
On Page Leave / 5 min timer
    ↓
POST /api/visitor/update-session
    ├─ Update visitor_tracking (scroll_depth, duration)
    ├─ Insert interaction_events
    └─ Update persona with duration
    ↓
Admin Views /admin/analytics
    ↓
Query Database → Process Stats → Display Charts
```

---

## Privacy & Compliance

### Data Collected ✅
- IP address (location/uniqueness)
- Device info (browser, OS, device type)
- Page URLs (what they visit)
- Engagement metrics (scroll, time)

### Data NOT Collected ❌
- Passwords or authentication data
- Financial information
- Personal identifiable info (names, emails)
- Tracking across other sites (first-party only)

### Recommendations
1. Add privacy policy disclosing cookie usage
2. Consider cookie banner for GDPR compliance
3. Set data retention policy (e.g., 90 days auto-delete)
4. Document in terms of service

---

## Configuration

### Change Persona Detection
File: `/app/api/visitor/track/route.js` → `updateVisitorPersona()`

```javascript
// Add custom persona logic
if (pages.some(p => p.includes('/your-page'))) {
  personaLabel = 'Custom Persona';
  confidenceScore = 80;
}
```

### Change Cookie Expiry
File: `/lib/cookies.js`

```javascript
const VISITOR_ID_KEY = 'nana_portfolio_visitor_id';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// To change visitor ID expiry: setCookie(VISITOR_ID_KEY, visitorId, 730); // 2 years
```

### Change Tracking Interval
File: `/hooks/useVisitorTracking.js`

```javascript
// Change from 5 minutes to custom interval
trackingTimeoutRef.current = setInterval(sendSessionData, 10 * 60 * 1000); // 10 minutes
```

---

## Troubleshooting

### No visitor data appearing?
- [ ] Verify migrations ran in Supabase
- [ ] Check RLS policies are correct (see `migrations.sql`)
- [ ] Check browser console for JS errors
- [ ] Hard-refresh analytics page (Cmd+Shift+R)

### Personas not detecting?
- [ ] Check your page URLs match detection logic
- [ ] Verify persona detection code in `/app/api/visitor/track/route.js`
- [ ] Try visiting /developer or /projects pages for "Recruiter" persona

### Analytics page loading slowly?
- [ ] First load queries 30 days of data (large query)
- [ ] Try 7-day filter first
- [ ] Add indexes to visitor_tracking if needed

---

## Next Steps / Enhancements

### High Priority
1. **Run migrations.sql** in Supabase (required)
2. Test tracking on your site
3. Verify analytics dashboard works
4. Update privacy policy

### Medium Priority
1. Add cookie consent banner
2. Upload master CV JSON to database
3. Customize persona detection for your needs
4. Set data retention policy

### Future Features
1. **Geolocation**: Use IP geolocation API (MaxMind, IP2Location)
2. **Heat maps**: Track mouse movements
3. **Session replay**: Record user interactions (privacy-sensitive)
4. **Alerts**: Notify on traffic spikes
5. **Exports**: PDF reports, CSV downloads
6. **Email summaries**: Weekly analytics emails

---

## Support

See detailed guide: **`VISITOR_TRACKING_GUIDE.md`**

Contains:
- Complete setup instructions
- Architecture deep dive
- API documentation
- Customization examples
- Privacy guidelines
- Database queries for cleanup

---

## Database Queries

### Clean up old visitor data (GDPR cleanup)
```sql
DELETE FROM visitor_tracking
WHERE timestamp < NOW() - INTERVAL '90 days';

DELETE FROM visitor_personas
WHERE last_updated < NOW() - INTERVAL '180 days';
```

### Get recent visitors
```sql
SELECT DISTINCT visitor_id, persona_label, COUNT(*) as visits
FROM visitor_personas
ORDER BY last_visit DESC
LIMIT 10;
```

### Get top pages
```sql
SELECT page_url, COUNT(*) as views
FROM visitor_tracking
WHERE is_bot = false
GROUP BY page_url
ORDER BY views DESC
LIMIT 10;
```

---

## Deployment Checklist

- [ ] Run `migrations.sql` in Supabase
- [ ] Test tracking works (visit site, check cookies)
- [ ] Verify analytics dashboard displays data
- [ ] Upload master CV to database
- [ ] Update privacy policy
- [ ] Consider GDPR/compliance needs
- [ ] Test on mobile device
- [ ] Monitor first week of data
- [ ] Customize personas if needed
- [ ] Set data retention policy

---

## Credits

Built with:
- **Supabase** (PostgreSQL database)
- **Next.js 14** (React framework)
- **Recharts** (Analytics charts)
- **Shadcn UI** (Dashboard components)
- **TailwindCSS** (Styling)

Last updated: 2026-03-18
