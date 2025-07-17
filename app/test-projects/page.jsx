import { createClient } from '../../utils/supabase/server';

export default async function TestProjects() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase.from('projects').select();

  if (error) {
    return (
      <div style={{ padding: '40px', fontFamily: 'monospace' }}>
        <h1>Supabase Connection Test</h1>
        <p style={{ color: 'red' }}>Error: {error.message}</p>
        <p>Make sure you have:</p>
        <ul>
          <li>Created your .env.local file with the correct Supabase credentials</li>
          <li>Created the projects table in your Supabase database</li>
          <li>Set up the proper RLS policies</li>
        </ul>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <h1>Supabase Connection Test</h1>
      <p style={{ color: 'green' }}>✅ Successfully connected to Supabase!</p>
      <p>Found {projects?.length || 0} projects in database.</p>
      
      {projects && projects.length > 0 ? (
        <div>
          <h2>Projects:</h2>
          <pre style={{ background: '#f5f5f5', padding: '20px', overflow: 'auto' }}>
            {JSON.stringify(projects, null, 2)}
          </pre>
        </div>
      ) : (
        <div>
          <p>No projects found. You can add some sample data using the SQL below:</p>
          <details>
            <summary>Click to see sample INSERT statements</summary>
            <pre style={{ background: '#f5f5f5', padding: '20px', overflow: 'auto', marginTop: '10px' }}>
{`-- Sample developer project
INSERT INTO projects (
  name, tagline, description, project_type, year, role, tools, 
  problem, solution, features, live_url, github_url, is_featured
) VALUES (
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
  true
);

-- Sample designer project
INSERT INTO projects (
  name, tagline, description, project_type, year, role, category,
  concept, philosophy, colors, tools, images, behance_url, is_featured
) VALUES (
  'Brand Identity Design',
  'Modern visual identity for tech startup',
  'Comprehensive brand identity design including logo, color palette, and visual guidelines.',
  'designer',
  '2024',
  'Visual Designer',
  'Branding',
  'Clean, modern aesthetic that reflects innovation and trustworthiness',
  'Less is more - focus on clarity and impact',
  ARRAY['#1a1a1a', '#ffffff', '#3b82f6', '#10b981'],
  ARRAY['Figma', 'Adobe Illustrator', 'Adobe Photoshop'],
  ARRAY['https://via.placeholder.com/800x600'],
  'https://behance.net/project',
  true
);`}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
} 