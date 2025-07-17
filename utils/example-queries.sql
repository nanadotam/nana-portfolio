-- Example SQL Queries for Projects Table
-- Use these queries to test your database operations

-- ============================================================================
-- CREATE (INSERT) OPERATIONS
-- ============================================================================

-- Insert a developer project
INSERT INTO projects (
  name, 
  tagline, 
  description, 
  project_type, 
  year, 
  role, 
  client, 
  team, 
  is_featured, 
  status, 
  sort_order,
  problem,
  solution,
  tools,
  features,
  images,
  live_url,
  github_url,
  json_data
) VALUES (
  'E-Commerce Dashboard',
  'Modern admin dashboard for online stores',
  'A comprehensive dashboard built with React and Node.js that provides real-time analytics, inventory management, and customer insights for e-commerce businesses.',
  'developer',
  '2024',
  'Full-Stack Developer',
  'TechCorp Inc.',
  'Development Team of 3',
  true,
  'live',
  1,
  'E-commerce businesses needed a unified dashboard to manage their operations efficiently.',
  'Built a responsive admin dashboard with real-time data visualization and intuitive user interface.',
  ARRAY['React', 'Node.js', 'PostgreSQL', 'Chart.js', 'Tailwind CSS'],
  ARRAY['Real-time Analytics', 'Inventory Management', 'Customer Dashboard', 'Order Tracking', 'Revenue Reports'],
  ARRAY['/images/ecommerce-1.jpg', '/images/ecommerce-2.jpg'],
  'https://ecommerce-dashboard.example.com',
  'https://github.com/username/ecommerce-dashboard',
  '{"tech_stack": "PERN", "deployment": "Vercel"}'::jsonb
);

-- Insert a designer project
INSERT INTO projects (
  name,
  tagline, 
  description,
  category,
  project_type,
  year,
  role,
  client,
  is_featured,
  status,
  sort_order,
  concept,
  philosophy,
  heading_font,
  body_font,
  colors,
  tools,
  images,
  behance_url,
  case_study_url
) VALUES (
  'Mobile Banking App',
  'Intuitive banking experience for the digital age',
  'A complete redesign of a mobile banking application focusing on user experience, accessibility, and modern design principles.',
  'UI/UX Design',
  'designer',
  '2024',
  'Lead UI/UX Designer',
  'SecureBank',
  true,
  'live',
  2,
  'Creating a seamless and trustworthy digital banking experience that prioritizes user security and ease of use.',
  'Clean, minimal design with strong emphasis on visual hierarchy and accessibility standards.',
  'Inter, SF Pro Display',
  'Inter, system-ui',
  ARRAY['#1a365d', '#2d3748', '#4a5568', '#68d391', '#f7fafc'],
  ARRAY['Figma', 'Adobe XD', 'Principle', 'After Effects'],
  ARRAY['/images/banking-1.jpg', '/images/banking-2.jpg', '/images/banking-3.jpg'],
  'https://behance.net/gallery/banking-app',
  'https://case-study.example.com/banking-app'
);

-- ============================================================================
-- READ (SELECT) OPERATIONS
-- ============================================================================

-- Get all projects
SELECT * FROM projects ORDER BY created_at DESC;

-- Get all developer projects
SELECT * FROM projects 
WHERE project_type = 'developer' 
ORDER BY created_at DESC;

-- Get all designer projects
SELECT * FROM projects 
WHERE project_type = 'designer' 
ORDER BY created_at DESC;

-- Get featured projects only
SELECT * FROM projects 
WHERE is_featured = true 
ORDER BY sort_order ASC;

-- Get projects by status
SELECT * FROM projects 
WHERE status = 'live' 
ORDER BY created_at DESC;

-- Get a specific project by ID (replace with actual UUID)
SELECT * FROM projects 
WHERE id = 'your-project-uuid-here';

-- Search projects by name or description
SELECT * FROM projects 
WHERE name ILIKE '%dashboard%' 
   OR description ILIKE '%dashboard%' 
   OR tagline ILIKE '%dashboard%'
ORDER BY created_at DESC;

-- Get project statistics
SELECT 
  project_type,
  COUNT(*) as total_count,
  COUNT(CASE WHEN status = 'live' THEN 1 END) as live_count,
  COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_count,
  COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_count
FROM projects 
GROUP BY project_type;

-- Get projects with specific tools
SELECT * FROM projects 
WHERE tools && ARRAY['React', 'Node.js']
ORDER BY created_at DESC;

-- Get designer projects by category
SELECT * FROM projects 
WHERE project_type = 'designer' 
  AND category = 'UI/UX Design'
ORDER BY created_at DESC;

-- Get projects from a specific year
SELECT * FROM projects 
WHERE year = '2024' 
ORDER BY created_at DESC;

-- Get projects with images
SELECT * FROM projects 
WHERE images IS NOT NULL 
  AND array_length(images, 1) > 0
ORDER BY created_at DESC;

-- ============================================================================
-- UPDATE OPERATIONS
-- ============================================================================

-- Update project status (replace with actual UUID)
UPDATE projects 
SET status = 'live', updated_at = NOW() 
WHERE id = 'your-project-uuid-here';

-- Toggle featured status (replace with actual UUID)
UPDATE projects 
SET is_featured = NOT is_featured, updated_at = NOW() 
WHERE id = 'your-project-uuid-here';

-- Update project details (replace with actual UUID)
UPDATE projects 
SET 
  name = 'Updated Project Name',
  tagline = 'Updated tagline',
  description = 'Updated description',
  updated_at = NOW()
WHERE id = 'your-project-uuid-here';

-- Add a new tool to an existing project (replace with actual UUID)
UPDATE projects 
SET 
  tools = array_append(tools, 'New Technology'),
  updated_at = NOW()
WHERE id = 'your-project-uuid-here';

-- Add a new image to an existing project (replace with actual UUID)
UPDATE projects 
SET 
  images = array_append(images, '/images/new-image.jpg'),
  updated_at = NOW()
WHERE id = 'your-project-uuid-here';

-- Update sort order for multiple projects
UPDATE projects 
SET sort_order = 0, updated_at = NOW() 
WHERE id = 'first-project-uuid';

UPDATE projects 
SET sort_order = 1, updated_at = NOW() 
WHERE id = 'second-project-uuid';

-- Bulk update status for all draft projects to in-progress
UPDATE projects 
SET status = 'in-progress', updated_at = NOW() 
WHERE status = 'draft';

-- ============================================================================
-- DELETE OPERATIONS
-- ============================================================================

-- Delete a specific project (replace with actual UUID)
DELETE FROM projects 
WHERE id = 'your-project-uuid-here';

-- Delete all draft projects
DELETE FROM projects 
WHERE status = 'draft';

-- Delete projects older than a certain date
DELETE FROM projects 
WHERE created_at < '2023-01-01';

-- Delete designer projects by category
DELETE FROM projects 
WHERE project_type = 'designer' 
  AND category = 'Old Category';

-- ============================================================================
-- ADVANCED QUERIES
-- ============================================================================

-- Get projects with their image count
SELECT 
  id,
  name,
  project_type,
  status,
  CASE 
    WHEN images IS NULL THEN 0
    ELSE array_length(images, 1)
  END as image_count
FROM projects
ORDER BY image_count DESC;

-- Get most used tools across all projects
SELECT 
  unnest(tools) as tool,
  COUNT(*) as usage_count
FROM projects 
WHERE tools IS NOT NULL
GROUP BY tool
ORDER BY usage_count DESC
LIMIT 10;

-- Get projects by year with counts
SELECT 
  year,
  project_type,
  COUNT(*) as project_count
FROM projects
GROUP BY year, project_type
ORDER BY year DESC, project_type;

-- Get featured projects by type
SELECT 
  project_type,
  COUNT(*) as featured_count,
  array_agg(name ORDER BY sort_order) as featured_projects
FROM projects 
WHERE is_featured = true
GROUP BY project_type;

-- Find projects without certain required fields
SELECT 
  id,
  name,
  project_type,
  CASE 
    WHEN live_url IS NULL OR live_url = '' THEN 'Missing live URL'
    WHEN tools IS NULL OR array_length(tools, 1) = 0 THEN 'Missing tools'
    WHEN images IS NULL OR array_length(images, 1) = 0 THEN 'Missing images'
    ELSE 'Complete'
  END as status_check
FROM projects
WHERE 
  live_url IS NULL OR live_url = '' OR
  tools IS NULL OR array_length(tools, 1) = 0 OR
  images IS NULL OR array_length(images, 1) = 0;

-- Get project completion percentage
WITH project_completeness AS (
  SELECT 
    id,
    name,
    project_type,
    (
      CASE WHEN name IS NOT NULL AND name != '' THEN 1 ELSE 0 END +
      CASE WHEN description IS NOT NULL AND description != '' THEN 1 ELSE 0 END +
      CASE WHEN live_url IS NOT NULL AND live_url != '' THEN 1 ELSE 0 END +
      CASE WHEN tools IS NOT NULL AND array_length(tools, 1) > 0 THEN 1 ELSE 0 END +
      CASE WHEN images IS NOT NULL AND array_length(images, 1) > 0 THEN 1 ELSE 0 END
    ) * 20 as completion_percentage
  FROM projects
)
SELECT 
  id,
  name,
  project_type,
  completion_percentage,
  CASE 
    WHEN completion_percentage = 100 THEN 'Complete'
    WHEN completion_percentage >= 80 THEN 'Almost Complete'
    WHEN completion_percentage >= 60 THEN 'Partially Complete'
    ELSE 'Needs Work'
  END as completion_status
FROM project_completeness
ORDER BY completion_percentage DESC;

-- ============================================================================
-- MAINTENANCE QUERIES
-- ============================================================================

-- Update all updated_at timestamps to now (useful for data migration)
UPDATE projects SET updated_at = NOW();

-- Clean up empty array fields
UPDATE projects 
SET 
  tools = CASE WHEN tools = '{}' THEN NULL ELSE tools END,
  features = CASE WHEN features = '{}' THEN NULL ELSE features END,
  images = CASE WHEN images = '{}' THEN NULL ELSE images END,
  colors = CASE WHEN colors = '{}' THEN NULL ELSE colors END;

-- Ensure all projects have a sort_order
UPDATE projects 
SET sort_order = 0 
WHERE sort_order IS NULL;

-- Backup projects before major changes
CREATE TABLE projects_backup AS 
SELECT * FROM projects 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';

-- ============================================================================
-- USEFUL VIEWS
-- ============================================================================

-- Create a view for public projects (live status only)
CREATE OR REPLACE VIEW public_projects AS
SELECT 
  id,
  name,
  tagline,
  description,
  category,
  project_type,
  year,
  role,
  client,
  is_featured,
  sort_order,
  tools,
  features,
  images,
  live_url,
  github_url,
  case_study_url,
  behance_url,
  created_at
FROM projects 
WHERE status = 'live'
ORDER BY 
  is_featured DESC,
  sort_order ASC,
  created_at DESC;

-- Create a view for project summary statistics
CREATE OR REPLACE VIEW project_stats AS
SELECT 
  COUNT(*) as total_projects,
  COUNT(CASE WHEN project_type = 'developer' THEN 1 END) as developer_projects,
  COUNT(CASE WHEN project_type = 'designer' THEN 1 END) as designer_projects,
  COUNT(CASE WHEN status = 'live' THEN 1 END) as live_projects,
  COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_projects,
  COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_projects,
  ROUND(AVG(CASE 
    WHEN images IS NOT NULL 
    THEN array_length(images, 1) 
    ELSE 0 
  END), 2) as avg_images_per_project
FROM projects; 