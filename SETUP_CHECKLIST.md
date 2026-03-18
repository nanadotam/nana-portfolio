# Visitor Tracking System - Setup Checklist

## ⚠️ REQUIRED: Database Setup (Do This First!)

### 1. Run Database Migrations in Supabase

**Time needed: 2 minutes**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `ynihwbuuexxhmssthern`
3. Click **SQL Editor** (left sidebar)
4. Create a new query
5. Copy entire content from `/migrations.sql`
6. Paste into the SQL editor
7. Click **Run** (green button)
8. ✅ Confirm all queries executed successfully

**Verify tables were created:**
- Go to **Table Editor** (left sidebar)
- You should see: `master_cv`, `visitor_tracking`, `visitor_personas`, `visitor_events`

---

## Testing & Verification

### 2. Test Visitor Tracking

**Time needed: 5 minutes**

- [ ] Visit your portfolio homepage
- [ ] Open DevTools (F12 or Cmd+Option+I)
- [ ] Go to **Application** tab → **Cookies** → Select your domain
- [ ] Look for these cookies:
  - `nana_portfolio_visitor_id` (grey circle, 1 year)
  - `nana_portfolio_session_id` (grey circle, 30 min)
- [ ] Both cookies should exist

### 3. Check Analytics Dashboard

**Time needed: 5 minutes**

- [ ] Go to `https://your-domain.com/admin/analytics`
- [ ] Wait 15-20 seconds for data to load
- [ ] You should see your own visitor record appear
- [ ] Check that at least one visitor shows in the personas table

**If no data appears:**
- [ ] Hard-refresh page: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- [ ] Check browser console for errors (F12)
- [ ] Verify migrations ran (check Supabase tables exist)
- [ ] Try visiting a different page and refreshing

---

## Master CV Setup

### 4. Create Master CV JSON

**Time needed: 10-15 minutes**

Create a file: `/public/data/master_cv.json` with this structure:

```json
{
  "personal_info": {
    "name": "Nana Amoako",
    "email": "nana@example.com",
    "phone": "+233-XXX-XXX-XXXX",
    "location": "Accra, Ghana",
    "linkedin": "https://linkedin.com/in/nanadotam",
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
      "achievements": [
        "Achievement 1",
        "Achievement 2"
      ]
    }
  ],
  "education": [
    {
      "institution": "University",
      "degree": "Degree",
      "location": "City",
      "status": "Graduated",
      "start": "2020-09",
      "end": "2024-05"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Description",
      "tech": ["React", "Node.js"],
      "start": "2024-01",
      "end": "2024-03",
      "highlights": ["Achievement"]
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

**Action:** Create this file with your actual data

### 5. Upload CV to Database

**Time needed: 5 minutes**

- [ ] Go to `/admin/master-cv`
- [ ] Click **📤 Upload JSON** button
- [ ] Select your `master_cv.json` file from Step 4
- [ ] JSON should preview in the right panel
- [ ] Click **💾 Save CV**
- [ ] See success message
- [ ] CV is now in database!

---

## Privacy & Compliance

### 6. Add Privacy Disclosure

**Time needed: 10 minutes**

Add to your privacy policy / terms of service:

```
Website Analytics & Visitor Tracking

This website uses cookies to track visitor behavior and collect anonymized analytics:

Cookies Used:
- nana_portfolio_visitor_id: Identifies unique visitors (1 year)
- nana_portfolio_session_id: Identifies individual sessions (30 minutes)

Data Collected:
- IP address (for location and uniqueness detection)
- Browser and operating system information
- Pages visited and time spent on each page
- Scroll depth and interaction patterns
- Device type (mobile, tablet, desktop)

Data NOT Collected:
- Personal identifiable information (names, emails, passwords)
- Financial or sensitive information
- Cross-site tracking

Data Retention:
Visitor data is retained for 90 days and then automatically deleted.

For questions about your data, contact: nana@nanaamoako.dev
```

---

## Advanced Setup (Optional)

### 7. Customize Persona Detection

**Time needed: 5 minutes** (if needed)

Edit `/app/api/visitor/track/route.js`:

Find `updateVisitorPersona()` function and customize the page matching logic:

```javascript
// Add your custom detection here
if (pages.some(p => p.includes('/your-custom-page'))) {
  personaLabel = 'Your Custom Persona';
  confidenceScore = 80;
}
```

---

## Troubleshooting

### Issue: No visitor data appearing in analytics

**Solution:**
1. [ ] Clear browser cache (Cmd+Shift+Delete or Ctrl+Shift+Delete)
2. [ ] Hard-refresh page (Cmd+Shift+R or Ctrl+Shift+R)
3. [ ] Check Supabase → Table Editor → `visitor_tracking` has records
4. [ ] Check browser console (F12) for JavaScript errors
5. [ ] Verify migrations ran successfully (should see all 4 tables)

### Issue: Cookies not appearing

**Solution:**
1. [ ] Make sure HTTPS is enabled (cookies don't work on HTTP)
2. [ ] Check if browser has cookies enabled
3. [ ] Try in incognito mode (rules out extensions)
4. [ ] Check that VisitorTracker is in layout.jsx

### Issue: Analytics page loads slowly

**Solution:**
1. [ ] Use 7-day filter instead of 30/90-day
2. [ ] Check Supabase data usage / query performance
3. [ ] Add index to `visitor_tracking` table:
   ```sql
   CREATE INDEX idx_visitor_tracking_timestamp
   ON visitor_tracking(timestamp DESC);
   ```

---

## Completed Setup Checklist

Copy this checklist and check off items as you complete them:

```
✅ REQUIRED SETUP:
[ ] Ran migrations.sql in Supabase
[ ] Verified all 4 tables created
[ ] Tested visitor tracking (cookies appear)
[ ] Checked analytics dashboard shows data
[ ] Created master_cv.json file
[ ] Uploaded CV to database

✅ OPTIONAL BUT RECOMMENDED:
[ ] Updated privacy policy
[ ] Tested on mobile device
[ ] Customized persona detection (if needed)
[ ] Set data retention policy

✅ PRODUCTION READY:
[ ] All above items completed
[ ] No console errors
[ ] Analytics working properly
[ ] Ready to deploy
```

---

## Documentation References

| Document | Purpose |
|----------|---------|
| `VISITOR_TRACKING_GUIDE.md` | Complete setup guide + customization examples |
| `IMPLEMENTATION_SUMMARY.md` | Technical overview + architecture |
| `migrations.sql` | Database schema (run in Supabase) |

---

## Quick Links

- **Supabase Dashboard**: https://app.supabase.com
- **Analytics Page**: `/admin/analytics`
- **Master CV Manager**: `/admin/master-cv`
- **API Endpoints**: `/api/visitor/{ip,track,update-session}`

---

## Support

If you get stuck:

1. Check `VISITOR_TRACKING_GUIDE.md` → **Troubleshooting** section
2. Look at error messages in browser console (F12)
3. Verify migrations ran in Supabase
4. Check that all files are created in correct locations

**Most common issue**: Forgot to run `migrations.sql` → Tables don't exist → No data saves

---

**Status**: Ready to setup!
**Next step**: Run `migrations.sql` in Supabase (see Step 1 above)
