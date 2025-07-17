-- Supabase setup for Nana's Portfolio
-- Run this in your Supabase SQL editor

-- Create the projects table (from DB.sql)
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Info
  name text NOT NULL,
  tagline text,
  description text NOT NULL,
  category text, -- designer projects
  project_type text NOT NULL CHECK (project_type IN ('developer', 'designer')),

  -- Metadata
  year text NOT NULL,
  role text NOT NULL,
  client text,
  team text,
  is_featured boolean DEFAULT false,
  status text DEFAULT 'completed', -- e.g. completed, draft, in-progress
  sort_order integer DEFAULT 0,

  -- Developer/Designer specific
  problem text,
  solution text,
  concept text,
  philosophy text,
  heading_font text,
  body_font text,
  colors text[],
  tools text[],
  features text[],
  images text[],

  -- Links
  live_url text,
  github_url text,
  case_study_url text,
  behance_url text,

  -- Flexible catch-all
  json_data jsonb,

  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_year ON projects(year);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order);

-- Enable RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "public_read_projects" 
ON projects 
FOR SELECT 
TO anon 
USING (true);

-- Create policy to allow authenticated users to read projects
CREATE POLICY "authenticated_read_projects" 
ON projects 
FOR SELECT 
TO authenticated 
USING (true);

-- Optional: Create policies for authenticated users to insert/update/delete
-- (Uncomment these if you want authenticated users to be able to modify projects)
/*
CREATE POLICY "authenticated_insert_projects" 
ON projects 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "authenticated_update_projects" 
ON projects 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "authenticated_delete_projects" 
ON projects 
FOR DELETE 
TO authenticated 
USING (true);
*/

-- Insert sample developer projects
INSERT INTO projects (
  name, tagline, description, project_type, year, role, tools, 
  problem, solution, features, live_url, github_url, is_featured, sort_order
) VALUES 
(
  'NanoClip',
  'Universal clipboard for seamless device-to-device transfers',
  'A file transfer and universal clipboard sharing platform that allows you to send files from device to device similar to AirDrop.',
  'developer',
  '2024',
  'Full-Stack Developer',
  ARRAY['React', 'Node.js', 'Socket.io', 'Express', 'MongoDB'],
  'Traditional file sharing methods are cumbersome and require multiple steps, making quick transfers between devices inefficient.',
  'Built a real-time platform that enables instant file and text sharing across devices using WebRTC and WebSocket connections.',
  ARRAY['Real-time file transfers without size limits', 'Universal clipboard synchronization', 'Cross-platform compatibility'],
  'https://nanoclip.vercel.app',
  'https://github.com/nanadotam/nanoclip',
  true,
  1
),
(
  'DSA File Explorers: Virtual File Management',
  'Advanced file system with CLI and GUI interfaces',
  'A file management system with CLI and GUI built using Java.',
  'developer',
  '2023',
  'Lead Developer',
  ARRAY['Java', 'Swing', 'Data Structures', 'Algorithms'],
  'Students needed hands-on experience with file system operations and data structure implementations.',
  'Developed a comprehensive file management system that demonstrates key DSA concepts through practical application.',
  ARRAY['Command-line and graphical interfaces', 'Advanced search and sorting algorithms', 'Custom data structure implementations'],
  'https://github.com/nanadotam/DSA-File-Explorers',
  'https://github.com/nanadotam/DSA-File-Explorers',
  true,
  2
),
(
  'Kumi: Making Learning Fun',
  'Gamified educational platform for collaborative learning',
  'An educational platform for collaborative learning.',
  'developer',
  '2023',
  'UI/UX Designer & Frontend Developer',
  ARRAY['React', 'Node.js', 'MongoDB', 'Socket.io'],
  'Traditional learning platforms lack engagement and collaborative features for students.',
  'Built an interactive platform that gamifies learning through collaborative challenges and real-time interaction.',
  ARRAY['Gamified learning modules', 'Real-time collaboration tools', 'Progress tracking and rewards system'],
  'https://github.com/nanadotam/kumi_fcln',
  'https://github.com/nanadotam/kumi_fcln',
  true,
  3
);

-- Insert sample designer projects
INSERT INTO projects (
  name, tagline, description, project_type, year, role, category,
  concept, philosophy, colors, tools, features, behance_url, is_featured, sort_order
) VALUES 
(
  'Brand Identity System',
  'Modern visual identity for tech startup',
  'Complete visual identity for a sustainable fashion startup featuring modern typography and cohesive color palette.',
  'designer',
  '2024',
  'Brand Designer',
  'Branding',
  'Creating a fresh, approachable identity that reflects innovation and trustworthiness.',
  'Great branding creates emotional connections that transcend the product itself.',
  ARRAY['#66BB6A', '#FFA726', '#42A5F5', '#26A69A'],
  ARRAY['Figma', 'Adobe Illustrator', 'Adobe Photoshop'],
  ARRAY['Comprehensive logo system', 'Typography hierarchy', 'Color palette development', 'Brand guidelines'],
  'https://behance.net/project',
  true,
  1
),
(
  'Mobile App UI/UX',
  'Intuitive meditation app with calming user experience',
  'Intuitive meditation app with calming user experience and seamless interaction design.',
  'designer',
  '2024',
  'UX/UI Designer',
  'Mobile Design',
  'Designing a digital sanctuary that promotes mindfulness through thoughtful interactions.',
  'Technology should enhance human well-being, not detract from it.',
  ARRAY['#E8F5E8', '#B8E6B8', '#4A90A4', '#2C3E50'],
  ARRAY['Figma', 'Principle', 'Sketch'],
  ARRAY['User research & personas', 'Wireframing & prototyping', 'Visual design system', 'Micro-interactions'],
  'https://behance.net/project2',
  true,
  2
);

-- Success message
SELECT 'Supabase setup complete! Your projects table is ready.' as message; 