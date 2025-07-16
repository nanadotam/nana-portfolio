"use client"

export default function Projects({ onProjectSelect }) {
  const featuredRepos = [
    {
      name: "NanoClip",
      tagline: "Universal clipboard for seamless device-to-device transfers",
      description: "A file transfer and universal clipboard sharing platform that allows you to send files from device to device similar to AirDrop.",
      year: "2024",
      role: "Full-Stack Developer",
      tools: ["React", "Node.js", "Socket.io", "Express", "MongoDB"],
      team: "Solo project",
      problem: "Traditional file sharing methods are cumbersome and require multiple steps, making quick transfers between devices inefficient.",
      solution: "Built a real-time platform that enables instant file and text sharing across devices using WebRTC and WebSocket connections.",
      features: [
        "Real-time file transfers without size limits",
        "Universal clipboard synchronization",
        "Cross-platform compatibility"
      ],
      images: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop"
      ],
      url: "https://nanoclip.vercel.app",
      github: "https://github.com/nanadotam/nanoclip",
    },
    {
      name: "DSA File Explorers: Virtual File Management",
      tagline: "Advanced file system with CLI and GUI interfaces",
      description: "A file management system with CLI and GUI built using Java.",
      year: "2023",
      role: "Lead Developer",
      tools: ["Java", "Swing", "Data Structures", "Algorithms"],
      team: "4-person team",
      problem: "Students needed hands-on experience with file system operations and data structure implementations.",
      solution: "Developed a comprehensive file management system that demonstrates key DSA concepts through practical application.",
      features: [
        "Command-line and graphical interfaces",
        "Advanced search and sorting algorithms",
        "Custom data structure implementations"
      ],
      images: [
        "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=500&h=300&fit=crop"
      ],
      url: "https://github.com/nanadotam/DSA-File-Explorers",
      github: "https://github.com/nanadotam/DSA-File-Explorers",
    },
    {
      name: "Ashesi Parking Management System",
      tagline: "Smart parking solution for campus management",
      description: "Advanced property management system for real estate.",
      year: "2023",
      role: "Full-Stack Developer",
      tools: ["PHP", "MySQL", "Bootstrap", "JavaScript"],
      team: "3-person team",
      problem: "Campus parking was chaotic with no system to track availability or manage reservations.",
      solution: "Created a comprehensive parking management system with real-time tracking and automated allocation.",
      features: [
        "Real-time parking space monitoring",
        "Automated reservation system",
        "Admin dashboard with analytics"
      ],
      url: "https://github.com/nanadotam/apms",
      github: "https://github.com/nanadotam/apms",
    },
    {
      name: "Kumi: Making Learning Fun",
      tagline: "Gamified educational platform for collaborative learning",
      description: "An educational platform for collaborative learning.",
      year: "2023",
      role: "UI/UX Designer & Frontend Developer",
      tools: ["React", "Node.js", "MongoDB", "Socket.io"],
      team: "5-person team",
      problem: "Traditional learning platforms lack engagement and collaborative features for students.",
      solution: "Built an interactive platform that gamifies learning through collaborative challenges and real-time interaction.",
      features: [
        "Gamified learning modules",
        "Real-time collaboration tools",
        "Progress tracking and rewards system"
      ],
      images: [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&h=300&fit=crop"
      ],
      url: "https://github.com/nanadotam/kumi_fcln",
      github: "https://github.com/nanadotam/kumi_fcln",
    },
    {
      name: "Recifree: Free Recipes",
      tagline: "Community-driven recipe sharing platform",
      description: "A recipe sharing platform with admin dashboard features.",
      year: "2022",
      role: "Full-Stack Developer",
      tools: ["React", "Node.js", "Express", "MongoDB"],
      team: "Solo project",
      problem: "Finding quality, free recipes online is difficult due to paywalls and poor organization.",
      solution: "Created a community platform where users can share, rate, and discover recipes with powerful search features.",
      features: [
        "Community recipe sharing",
        "Advanced search and filtering",
        "User ratings and reviews system"
      ],
      url: "https://github.com/nanadotam/Recifree",
      github: "https://github.com/nanadotam/Recifree",
    },
    {
      name: "Volume Gesture Control App",
      tagline: "Control your computer volume with hand gestures",
      description: "Control volume with hand gestures using computer vision.",
      year: "2022",
      role: "Computer Vision Developer",
      tools: ["Python", "OpenCV", "MediaPipe", "NumPy"],
      team: "Solo project",
      problem: "Physical volume controls are inconvenient when working from a distance or during presentations.",
      solution: "Developed a hands-free volume control system using computer vision and gesture recognition.",
      features: [
        "Real-time hand gesture recognition",
        "Smooth volume adjustment",
        "Customizable gesture settings"
      ],
      url: "https://github.com/nanadotam/volume-gesture-control",
      github: "https://github.com/nanadotam/volume-gesture-control",
    },
    {
      name: "Cocoa Price Prediction App",
      tagline: "AI-powered cocoa market price forecasting",
      description: "Machine learning model to predict cocoa market prices.",
      year: "2022",
      role: "Data Scientist & ML Engineer",
      tools: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
      team: "Solo project",
      problem: "Farmers and traders need accurate price predictions to make informed decisions in the cocoa market.",
      solution: "Built a machine learning model that analyzes historical data to predict future cocoa price trends.",
      features: [
        "Time series forecasting model",
        "Interactive data visualizations",
        "Historical price trend analysis"
      ],
      url: "https://github.com/nanadotam/Cocoa-Price-Prediction",
      github: "https://github.com/nanadotam/Cocoa-Price-Prediction",
    },
    {
      name: "text clock by nanaamoako",
      tagline: "Creative text-based clock with dynamic animations",
      description: "A creative text-based clock implemented with JavaScript.",
      year: "2021",
      role: "Frontend Developer",
      tools: ["JavaScript", "CSS3", "HTML5"],
      team: "Solo project",
      problem: "Traditional digital clocks lack personality and creative expression.",
      solution: "Designed an artistic clock that displays time through animated text with smooth transitions.",
      features: [
        "Dynamic text animations",
        "Customizable color schemes",
        "Responsive design"
      ],
      url: "https://github.com/nanadotam/text-clock-by-nanaamoako",
      github: "https://github.com/nanadotam/text-clock-by-nanaamoako",
    },
    {
      name: "Personal Pomodoro Timer",
      tagline: "Productivity-focused timer with customizable work sessions",
      description: "A custom Pomodoro timer for productivity enthusiasts.",
      year: "2021",
      role: "Frontend Developer",
      tools: ["JavaScript", "CSS3", "HTML5", "Local Storage"],
      team: "Solo project",
      problem: "Existing Pomodoro apps lack customization and distract users with unnecessary features.",
      solution: "Created a minimalist, highly customizable timer focused solely on productivity enhancement.",
      features: [
        "Customizable work/break intervals",
        "Session history tracking",
        "Minimalist, distraction-free interface"
      ],
      url: "https://github.com/nanadotam/personal-pomodoro-timer",
      github: "https://github.com/nanadotam/personal-pomodoro-timer",
    },
  ]

  const gradientImages = [
    "https://images.unsplash.com/photo-1614854262409-bc319cba5802?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1614850715973-58c3167b30a0?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1614850523527-08bd62441994?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1614851099507-f1a93001d984?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1614849286521-4c58b2f0ff15?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ]

  return (
    <section id="projects" className="project-section">
      <h2 className="h2">Projects</h2>
      <div className="project-list" id="repo-container">
        {featuredRepos.map((repo, index) => (
          <div 
            key={index} 
            className="project-card"
            onClick={() => onProjectSelect(repo)}
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            <div
              className="project-image"
              style={{
                backgroundImage: `url('${gradientImages[index % gradientImages.length]}')`,
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
                    {repo.year}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: '#d1d5db',
                    fontWeight: '300'
                  }}>
                    {repo.role}
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
                  {repo.name}
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
                  {repo.tagline}
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
                    {repo.tools?.slice(0, 4).map((tool, i) => (
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
                    {repo.tools?.length > 4 && (
                      <span style={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        backgroundColor: 'rgba(107, 114, 128, 0.2)',
                        color: '#d1d5db',
                        borderRadius: '4px',
                        border: '1px solid rgba(107, 114, 128, 0.3)',
                        fontFamily: 'JetBrains Mono, monospace'
                      }}>
                        +{repo.tools.length - 4}
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
                  {repo.github && (
                    <a
                      href={repo.github}
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
              <h3>{repo.name}</h3>
              <p>{repo.description}</p>
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
  )
}
