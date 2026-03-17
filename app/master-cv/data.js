// Synthetic Master CV data for frontend development
// This will be replaced with MongoDB data in the backend phase

export const masterCVData = [
  // ─── WORK EXPERIENCE ───────────────────────────────────────
  {
    id: "we-1",
    category: "work_experience",
    title: "Software Engineering Intern",
    organization: "Microsoft",
    role: "Frontend Developer",
    location: "Redmond, WA",
    duration: { start: "2025-06-01", end: "2025-08-31", is_current: false },
    description:
      "Worked on the Azure Portal team, building new dashboard components for enterprise customers. Led the redesign of the resource monitoring widget, improving data visualization clarity and reducing load times by 35%. Collaborated with a cross-functional team of 8 engineers across 3 time zones.",
    achievements: [
      "Redesigned resource monitoring widget used by 50,000+ enterprise customers",
      "Reduced dashboard load time by 35% through code splitting and lazy loading",
      "Implemented real-time data streaming with WebSocket connections",
      "Presented intern project to VP of Engineering, received top rating",
    ],
    skills_tools: ["React", "TypeScript", "Azure", "GraphQL", "D3.js", "WebSockets"],
    images: [
      { url: "/images/me-working/me-working2.jpeg", caption: "At Microsoft Campus", alt: "Working at Microsoft" },
    ],
    references: [
      { name: "Sarah Chen", role: "Engineering Manager", relationship: "Direct supervisor" },
      { name: "James Liu", role: "Senior Software Engineer", relationship: "Mentor" },
    ],
    links: { live_url: "https://portal.azure.com", github_url: null },
    impact_rating: 9,
    is_visible: true,
    sort_order: 1,
    tags: ["internship", "frontend", "big-tech", "enterprise"],
  },
  {
    id: "we-2",
    category: "work_experience",
    title: "UI/UX Design Lead",
    organization: "Ashesi University",
    role: "Lead Designer",
    location: "Berekuso, Ghana",
    duration: { start: "2024-09-01", end: "2025-05-30", is_current: false },
    description:
      "Led the design team for the university's student portal redesign. Conducted user research with 500+ students, created a comprehensive design system, and delivered a fully responsive prototype that was adopted by the IT department for implementation.",
    achievements: [
      "Led a team of 5 designers through the full design process",
      "Conducted user research with 500+ students and 30 faculty members",
      "Created a design system with 120+ reusable components",
      "Reduced student portal task completion time by 45%",
    ],
    skills_tools: ["Figma", "Design Systems", "User Research", "Prototyping", "Usability Testing"],
    images: [
      { url: "/images/CREATIVE-PROCESS.jpeg", caption: "Design process", alt: "Creative process" },
    ],
    references: [
      { name: "Dr. Ayorkor Korsah", role: "Head of CS Department", relationship: "Faculty advisor" },
    ],
    links: { case_study: "https://behance.net/nanaamoako" },
    impact_rating: 8,
    is_visible: true,
    sort_order: 2,
    tags: ["design", "leadership", "university", "ux-research"],
  },
  {
    id: "we-3",
    category: "work_experience",
    title: "Full-Stack Developer",
    organization: "Turntabl",
    role: "Junior Developer",
    location: "Accra, Ghana",
    duration: { start: "2024-06-01", end: "2024-08-31", is_current: false },
    description:
      "Developed features for enterprise client management platforms. Built RESTful APIs with Spring Boot and interactive dashboards with React. Participated in agile sprints, code reviews, and pair programming sessions with senior developers.",
    achievements: [
      "Shipped 12 features across 3 sprint cycles",
      "Built a client analytics dashboard serving 200+ daily active users",
      "Reduced API response times by 28% through query optimization",
      "Mentored 2 new interns during onboarding",
    ],
    skills_tools: ["React", "Spring Boot", "Java", "PostgreSQL", "REST APIs", "Docker"],
    images: [],
    references: [
      { name: "Kofi Mensah", role: "Tech Lead", relationship: "Team lead" },
    ],
    links: { github_url: "https://github.com/nanadotam" },
    impact_rating: 7,
    is_visible: true,
    sort_order: 3,
    tags: ["internship", "fullstack", "enterprise", "agile"],
  },
  {
    id: "we-4",
    category: "work_experience",
    title: "Creative Director",
    organization: "Uncle Settings Media",
    role: "Founder & Creative Director",
    location: "Accra, Ghana",
    duration: { start: "2023-01-01", end: null, is_current: true },
    description:
      "Founded and lead a creative brand focused on content creation, brand strategy, and digital design. Manage all aspects of brand identity, social media content, and client partnerships. Built a following of 15,000+ across TikTok and Instagram.",
    achievements: [
      "Built brand following of 15,000+ across social platforms",
      "Completed 20+ brand identity projects for local businesses",
      "Created viral content reaching 500,000+ cumulative views",
      "Established partnerships with 5 major lifestyle brands",
    ],
    skills_tools: ["Brand Strategy", "Content Creation", "Adobe Suite", "Social Media", "Video Production"],
    images: [
      { url: "/images/me-working/me-working3 Large.jpeg", caption: "Behind the scenes", alt: "Content creation" },
    ],
    references: [],
    links: {},
    impact_rating: 9,
    is_visible: true,
    sort_order: 4,
    tags: ["entrepreneurship", "creative", "branding", "social-media"],
  },

  // ─── PROJECTS ──────────────────────────────────────────────
  {
    id: "pj-1",
    category: "project",
    title: "NanoClip",
    organization: "Personal Project",
    role: "Solo Developer",
    location: "Remote",
    duration: { start: "2025-01-01", end: "2025-03-01", is_current: false },
    description:
      "A modern clipboard manager built with Electron and React. Features include clipboard history, smart categorization, keyboard shortcuts, cloud sync, and end-to-end encryption for sensitive content.",
    achievements: [
      "300+ downloads in first month on GitHub",
      "Featured on Hacker News front page",
      "Built a custom Electron IPC bridge for secure clipboard access",
      "Implemented E2E encryption using libsodium",
    ],
    skills_tools: ["Electron", "React", "Node.js", "SQLite", "libsodium", "TypeScript"],
    images: [],
    references: [],
    links: { live_url: "https://nanoclip.dev", github_url: "https://github.com/nanadotam/nanoclip" },
    impact_rating: 8,
    is_visible: true,
    sort_order: 5,
    tags: ["desktop-app", "electron", "open-source", "productivity"],
  },
  {
    id: "pj-2",
    category: "project",
    title: "DSA File Explorer",
    organization: "Ashesi University",
    role: "Lead Developer",
    location: "Berekuso, Ghana",
    duration: { start: "2024-10-01", end: "2024-12-15", is_current: false },
    description:
      "A visual file explorer that demonstrates data structure algorithms in action. Users can see how trees, graphs, and hash maps work by navigating their actual file system. Built as a final project for Data Structures & Algorithms course.",
    achievements: [
      "Received highest grade in the class (A+)",
      "Visualizes 5 different data structures in real-time",
      "Handles file systems with 100,000+ nodes efficiently",
      "Published as open-source educational tool",
    ],
    skills_tools: ["Python", "PyQt5", "Graph Theory", "Tree Traversal", "Hash Maps"],
    images: [],
    references: [
      { name: "Prof. David Asamoah", role: "Course Instructor", relationship: "Faculty" },
    ],
    links: { github_url: "https://github.com/nanadotam/dsa-file-explorer" },
    impact_rating: 7,
    is_visible: true,
    sort_order: 6,
    tags: ["algorithms", "education", "python", "visualization"],
  },
  {
    id: "pj-3",
    category: "project",
    title: "Kumi — Crowdfunding Platform",
    organization: "Ashesi University",
    role: "Full-Stack Developer & Designer",
    location: "Berekuso, Ghana",
    duration: { start: "2024-09-01", end: "2024-12-01", is_current: false },
    description:
      "A crowdfunding platform designed for African creators and entrepreneurs. Features include project creation, milestone-based funding, real-time progress tracking, and integrated payment processing via mobile money.",
    achievements: [
      "Built a complete crowdfunding platform from scratch in 12 weeks",
      "Integrated mobile money payments (MTN MoMo, Vodafone Cash)",
      "Designed the full UI/UX with a comprehensive style guide",
      "Platform handled 50+ test campaigns during beta",
    ],
    skills_tools: ["Next.js", "Supabase", "Tailwind CSS", "Paystack API", "Figma"],
    images: [
      { url: "/images/CREATIVE-PROCESS-2.jpeg", caption: "Kumi design process", alt: "Kumi project" },
    ],
    references: [],
    links: { github_url: "https://github.com/nanadotam/kumi", behance: "https://behance.net/nanaamoako" },
    impact_rating: 8,
    is_visible: true,
    sort_order: 7,
    tags: ["fullstack", "fintech", "africa", "startup"],
  },
  {
    id: "pj-4",
    category: "project",
    title: "Portfolio Website",
    organization: "Personal",
    role: "Developer & Designer",
    location: "Remote",
    duration: { start: "2024-01-01", end: null, is_current: true },
    description:
      "A dual-persona portfolio website showcasing both development and design work. Features include a developer view with terminal aesthetics, a designer view with editorial layouts, admin dashboard for content management, and real-time database integration.",
    achievements: [
      "Dual persona system — developer (dark) and designer (light) views",
      "Admin dashboard with full CRUD operations",
      "Video support for project showcases (YouTube, Vimeo, Loom)",
      "SEO optimized — consistently ranks for 'Nana Amoako developer'",
    ],
    skills_tools: ["Next.js", "React", "Supabase", "Tailwind CSS", "Framer Motion", "Vercel"],
    images: [],
    references: [],
    links: { live_url: "https://nanaamoako.dev", github_url: "https://github.com/nanadotam/nana-portfolio" },
    impact_rating: 9,
    is_visible: true,
    sort_order: 8,
    tags: ["portfolio", "nextjs", "design", "meta"],
  },

  // ─── EDUCATION ─────────────────────────────────────────────
  {
    id: "ed-1",
    category: "education",
    title: "BSc Computer Science",
    organization: "Ashesi University",
    role: "Student",
    location: "Berekuso, Ghana",
    duration: { start: "2022-09-01", end: "2026-06-01", is_current: true },
    description:
      "Pursuing a Bachelor of Science in Computer Science at Ashesi University, one of Africa's premier liberal arts institutions. Focus areas include software engineering, data structures & algorithms, databases, and human-computer interaction.",
    achievements: [
      "Dean's List — 4 consecutive semesters",
      "GPA: 3.7/4.0",
      "Teaching Assistant for Introduction to Programming",
      "Led the Computer Science Student Association (2024-2025)",
    ],
    skills_tools: ["Java", "Python", "C++", "SQL", "Algorithms", "Software Engineering"],
    images: [],
    references: [
      { name: "Dr. Ayorkor Korsah", role: "Department Head", relationship: "Academic advisor" },
    ],
    links: {},
    impact_rating: 9,
    is_visible: true,
    sort_order: 9,
    tags: ["university", "computer-science", "leadership", "academics"],
  },

  // ─── CERTIFICATIONS ────────────────────────────────────────
  {
    id: "ct-1",
    category: "certification",
    title: "CS50x — Introduction to Computer Science",
    organization: "Harvard University (edX)",
    role: "Student",
    location: "Online",
    duration: { start: "2023-06-01", end: "2023-12-01", is_current: false },
    description:
      "Completed Harvard's renowned CS50x course covering abstraction, algorithms, data structures, encapsulation, resource management, security, software engineering, and web development. Final project scored in the top 5% of submissions.",
    achievements: [
      "Completed all 10 problem sets with 95%+ scores",
      "Final project scored in top 5% of 40,000+ submissions",
      "Learned C, Python, SQL, HTML, CSS, and JavaScript",
    ],
    skills_tools: ["C", "Python", "SQL", "Algorithms", "Web Development"],
    images: [],
    references: [],
    links: {},
    impact_rating: 7,
    is_visible: true,
    sort_order: 10,
    tags: ["certification", "harvard", "cs-fundamentals"],
  },
  {
    id: "ct-2",
    category: "certification",
    title: "AWS Cloud Practitioner",
    organization: "Amazon Web Services",
    role: "Candidate",
    location: "Online",
    duration: { start: "2025-01-01", end: "2025-03-01", is_current: false },
    description:
      "Earned the AWS Cloud Practitioner certification, demonstrating foundational understanding of AWS Cloud services, architecture, security, and pricing models.",
    achievements: [
      "Passed with a score of 860/1000",
      "Completed in 8 weeks of self-study",
    ],
    skills_tools: ["AWS", "Cloud Computing", "EC2", "S3", "Lambda", "IAM"],
    images: [],
    references: [],
    links: {},
    impact_rating: 6,
    is_visible: true,
    sort_order: 11,
    tags: ["certification", "cloud", "aws"],
  },

  // ─── VOLUNTEERING ──────────────────────────────────────────
  {
    id: "vl-1",
    category: "volunteering",
    title: "Code Camp Instructor",
    organization: "iCode Ghana",
    role: "Lead Instructor",
    location: "Accra, Ghana",
    duration: { start: "2024-07-01", end: "2024-08-15", is_current: false },
    description:
      "Taught web development fundamentals to 40+ high school students during a 6-week summer boot camp. Designed the curriculum, created interactive coding challenges, and mentored students through their final projects.",
    achievements: [
      "Taught 40+ students across 3 cohorts",
      "90% of students completed their final projects",
      "Designed a project-based curriculum from scratch",
      "Students built 15 live websites by end of program",
    ],
    skills_tools: ["Teaching", "HTML", "CSS", "JavaScript", "Curriculum Design"],
    images: [
      { url: "/images/me-working/me-working5 Large.jpeg", caption: "Teaching at iCode", alt: "Teaching session" },
    ],
    references: [
      { name: "Ama Boateng", role: "Program Director", relationship: "Supervisor" },
    ],
    links: {},
    impact_rating: 8,
    is_visible: true,
    sort_order: 12,
    tags: ["teaching", "volunteering", "community", "education"],
  },
  {
    id: "vl-2",
    category: "volunteering",
    title: "Tech Mentor",
    organization: "Google Developer Student Clubs",
    role: "Campus Mentor",
    location: "Berekuso, Ghana",
    duration: { start: "2024-01-01", end: "2024-12-31", is_current: false },
    description:
      "Mentored junior developers in the GDSC chapter at Ashesi University. Organized 8 technical workshops, led study groups for competitive programming, and coordinated the annual hackathon.",
    achievements: [
      "Organized 8 technical workshops with 100+ attendees",
      "Mentored 15 junior developers one-on-one",
      "Coordinated annual hackathon with 120 participants",
      "GDSC chapter grew from 50 to 200 members",
    ],
    skills_tools: ["Mentoring", "Event Planning", "Public Speaking", "Technical Workshops"],
    images: [],
    references: [],
    links: {},
    impact_rating: 7,
    is_visible: true,
    sort_order: 13,
    tags: ["mentoring", "google", "community", "leadership"],
  },

  // ─── AWARDS ────────────────────────────────────────────────
  {
    id: "aw-1",
    category: "award",
    title: "Best Design — Ashesi Hackathon 2024",
    organization: "Ashesi University",
    role: "Team Lead",
    location: "Berekuso, Ghana",
    duration: { start: "2024-11-15", end: "2024-11-17", is_current: false },
    description:
      "Won the Best Design award at the 2024 Ashesi Hackathon for a mental health support app designed for university students. Led a team of 4, handling both the UI/UX design and frontend implementation.",
    achievements: [
      "1st place for Best Design out of 30 teams",
      "Built a functional prototype in 48 hours",
      "Designed an empathetic, accessible interface for mental health",
      "Pitched to a panel of 5 industry judges",
    ],
    skills_tools: ["Figma", "React Native", "Pitch Design", "Rapid Prototyping"],
    images: [],
    references: [],
    links: {},
    impact_rating: 8,
    is_visible: true,
    sort_order: 14,
    tags: ["award", "hackathon", "design", "competition"],
  },
  {
    id: "aw-2",
    category: "award",
    title: "Dean's Excellence Scholarship",
    organization: "Ashesi University",
    role: "Recipient",
    location: "Berekuso, Ghana",
    duration: { start: "2022-09-01", end: "2026-06-01", is_current: true },
    description:
      "Awarded a merit-based scholarship covering 50% of tuition for maintaining outstanding academic performance and demonstrating leadership in campus activities.",
    achievements: [
      "Maintained scholarship for 4 consecutive years",
      "Top 10% of class academically",
      "Active in 5+ campus organizations",
    ],
    skills_tools: [],
    images: [],
    references: [],
    links: {},
    impact_rating: 7,
    is_visible: true,
    sort_order: 15,
    tags: ["scholarship", "academic-excellence", "merit"],
  },

  // ─── SKILLS (as entries for the table) ─────────────────────
  {
    id: "sk-1",
    category: "skill",
    title: "Frontend Development",
    organization: "—",
    role: "Expert",
    location: "—",
    duration: { start: "2020-01-01", end: null, is_current: true },
    description:
      "Proficient in building responsive, accessible, and performant web interfaces. Deep expertise in React ecosystem, modern CSS, animation libraries, and design system architecture.",
    achievements: [
      "6+ years of experience with HTML, CSS, JavaScript",
      "3+ years with React, Next.js, TypeScript",
      "Built 20+ production web applications",
      "Expertise in Framer Motion, GSAP, CSS animations",
    ],
    skills_tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML/CSS"],
    images: [],
    references: [],
    links: {},
    impact_rating: 9,
    is_visible: true,
    sort_order: 16,
    tags: ["skill", "frontend", "react", "expert"],
  },
  {
    id: "sk-2",
    category: "skill",
    title: "Backend & Database",
    organization: "—",
    role: "Proficient",
    location: "—",
    duration: { start: "2021-01-01", end: null, is_current: true },
    description:
      "Strong foundation in server-side development, API design, and database management. Experience with both relational and document databases.",
    achievements: [
      "Built RESTful and GraphQL APIs",
      "Experience with PostgreSQL, MongoDB, Supabase, Firebase",
      "Docker containerization and deployment",
      "Node.js, Express, Spring Boot backends",
    ],
    skills_tools: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Docker", "REST APIs", "GraphQL"],
    images: [],
    references: [],
    links: {},
    impact_rating: 8,
    is_visible: true,
    sort_order: 17,
    tags: ["skill", "backend", "databases", "proficient"],
  },

  // ─── PUBLICATIONS / TALKS ──────────────────────────────────
  {
    id: "pb-1",
    category: "publication",
    title: "Building Accessible Design Systems in Africa",
    organization: "Ashesi Design Conference",
    role: "Speaker",
    location: "Berekuso, Ghana",
    duration: { start: "2025-02-15", end: "2025-02-15", is_current: false },
    description:
      "Delivered a 30-minute talk on creating design systems that account for low-bandwidth environments, diverse device landscapes, and multilingual interfaces common across African markets.",
    achievements: [
      "Presented to an audience of 150+ students and faculty",
      "Talk was featured in the university newsletter",
      "Led to a follow-up workshop series on accessibility",
    ],
    skills_tools: ["Public Speaking", "Design Systems", "Accessibility", "Research"],
    images: [
      { url: "/images/me-working/me-working4 Large.jpeg", caption: "Speaking at conference", alt: "Conference talk" },
    ],
    references: [],
    links: {},
    impact_rating: 7,
    is_visible: true,
    sort_order: 18,
    tags: ["talk", "design", "accessibility", "africa"],
  },
];

// Helper to format duration for display
export function formatDuration(duration) {
  if (!duration) return "—";
  const start = new Date(duration.start);
  const end = duration.is_current ? new Date() : duration.end ? new Date(duration.end) : null;
  const startStr = start.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const endStr = duration.is_current ? "Present" : end ? end.toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—";
  return `${startStr} — ${endStr}`;
}

// Category display names and colors
export const categoryConfig = {
  work_experience: { label: "Work Experience", color: "#22c55e", bgLight: "#f0fdf4", bgDark: "#052e16" },
  project: { label: "Project", color: "#3b82f6", bgLight: "#eff6ff", bgDark: "#172554" },
  education: { label: "Education", color: "#8b5cf6", bgLight: "#f5f3ff", bgDark: "#1e1b4b" },
  certification: { label: "Certification", color: "#f59e0b", bgLight: "#fffbeb", bgDark: "#451a03" },
  volunteering: { label: "Volunteering", color: "#ec4899", bgLight: "#fdf2f8", bgDark: "#500724" },
  award: { label: "Award", color: "#E3AF64", bgLight: "#fefce8", bgDark: "#422006" },
  skill: { label: "Skill", color: "#06b6d4", bgLight: "#ecfeff", bgDark: "#083344" },
  publication: { label: "Publication", color: "#f43f5e", bgLight: "#fff1f2", bgDark: "#4c0519" },
};

// Stats derived from data
export const masterCVStats = {
  projects: "20+",
  experience: "8+ Years",
  satisfaction: "95%",
  technologies: "30+",
};
