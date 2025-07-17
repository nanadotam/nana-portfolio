"use client"

import { useState, useEffect } from 'react';
import { createClient } from '../../utils/supabase/client';

export default function Projects({ onProjectSelect, projectType = null }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const supabase = createClient();
        
        let query = supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true });
        
        // Filter by project type if specified
        if (projectType) {
          query = query.eq('project_type', projectType);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [projectType]);

  const gradientImages = [
    "https://images.unsplash.com/photo-1614854262409-bc319cba5802?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1614850715973-58c3167b30a0?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1614850523527-08bd62441994?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1614851099507-f1a93001d984?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1614849286521-4c58b2f0ff15?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  if (loading) {
    return (
      <section id="projects" className="project-section">
        <h2 className="h2">Projects</h2>
        <div className="project-list" style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <div style={{ 
            color: '#666', 
            fontSize: '16px',
            fontFamily: 'JetBrains Mono, monospace'
          }}>
            Loading projects...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="project-section">
        <h2 className="h2">Projects</h2>
        <div className="project-list" style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <div style={{ 
            color: '#ef4444', 
            fontSize: '16px',
            fontFamily: 'JetBrains Mono, monospace'
          }}>
            Error loading projects: {error}
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section id="projects" className="project-section">
        <h2 className="h2">Projects</h2>
        <div className="project-list" style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <div style={{ 
            color: '#666', 
            fontSize: '16px',
            fontFamily: 'JetBrains Mono, monospace'
          }}>
            No projects found.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="project-section">
      <h2 className="h2">Projects</h2>
      <div className="project-list" id="repo-container">
        {projects.map((project, index) => (
          <div 
            key={project.id} 
            className="project-card"
            onClick={() => onProjectSelect(project)}
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            <div
              className="project-image"
              style={{
                backgroundImage: project.images && project.images.length > 0 
                  ? `url('${project.images[0]}')` 
                  : `url('${gradientImages[index % gradientImages.length]}')`,
              }}
            />
            
            {/* Hover Overlay */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                opacity: 0,
                transform: 'translateY(100%)',
                transition: 'all 0.5s ease',
                borderRadius: 'inherit',
                zIndex: 2
              }}
              className="project-hover-overlay"
            >
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '24px',
                color: 'white'
              }}>
                {/* Year and Role */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                  opacity: 0,
                  transform: 'translateY(20px)',
                  transition: 'all 0.7s ease 0.1s'
                }} className="overlay-year-role">
                  <span style={{
                    fontSize: '14px',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: '#4ade80',
                    backgroundColor: 'rgba(74, 222, 128, 0.1)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(74, 222, 128, 0.3)'
                  }}>
                    {project.year}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: '#d1d5db',
                    fontWeight: '300'
                  }}>
                    {project.role}
                  </span>
                </div>

                {/* Project Name */}
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  opacity: 0,
                  transform: 'translateY(20px)',
                  transition: 'all 0.7s ease 0.2s'
                }} className="overlay-title">
                  {project.name}
                </h3>

                {/* Tagline */}
                <p style={{
                  fontSize: '14px',
                  color: '#d1d5db',
                  marginBottom: '16px',
                  opacity: 0,
                  transform: 'translateY(20px)',
                  transition: 'all 0.7s ease 0.3s'
                }} className="overlay-tagline">
                  {project.tagline}
                </p>

                {/* Tech Stack */}
                <div style={{
                  marginBottom: '16px',
                  opacity: 0,
                  transform: 'translateY(20px)',
                  transition: 'all 0.7s ease 0.4s'
                }} className="overlay-tech">
                  <div style={{
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: '#9ca3af',
                    marginBottom: '8px'
                  }}>
                    TECH STACK
                  </div>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px'
                  }}>
                    {project.tools?.slice(0, 4).map((tool, i) => (
                      <span 
                        key={i} 
                        style={{
                          fontSize: '12px',
                          padding: '4px 8px',
                          backgroundColor: 'rgba(59, 130, 246, 0.2)',
                          color: '#93c5fd',
                          borderRadius: '4px',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          fontFamily: 'JetBrains Mono, monospace'
                        }}
                      >
                        {tool}
                      </span>
                    ))}
                    {project.tools?.length > 4 && (
                      <span style={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        backgroundColor: 'rgba(107, 114, 128, 0.2)',
                        color: '#d1d5db',
                        borderRadius: '4px',
                        border: '1px solid rgba(107, 114, 128, 0.3)',
                        fontFamily: 'JetBrains Mono, monospace'
                      }}>
                        +{project.tools.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div style={{
                  opacity: 0,
                  transform: 'translateY(20px)',
                  transition: 'all 0.7s ease 0.5s',
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap'
                }} className="overlay-cta">
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    backgroundColor: '#000000',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <span>Click to see more</span>
                    <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  
                  {/* GitHub Button */}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        backgroundColor: '#1f2937',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: '1px solid rgba(75, 85, 99, 0.5)',
                        color: 'white',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#374151';
                        e.target.style.borderColor = 'rgba(107, 114, 128, 0.7)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#1f2937';
                        e.target.style.borderColor = 'rgba(75, 85, 99, 0.5)';
                      }}
                    >
                      <svg style={{ width: '16px', height: '16px' }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="project-details">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .project-card:hover .project-hover-overlay {
          opacity: 1 !important;
          transform: translateY(0%) !important;
        }
        
        .project-card:hover .overlay-year-role,
        .project-card:hover .overlay-title,
        .project-card:hover .overlay-tagline,
        .project-card:hover .overlay-tech,
        .project-card:hover .overlay-cta {
          opacity: 1 !important;
          transform: translateY(0px) !important;
        }
      `}</style>
    </section>
  );
}
