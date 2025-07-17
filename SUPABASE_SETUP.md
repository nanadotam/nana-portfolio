# Supabase Setup for Nana's Portfolio

This guide will help you set up Supabase integration for your portfolio website, allowing you to manage your projects dynamically through a database.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Your Next.js portfolio project running locally

## Step 1: Create a Supabase Project

1. Go to [database.new](https://database.new) or your Supabase dashboard
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `nano-portfolio` (or your preferred name)
   - **Database Password**: Create a secure password
   - **Region**: Choose the closest to your users

Wait for the project to be created (usually 1-2 minutes).

## Step 2: Get Your Project Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Public anon key** (starts with `eyJ`)

## Step 3: Set Up Environment Variables

Create a `.env.local` file in your project root and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Replace** `your_project_url_here` and `your_anon_key_here` with the actual values from Step 2.

## Step 4: Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `setup-supabase.sql` from your project
3. Paste it into the SQL Editor
4. Click **Run** to execute the script

This will:
- Create the `projects` table with all necessary fields
- Set up Row Level Security (RLS) policies for public read access
- Insert sample project data
- Create appropriate database indexes

## Step 5: Verify the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/test-projects` to test the connection

3. If successful, you should see:
   - ✅ Successfully connected to Supabase!
   - A list of sample projects from the database

## Step 6: View Your Projects

Now your portfolio will dynamically load projects from Supabase:

- **Developer projects**: `/developer` - Shows only projects with `project_type = 'developer'`
- **Designer projects**: `/designer` - Shows only projects with `project_type = 'designer'`
- **All projects**: The main portfolio page shows all projects

## Adding Your Own Projects

### Option 1: Using Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase dashboard
2. Navigate to **Table Editor** → **projects**
3. Click **Insert** → **Insert row**
4. Fill in your project details
5. Click **Save**

### Option 2: Using SQL

In the Supabase SQL Editor, run INSERT statements like:

```sql
INSERT INTO projects (
  name, tagline, description, project_type, year, role, tools,
  problem, solution, features, live_url, github_url, is_featured
) VALUES (
  'Your Project Name',
  'Your tagline',
  'Detailed description of your project',
  'developer', -- or 'designer'
  '2024',
  'Your Role',
  ARRAY['React', 'Node.js', 'Other', 'Tools'],
  'What problem did this solve?',
  'How did you solve it?',
  ARRAY['Feature 1', 'Feature 2', 'Feature 3'],
  'https://your-live-site.com',
  'https://github.com/yourusername/repo',
  true -- is this a featured project?
);
```

## Project Schema Reference

The `projects` table supports both developer and designer projects with these key fields:

### Common Fields
- `name` (required): Project title
- `tagline`: Short description
- `description` (required): Detailed description
- `project_type` (required): 'developer' or 'designer'
- `year` (required): Project year
- `role` (required): Your role in the project
- `is_featured`: Whether to feature this project
- `sort_order`: Display order (lower numbers first)

### Developer-Specific Fields
- `tools`: Array of technologies used
- `problem`: Problem statement
- `solution`: How you solved it
- `features`: Array of key features
- `live_url`: Live demo URL
- `github_url`: GitHub repository URL

### Designer-Specific Fields
- `category`: Design category (e.g., 'Branding', 'UI/UX')
- `concept`: Design concept
- `philosophy`: Design philosophy
- `colors`: Array of color codes
- `heading_font`: Primary font
- `body_font`: Secondary font
- `behance_url`: Behance project URL
- `case_study_url`: Case study URL
- `images`: Array of image URLs

## Troubleshooting

### Connection Issues
1. **Double-check your `.env.local` file**:
   - Ensure no extra spaces
   - Ensure the file is in your project root
   - Restart your dev server after changes

2. **RLS Policies**: If you get permission errors, ensure the RLS policies were created correctly

3. **Project URL/Key**: Verify you're using the correct project URL and anon key from your Supabase dashboard

### No Projects Showing
1. Check if data was inserted: Go to **Table Editor** → **projects** in Supabase
2. Verify the `project_type` field matches what you're filtering for
3. Check the browser console for any error messages

### Need Help?
- Check the Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Visit the test page: `http://localhost:3000/test-projects`
- Check your browser's developer console for error messages

## Next Steps

Once everything is working:

1. **Delete the test page**: Remove `app/test-projects/page.jsx`
2. **Customize your projects**: Replace the sample data with your actual projects
3. **Add images**: Upload project images and update the `images` array fields
4. **Deploy**: Your portfolio will work the same way in production

## Security Note

The current setup allows public read access to your projects table, which is perfect for a portfolio website. The anon key is safe to expose in your frontend code as it only has read permissions by default.

If you need to add admin functionality later (adding/editing projects through your website), you'll need to implement authentication and update the RLS policies accordingly. 