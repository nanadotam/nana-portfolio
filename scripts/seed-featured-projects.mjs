/**
 * Seed script: inserts featured projects into Supabase via REST API.
 * Run with: node scripts/seed-featured-projects.mjs
 * Uses native fetch (Node 18+). No npm dependencies required.
 */

const SUPABASE_URL = "https://ynihwbuuexxhmssthern.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluaWh3YnV1ZXh4aG1zc3RoZXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDkxNzgsImV4cCI6MjA2ODI4NTE3OH0.lNCJB9OhIpn_oPyZItlNBJP3Oz75YPERYnZfqPt4E3A"

const BASE_IMG =
  "https://raw.githubusercontent.com/nanadotam/SAVED-DATASETS/main/revamp-screenshots"

const revampImages = [
  `${BASE_IMG}/revamp_homepage_1771840741832.png`,
  `${BASE_IMG}/revamp_products_1771840756148.png`,
  `${BASE_IMG}/revamp_custom_poster_1771840770981.png`,
  `${BASE_IMG}/revamp_custom_photo_1771840788411.png`,
  `${BASE_IMG}/revamp_cart_1771840804411.png`,
  `${BASE_IMG}/revamp_checkout_1771840822493.png`,
  `${BASE_IMG}/revamp_about_1771840842529.png`,
  `${BASE_IMG}/revamp_contact_1771840860632.png`,
  `${BASE_IMG}/revamp_signin_1771840880056.png`,
  `${BASE_IMG}/revamp_all_pages_1771840724233.webp`,
  `${BASE_IMG}/Screenshot%202026-02-23%20at%2010.02.59.png`,
  `${BASE_IMG}/Screenshot%202026-02-23%20at%2010.03.14.png`,
  `${BASE_IMG}/Screenshot%202026-02-23%20at%2010.03.25.png`,
  `${BASE_IMG}/Screenshot%202026-02-23%20at%2010.03.29.png`,
]

const now = new Date().toISOString()

const projects = [
  {
    name: "Revamp",
    tagline: "Your Walls, Your Style",
    description:
      "A full Ghanaian custom poster and wall art e-commerce platform. Features a Spotify-powered album poster builder with live SVG previews, Paystack payments (mobile money, card, USSD), a complete Supabase backend with RLS, and a full admin control panel with revenue dashboards, order management, and audit logs.",
    category: "Full-Stack Web App",
    project_type: "developer",
    year: "2024",
    role: "Full-Stack Developer",
    problem:
      "No localised platform existed for Ghanaians to create and order custom wall art with GHS payment support.",
    solution:
      "Built an end-to-end e-commerce platform with a live poster builder, server-side Paystack fraud verification, and a full admin panel for store management.",
    features: [
      "Spotify album poster builder",
      "Paystack GHS payments (mobile money + card)",
      "Admin dashboard with Recharts analytics",
      "Supabase RLS + Google OAuth",
      "PDF export, photo cropping, Vercel Analytics",
    ],
    tools: [
      "Next.js 15",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "PostgreSQL",
      "Paystack",
      "Spotify API",
      "Framer Motion",
      "Vercel",
    ],
    images: revampImages,
    github_url: "https://github.com/nanadotam/revamp-web",
    live_url: "",
    is_featured: true,
    status: "live",
    sort_order: 1,
    json_data: {},
    created_at: now,
    updated_at: now,
  },
  {
    name: "Amoako's Passwords",
    tagline: "Zero-Knowledge. Your vault, your keys.",
    description:
      "A security-first personal password manager with client-side AES-256-GCM encryption — the server never sees plaintext. Features a Go REST API backend, PostgreSQL + Redis infrastructure, and a full Next.js 15 frontend with 8 pages including a security dashboard, WiFi manager, and vault import/export.",
    category: "Security App",
    project_type: "developer",
    year: "2024",
    role: "Full-Stack Developer",
    problem:
      "Existing password managers are closed-source or send data to servers before encryption.",
    solution:
      "Built a zero-knowledge architecture where PBKDF2 derives a master key and AES-256-GCM encrypts all vault data client-side before any network request.",
    features: [
      "AES-256-GCM client-side encryption",
      "PBKDF2 key derivation (100k iterations)",
      "Go REST API with JWT + Argon2",
      "Security dashboard (score, breach detection, password age)",
      "WiFi password manager with QR sharing",
      "CSV/JSON vault import & export",
    ],
    tools: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Framer Motion",
      "Go",
      "PostgreSQL",
      "Redis",
      "Web Crypto API",
    ],
    images: [],
    github_url: "https://github.com/nanadotam/amoako-pass",
    live_url: "",
    is_featured: true,
    status: "in-progress",
    sort_order: 2,
    json_data: {},
    created_at: now,
    updated_at: now,
  },
  {
    name: "NanoClip",
    tagline: "Copy anywhere. Paste everywhere.",
    description:
      "A cross-platform universal clipboard and file sharing web app. Real-time sync across devices via Firebase Firestore listeners, zero-auth quick-access share links, drag-and-drop file upload, and clipboard history — all with 99% uptime on Vercel.",
    category: "Productivity Tool",
    project_type: "developer",
    year: "2024",
    role: "Full-Stack Developer",
    problem:
      "No simple, zero-friction way to share clipboard content and files across devices without accounts or installs.",
    solution:
      "Built a minimal Next.js app with Firestore real-time listeners and encrypted share-link generation for instant cross-device access.",
    features: [
      "Real-time cross-device sync",
      "Zero-auth share links",
      "Drag-and-drop file upload",
      "Clipboard history",
      "End-to-end encrypted transfers",
    ],
    tools: [
      "React",
      "Next.js",
      "Firebase",
      "Firestore",
      "Vercel",
      "Tailwind CSS",
    ],
    images: [],
    github_url: "https://github.com/nanadotam/nanoclip",
    live_url: "",
    is_featured: true,
    status: "live",
    sort_order: 3,
    json_data: {},
    created_at: now,
    updated_at: now,
  },
  {
    name: "DuoSign",
    tagline: "Bridging the gap between signed and spoken language.",
    description:
      "A two-way sign language translation framework converting English text to ASL avatar animations and recognising live hand signs in real time. Built with a React + Three.js frontend, MediaPipe hand tracking, and a custom LSTM model trained on the WLASL dataset.",
    category: "AI / Accessibility",
    project_type: "developer",
    year: "2024",
    role: "Researcher & Full-Stack Developer",
    problem:
      "Deaf and hard-of-hearing individuals lack accessible real-time tools for two-way communication with hearing users.",
    solution:
      "Engineered a bidirectional translation system — text-to-gloss NLP pipeline on the backend, and a live sign recogniser feeding into a 3D avatar renderer on the frontend.",
    features: [
      "Live ASL hand sign recognition (MediaPipe)",
      "3D avatar animations with inverse kinematics (Three.js)",
      "Text-to-gloss NLP pipeline",
      "LSTM model (WLASL dataset, 15 sign classes)",
      "IRB-approved human subjects research",
    ],
    tools: [
      "React",
      "Three.js",
      "Python",
      "MediaPipe",
      "TensorFlow",
      "Keras",
      "Next.js",
      "Flask",
    ],
    images: [],
    github_url: "https://github.com/nanadotam/duosign",
    live_url: "https://github.com/nanadotam/duosign-frontend",
    is_featured: true,
    status: "in-progress",
    sort_order: 4,
    json_data: {},
    created_at: now,
    updated_at: now,
  },
  {
    name: "TEDxAshesiUniversity",
    tagline: "Ideas Worth Spreading — brought to campus.",
    description:
      "The official TEDxAshesiUniversity website — a production Next.js 15 app deployed on Vercel with speaker profiles, event info, team pages, and smooth UI animations. Designed and built end-to-end as Lead Graphic Designer and developer.",
    category: "Event Website",
    project_type: "developer",
    year: "2024",
    role: "Designer & Frontend Developer",
    problem:
      "TEDxAshesi needed a polished, production-ready web presence for their annual event.",
    solution:
      "Designed and developed the full site in Next.js with Tailwind CSS and clean animations, then shipped it to production on Vercel.",
    features: [
      "Speaker and team profile pages",
      "Event details and schedule",
      "Framer Motion animations",
      "Fully responsive layout",
      "Production Vercel deployment",
    ],
    tools: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Vercel",
    ],
    images: [],
    github_url: "https://github.com/nanadotam/tedx-ashesi",
    live_url: "https://tedx-ashesi.vercel.app",
    is_featured: true,
    status: "live",
    sort_order: 5,
    json_data: {},
    created_at: now,
    updated_at: now,
  },
]

async function seed() {
  console.log(`Inserting ${projects.length} featured projects...\n`)

  const res = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(projects),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`ERROR ${res.status}: ${text}`)
    process.exit(1)
  }

  const data = await res.json()
  console.log("Successfully inserted projects:\n")
  for (const p of data) {
    console.log(
      `  [${p.sort_order}] ${p.name} (id: ${p.id}) — featured: ${p.is_featured}, images: ${p.images?.length || 0}`
    )
  }
  console.log("\nDone! Visit /developer to see the Featured Spotlight.")
}

seed().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
