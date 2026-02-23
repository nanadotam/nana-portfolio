/**
 * Updates live_url and images for featured projects.
 * Run with: node scripts/update-featured-projects.mjs
 */

const SUPABASE_URL = "https://ynihwbuuexxhmssthern.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluaWh3YnV1ZXh4aG1zc3RoZXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDkxNzgsImV4cCI6MjA2ODI4NTE3OH0.lNCJB9OhIpn_oPyZItlNBJP3Oz75YPERYnZfqPt4E3A"

const updates = [
  {
    name: "Revamp",
    live_url: "https://revamp-three.vercel.app/",
  },
  {
    name: "NanoClip",
    live_url: "https://nanoclip.vercel.app/",
    images: ["https://raw.githubusercontent.com/nanadotam/SAVED-DATASETS/main/nanoclip-sc.jpeg"],
  },
  {
    name: "DuoSign",
    live_url: "https://duosign.vercel.app/",
    images: ["https://raw.githubusercontent.com/nanadotam/SAVED-DATASETS/main/duosign-sc.jpeg"],
  },
  {
    name: "TEDxAshesiUniversity",
    live_url: "https://tedx-ashesi.vercel.app/",
    images: ["https://raw.githubusercontent.com/nanadotam/SAVED-DATASETS/main/tedx-sc.jpeg"],
  },
]

async function patch(name, data) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/projects?name=eq.${encodeURIComponent(name)}&project_type=eq.developer`,
    {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ ...data, updated_at: new Date().toISOString() }),
    }
  )
  if (!res.ok) {
    const text = await res.text()
    console.error(`  ERROR updating ${name}: ${res.status} ${text}`)
    return null
  }
  const rows = await res.json()
  return rows[0]
}

async function run() {
  console.log("Updating featured projects...\n")
  for (const u of updates) {
    const { name, ...data } = u
    const result = await patch(name, data)
    if (result) {
      console.log(`  ${name} — live_url: ${result.live_url || "(none)"}, images: ${result.images?.length || 0}`)
    }
  }
  console.log("\nDone!")
}

run().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})
