"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  FileSpreadsheet,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  AlertCircle,
  Download,
  Trash2,
  Edit3,
  Save,
  Eye,
  ChevronDown,
  RotateCcw,
  Sparkles,
  FileJson2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// ── Master CV field definitions ──────────────────────────────────────
const MASTER_CV_FIELDS = [
  { key: "id", label: "ID", required: true, hint: "e.g. we-1, pj-2, ed-1" },
  { key: "category", label: "Category", required: true, hint: "work_experience | project | education | certification | volunteering | award | skill | publication" },
  { key: "title", label: "Title", required: true, hint: "Entry title" },
  { key: "organization", label: "Organization", required: true, hint: "Company, university, etc." },
  { key: "role", label: "Role", required: true, hint: "Your role/position" },
  { key: "location", label: "Location", required: false, hint: "City, Country" },
  { key: "duration_start", label: "Start Date", required: true, hint: "YYYY-MM-DD" },
  { key: "duration_end", label: "End Date", required: false, hint: "YYYY-MM-DD or empty if current" },
  { key: "is_current", label: "Is Current", required: false, hint: "true / false" },
  { key: "description", label: "Description", required: false, hint: "Full text description" },
  { key: "achievements", label: "Achievements", required: false, hint: "Semicolon-separated list" },
  { key: "skills_tools", label: "Skills / Tools", required: false, hint: "Semicolon-separated list" },
  { key: "tags", label: "Tags", required: false, hint: "Semicolon-separated list" },
  { key: "impact_rating", label: "Impact Rating", required: false, hint: "1-10" },
  { key: "is_visible", label: "Visible", required: false, hint: "true / false" },
  { key: "sort_order", label: "Sort Order", required: false, hint: "Number" },
  { key: "live_url", label: "Live URL", required: false, hint: "https://..." },
  { key: "github_url", label: "GitHub URL", required: false, hint: "https://github.com/..." },
  { key: "case_study_url", label: "Case Study URL", required: false, hint: "https://..." },
  { key: "behance_url", label: "Behance URL", required: false, hint: "https://behance.net/..." },
  { key: "image_urls", label: "Image URLs", required: false, hint: "Semicolon-separated URLs" },
  { key: "image_captions", label: "Image Captions", required: false, hint: "Semicolon-separated captions" },
  { key: "ref_names", label: "Reference Names", required: false, hint: "Semicolon-separated" },
  { key: "ref_roles", label: "Reference Roles", required: false, hint: "Semicolon-separated" },
  { key: "ref_relationships", label: "Reference Relationships", required: false, hint: "Semicolon-separated" },
]

const CATEGORY_OPTIONS = [
  "work_experience", "project", "education", "certification",
  "volunteering", "award", "skill", "publication",
]

// ── CSV parsing ──────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === "\n" && !inQuotes) {
      lines.push(current)
      current = ""
    } else if (ch === "\r" && !inQuotes) {
      // skip \r
    } else {
      current += ch
    }
  }
  if (current.trim()) lines.push(current)

  return lines.map((line) => {
    const cells = []
    let cell = ""
    let q = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (q && line[i + 1] === '"') {
          cell += '"'
          i++
        } else {
          q = !q
        }
      } else if (ch === "," && !q) {
        cells.push(cell)
        cell = ""
      } else {
        cell += ch
      }
    }
    cells.push(cell)
    return cells
  })
}

// ── Convert mapped rows back to masterCVData shape ───────────────────
function rowToEntry(row, mapping) {
  const get = (fieldKey) => {
    const csvCol = mapping[fieldKey]
    if (csvCol == null || csvCol === "__skip__") return undefined
    return row[csvCol]?.trim() ?? ""
  }

  const splitSemicolon = (val) =>
    val ? val.split(";").map((s) => s.trim()).filter(Boolean) : []

  const entry = {
    id: get("id") || `entry-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    category: get("category") || "project",
    title: get("title") || "Untitled",
    organization: get("organization") || "",
    role: get("role") || "",
    location: get("location") || "",
    duration: {
      start: get("duration_start") || null,
      end: get("duration_end") || null,
      is_current: get("is_current")?.toLowerCase() === "true",
    },
    description: get("description") || "",
    achievements: splitSemicolon(get("achievements")),
    skills_tools: splitSemicolon(get("skills_tools")),
    tags: splitSemicolon(get("tags")),
    impact_rating: parseInt(get("impact_rating")) || 5,
    is_visible: get("is_visible") !== "false",
    sort_order: parseInt(get("sort_order")) || 0,
    links: {},
    images: [],
    references: [],
  }

  const liveUrl = get("live_url")
  const githubUrl = get("github_url")
  const caseStudyUrl = get("case_study_url")
  const behanceUrl = get("behance_url")
  if (liveUrl) entry.links.live_url = liveUrl
  if (githubUrl) entry.links.github_url = githubUrl
  if (caseStudyUrl) entry.links.case_study = caseStudyUrl
  if (behanceUrl) entry.links.behance = behanceUrl

  const imageUrls = splitSemicolon(get("image_urls"))
  const imageCaptions = splitSemicolon(get("image_captions"))
  entry.images = imageUrls.map((url, i) => ({
    url,
    caption: imageCaptions[i] || "",
    alt: imageCaptions[i] || entry.title,
  }))

  const refNames = splitSemicolon(get("ref_names"))
  const refRoles = splitSemicolon(get("ref_roles"))
  const refRels = splitSemicolon(get("ref_relationships"))
  entry.references = refNames.map((name, i) => ({
    name,
    role: refRoles[i] || "",
    relationship: refRels[i] || "",
  }))

  return entry
}

// ── Steps ────────────────────────────────────────────────────────────
const STEPS = [
  { id: "upload", label: "Upload CSV" },
  { id: "map", label: "Map Columns" },
  { id: "preview", label: "Preview & Edit" },
  { id: "confirm", label: "Confirm Import" },
]

// =====================================================================
// Main Component
// =====================================================================
export default function CSVUploadManager({ onImport }) {
  const [step, setStep] = useState(0)
  const [csvHeaders, setCsvHeaders] = useState([])
  const [csvRows, setCsvRows] = useState([])
  const [mapping, setMapping] = useState({})
  const [entries, setEntries] = useState([])
  const [editingCell, setEditingCell] = useState(null)
  const [editValue, setEditValue] = useState("")
  const [errors, setErrors] = useState([])
  const [fileName, setFileName] = useState("")
  const fileInputRef = useRef(null)
  const jsonInputRef = useRef(null)

  // ── JSON Import (master_cv.json format) ─────────────────────────
  const handleJSONImport = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.endsWith(".json")) {
      toast.error("Please upload a .json file")
      return
    }

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result)
        // Support both { cv_master: { entries: [...] } } and { entries: [...] }
        const raw = data.cv_master || data
        const jsonEntries = raw.entries || []

        if (!jsonEntries.length) {
          toast.error("No entries found in JSON — expected cv_master.entries or entries array")
          return
        }

        // Map master_cv.json → app's masterCVData format
        const categoryMap = {
          "Internship": "work_experience",
          "Freelance": "work_experience",
          "Co-Curricular / Leadership": "volunteering",
          "Co-Curricular / Design": "project",
          "Co-Curricular / Branding & Design": "project",
          "Co-Curricular / Freelance": "work_experience",
          "Entrepreneurship / Personal Project": "project",
          "Personal Project": "project",
          "Personal Project / Entrepreneurship": "project",
          "Personal Project / Open Source": "project",
          "Personal Project / Creative": "project",
          "Personal Project / Freelance": "project",
          "Personal Project / Content Creation": "publication",
          "Personal Interest / Skill": "skill",
          "Academic Project": "project",
          "Academic / Research Project": "project",
          "Academic Project / Competition": "project",
          "Education": "education",
          "Education / Training": "education",
          "Award / Competition": "award",
          "Award / Academic": "award",
        }

        const prefixMap = {
          "work_experience": "we",
          "project": "pj",
          "education": "ed",
          "certification": "ct",
          "volunteering": "vl",
          "award": "aw",
          "skill": "sk",
          "publication": "pb",
        }

        const counters = {}
        const mapped = jsonEntries.map((entry) => {
          const cat = categoryMap[entry.category] || "project"
          counters[cat] = (counters[cat] || 0) + 1
          const prefix = prefixMap[cat] || "en"
          const id = `${prefix}-${counters[cat]}`

          // Parse period into start/end
          let startDate = null
          let endDate = null
          let isCurrent = false
          if (entry.period) {
            isCurrent = entry.period.toLowerCase().includes("present")
            const parts = entry.period.split(" - ").map((p) => p.trim())
            // Try to parse dates loosely
            const parseLoose = (s) => {
              if (!s || s.toLowerCase() === "present") return null
              // Handle "Jun 2023", "2023", "May 2026", etc.
              const d = new Date(s)
              if (!isNaN(d.getTime())) {
                return d.toISOString().split("T")[0]
              }
              // Try year only
              if (/^\d{4}$/.test(s)) return `${s}-01-01`
              return null
            }
            startDate = parseLoose(parts[0])
            endDate = isCurrent ? null : parseLoose(parts[1] || parts[0])
          }

          return {
            id,
            category: cat,
            title: entry.role || "Untitled",
            organization: entry.organization || "",
            role: entry.role || "",
            location: "",
            duration: { start: startDate, end: endDate, is_current: isCurrent },
            description: entry.impact || "",
            achievements: entry.bullet_points || [],
            skills_tools: entry.skills || [],
            tags: [entry.category?.toLowerCase()?.replace(/[^a-z0-9]/g, "-")].filter(Boolean),
            impact_rating: 5,
            is_visible: true,
            sort_order: counters[cat],
            links: {},
            images: [],
            references: [],
          }
        })

        setEntries(mapped)
        setFileName(file.name)

        // Validate
        const errs = []
        mapped.forEach((entry, i) => {
          if (!entry.title || entry.title === "Untitled") {
            errs.push(`Entry ${i + 1}: Missing title/role`)
          }
        })
        setErrors(errs)

        // Jump straight to preview step (skip CSV mapping)
        setStep(2)
        toast.success(`Loaded ${mapped.length} entries from ${file.name}`)
      } catch (err) {
        toast.error("Could not parse JSON: " + err.message)
      }
    }
    reader.readAsText(file)
  }, [])

  // ── Step 1: Upload ──────────────────────────────────────────────
  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a .csv file")
      return
    }
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target.result
      const parsed = parseCSV(text)
      if (parsed.length < 2) {
        toast.error("CSV must have a header row and at least one data row")
        return
      }
      const headers = parsed[0]
      const rows = parsed.slice(1).filter((r) => r.some((c) => c.trim()))
      setCsvHeaders(headers)
      setCsvRows(rows)

      // Auto-map columns by fuzzy match
      const autoMap = {}
      MASTER_CV_FIELDS.forEach((field) => {
        const idx = headers.findIndex(
          (h) =>
            h.toLowerCase().replace(/[\s_-]/g, "") ===
            field.key.toLowerCase().replace(/[\s_-]/g, "")
        )
        if (idx !== -1) autoMap[field.key] = idx
      })
      setMapping(autoMap)
      toast.success(`Loaded ${rows.length} rows from ${file.name}`)
      setStep(1)
    }
    reader.readAsText(file)
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      const file = e.dataTransfer.files?.[0]
      if (file) {
        const fakeEvent = { target: { files: [file] } }
        handleFileSelect(fakeEvent)
      }
    },
    [handleFileSelect]
  )

  // ── Step 2: Mapping ─────────────────────────────────────────────
  const updateMapping = (fieldKey, csvColIndex) => {
    setMapping((prev) => ({ ...prev, [fieldKey]: csvColIndex }))
  }

  const autoMapAll = () => {
    const newMap = { ...mapping }
    MASTER_CV_FIELDS.forEach((field) => {
      if (newMap[field.key] != null) return
      const idx = csvHeaders.findIndex((h) => {
        const clean = (s) => s.toLowerCase().replace(/[\s_\-./]/g, "")
        return clean(h).includes(clean(field.key)) || clean(field.key).includes(clean(h))
      })
      if (idx !== -1) newMap[field.key] = idx
    })
    setMapping(newMap)
    toast.success("Auto-mapped matching columns")
  }

  // ── Step 3: Preview & Edit ──────────────────────────────────────
  const buildEntries = () => {
    const built = csvRows.map((row) => rowToEntry(row, mapping))
    setEntries(built)

    const errs = []
    built.forEach((entry, i) => {
      if (!entry.title || entry.title === "Untitled") {
        errs.push(`Row ${i + 1}: Missing title`)
      }
      if (!CATEGORY_OPTIONS.includes(entry.category)) {
        errs.push(`Row ${i + 1}: Invalid category "${entry.category}"`)
      }
    })
    setErrors(errs)
    setStep(2)
  }

  const startEditCell = (rowIdx, field, value) => {
    setEditingCell({ rowIdx, field })
    setEditValue(typeof value === "object" ? JSON.stringify(value) : String(value ?? ""))
  }

  const saveEditCell = () => {
    if (!editingCell) return
    const { rowIdx, field } = editingCell
    setEntries((prev) => {
      const copy = [...prev]
      const entry = { ...copy[rowIdx] }

      if (field === "duration.start" || field === "duration.end" || field === "is_current") {
        entry.duration = { ...entry.duration }
        if (field === "duration.start") entry.duration.start = editValue
        else if (field === "duration.end") entry.duration.end = editValue
        else entry.duration.is_current = editValue === "true"
      } else if (field === "achievements" || field === "skills_tools" || field === "tags") {
        entry[field] = editValue.split(";").map((s) => s.trim()).filter(Boolean)
      } else if (field === "impact_rating" || field === "sort_order") {
        entry[field] = parseInt(editValue) || 0
      } else if (field === "is_visible") {
        entry[field] = editValue !== "false"
      } else {
        entry[field] = editValue
      }

      copy[rowIdx] = entry
      return copy
    })
    setEditingCell(null)
  }

  const deleteEntry = (idx) => {
    setEntries((prev) => prev.filter((_, i) => i !== idx))
    toast.success("Entry removed")
  }

  // ── Step 4: Confirm & Import ────────────────────────────────────
  const handleImport = () => {
    if (onImport) {
      onImport(entries)
    }
    toast.success(`Imported ${entries.length} entries to Master CV!`)
    setStep(0)
    setCsvHeaders([])
    setCsvRows([])
    setMapping({})
    setEntries([])
    setErrors([])
    setFileName("")
  }

  // ── Download template ───────────────────────────────────────────
  const downloadTemplate = () => {
    const headers = MASTER_CV_FIELDS.map((f) => f.key)
    const sampleRows = [
      [
        "we-1", "work_experience", "Software Engineering Intern", "Microsoft",
        "Frontend Developer", "Redmond, WA", "2025-06-01", "2025-08-31", "false",
        "Worked on Azure Portal team building dashboard components.",
        "Redesigned monitoring widget;Reduced load time by 35%;Implemented WebSocket streaming",
        "React;TypeScript;Azure;GraphQL;D3.js", "internship;frontend;big-tech",
        "9", "true", "1",
        "https://portal.azure.com", "https://github.com/nanadotam", "", "",
        "/images/me-working/me-working2.jpeg", "At Microsoft Campus",
        "Sarah Chen;James Liu", "Engineering Manager;Senior Engineer", "Direct supervisor;Mentor",
      ],
      [
        "pj-1", "project", "NanoClip", "Personal Project",
        "Solo Developer", "Remote", "2025-01-01", "2025-03-01", "false",
        "A modern clipboard manager built with Electron and React.",
        "300+ downloads in first month;Featured on Hacker News;Built custom Electron IPC bridge",
        "Electron;React;Node.js;SQLite;TypeScript", "desktop-app;electron;open-source",
        "8", "true", "5",
        "https://nanoclip.dev", "https://github.com/nanadotam/nanoclip", "", "",
        "", "", "", "", "",
      ],
      [
        "ed-1", "education", "BSc Computer Science", "Ashesi University",
        "Student", "Berekuso, Ghana", "2022-09-01", "", "true",
        "Pursuing BSc in Computer Science with focus on software engineering.",
        "Dean's List 4 semesters;GPA 3.7/4.0;TA for Intro to Programming",
        "Java;Python;C++;SQL;Algorithms", "university;computer-science;academics",
        "9", "true", "9",
        "", "", "", "",
        "", "",
        "Dr. Ayorkor Korsah", "Department Head", "Academic advisor",
      ],
    ]

    const escape = (val) => {
      const s = String(val ?? "")
      if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes(";")) {
        return `"${s.replace(/"/g, '""')}"`
      }
      return s
    }

    const csv = [headers.map(escape).join(","), ...sampleRows.map((r) => r.map(escape).join(","))].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "master_cv_template.csv"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Template downloaded!")
  }

  // ── Export current data.js as CSV ───────────────────────────────
  const exportCurrentData = () => {
    import("../../master-cv/data").then(({ masterCVData }) => {
      const headers = MASTER_CV_FIELDS.map((f) => f.key)
      const escape = (val) => {
        const s = String(val ?? "")
        if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes(";")) {
          return `"${s.replace(/"/g, '""')}"`
        }
        return s
      }

      const rows = masterCVData.map((entry) => [
        entry.id,
        entry.category,
        entry.title,
        entry.organization,
        entry.role,
        entry.location,
        entry.duration?.start || "",
        entry.duration?.end || "",
        String(entry.duration?.is_current ?? false),
        entry.description,
        (entry.achievements || []).join(";"),
        (entry.skills_tools || []).join(";"),
        (entry.tags || []).join(";"),
        String(entry.impact_rating ?? ""),
        String(entry.is_visible ?? true),
        String(entry.sort_order ?? ""),
        entry.links?.live_url || "",
        entry.links?.github_url || "",
        entry.links?.case_study || "",
        entry.links?.behance || "",
        (entry.images || []).map((img) => img.url).join(";"),
        (entry.images || []).map((img) => img.caption).join(";"),
        (entry.references || []).map((r) => r.name).join(";"),
        (entry.references || []).map((r) => r.role).join(";"),
        (entry.references || []).map((r) => r.relationship).join(";"),
      ])

      const csv = [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n")
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "master_cv_export.csv"
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Current data exported!")
    })
  }

  // ── Render helpers ──────────────────────────────────────────────
  const renderStepIndicator = () => (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              i === step
                ? "bg-orange-500 text-white"
                : i < step
                ? "bg-green-500/20 text-green-400"
                : "bg-gray-700 text-gray-500"
            }`}
          >
            {i < step ? <Check className="h-3 w-3" /> : <span>{i + 1}</span>}
            <span className="hidden sm:inline">{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-8 h-px mx-1 ${i < step ? "bg-green-500/50" : "bg-gray-700"}`} />
          )}
        </div>
      ))}
    </div>
  )

  // ── Step 1: Upload UI ───────────────────────────────────────────
  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          className="admin-card cursor-pointer hover:border-orange-500/50 transition-colors"
          onClick={downloadTemplate}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-500/20">
              <Download className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Download Template</h3>
              <p className="text-sm text-gray-400">Get CSV template with sample data</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="admin-card cursor-pointer hover:border-orange-500/50 transition-colors"
          onClick={exportCurrentData}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-500/20">
              <FileSpreadsheet className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Export Current Data</h3>
              <p className="text-sm text-gray-400">Download existing CV entries as CSV</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="admin-card cursor-pointer hover:border-orange-500/50 transition-colors"
          onClick={() => jsonInputRef.current?.click()}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-500/20">
              <FileJson2 className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Import JSON</h3>
              <p className="text-sm text-gray-400">Load master_cv.json directly</p>
            </div>
          </CardContent>
          <input
            ref={jsonInputRef}
            type="file"
            accept=".json"
            onChange={handleJSONImport}
            className="hidden"
          />
        </Card>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-orange-500/50 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Upload className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          Drop your CSV here or click to browse
        </h3>
        <p className="text-sm text-gray-400">
          Supports .csv files. Use semicolons (;) to separate multiple values in a single cell.
        </p>
      </div>
    </div>
  )

  // ── Step 2: Mapping UI ──────────────────────────────────────────
  const renderMappingStep = () => {
    const mappedCount = Object.values(mapping).filter((v) => v != null && v !== "__skip__").length
    const requiredMapped = MASTER_CV_FIELDS.filter(
      (f) => f.required && mapping[f.key] != null && mapping[f.key] !== "__skip__"
    ).length
    const requiredTotal = MASTER_CV_FIELDS.filter((f) => f.required).length

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3">
          <div className="text-sm text-gray-400">
            <span className="text-white font-semibold">{mappedCount}</span> of{" "}
            {MASTER_CV_FIELDS.length} fields mapped &nbsp;|&nbsp;
            <span className={requiredMapped === requiredTotal ? "text-green-400" : "text-orange-400"}>
              {requiredMapped}/{requiredTotal} required
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={autoMapAll} className="text-gray-300 border-gray-600">
            <Sparkles className="h-3 w-3 mr-1" /> Auto-map
          </Button>
        </div>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
          {MASTER_CV_FIELDS.map((field) => (
            <div
              key={field.key}
              className="flex items-center gap-4 bg-gray-800/50 rounded-lg px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{field.label}</span>
                  {field.required && (
                    <Badge className="bg-red-500/20 text-red-400 text-[10px] px-1.5">Required</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{field.hint}</p>
              </div>

              <ArrowLeft className="h-4 w-4 text-gray-600 flex-shrink-0" />

              <div className="relative flex-1 min-w-0">
                <select
                  value={mapping[field.key] ?? "__skip__"}
                  onChange={(e) => {
                    const val = e.target.value
                    updateMapping(field.key, val === "__skip__" ? "__skip__" : parseInt(val))
                  }}
                  className="w-full bg-gray-700 text-white text-sm rounded-lg px-3 py-2 border border-gray-600 appearance-none cursor-pointer focus:border-orange-500 focus:outline-none"
                >
                  <option value="__skip__">-- Skip --</option>
                  {csvHeaders.map((h, i) => (
                    <option key={i} value={i}>
                      {h} (col {i + 1})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
              </div>

              <div className="hidden md:block w-48 text-xs text-gray-500 truncate">
                {mapping[field.key] != null && mapping[field.key] !== "__skip__" && csvRows[0]
                  ? csvRows[0][mapping[field.key]] || "\u2014"
                  : ""}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setStep(0)} className="text-gray-300 border-gray-600">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <Button
            onClick={buildEntries}
            disabled={requiredMapped < requiredTotal}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Preview Entries <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    )
  }

  // ── Step 3: Preview & Edit UI ───────────────────────────────────
  const renderPreviewStep = () => (
    <div className="space-y-6">
      {errors.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">{errors.length} warning(s)</span>
          </div>
          <ul className="text-xs text-red-300 space-y-1 max-h-24 overflow-y-auto">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-sm text-gray-400 mb-2">
        {entries.length} entries loaded. Click any cell to edit.
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-800 text-gray-400 text-left">
              <th className="px-3 py-2 w-8">#</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Organization</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Duration</th>
              <th className="px-3 py-2">Skills</th>
              <th className="px-3 py-2">Rating</th>
              <th className="px-3 py-2 w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <tr key={idx} className="border-t border-gray-700/50 hover:bg-gray-800/30">
                <td className="px-3 py-2 text-gray-500">{idx + 1}</td>
                <td className="px-3 py-2">
                  <EditableCell
                    value={entry.category}
                    isEditing={editingCell?.rowIdx === idx && editingCell?.field === "category"}
                    editValue={editValue}
                    onEditValue={setEditValue}
                    onStart={() => startEditCell(idx, "category", entry.category)}
                    onSave={saveEditCell}
                    onCancel={() => setEditingCell(null)}
                    render={(v) => (
                      <Badge className="text-[10px]" style={{ background: getCategoryColor(v) }}>
                        {v}
                      </Badge>
                    )}
                  />
                </td>
                <td className="px-3 py-2">
                  <EditableCell
                    value={entry.title}
                    isEditing={editingCell?.rowIdx === idx && editingCell?.field === "title"}
                    editValue={editValue}
                    onEditValue={setEditValue}
                    onStart={() => startEditCell(idx, "title", entry.title)}
                    onSave={saveEditCell}
                    onCancel={() => setEditingCell(null)}
                    render={(v) => <span className="text-white font-medium">{v}</span>}
                  />
                </td>
                <td className="px-3 py-2">
                  <EditableCell
                    value={entry.organization}
                    isEditing={editingCell?.rowIdx === idx && editingCell?.field === "organization"}
                    editValue={editValue}
                    onEditValue={setEditValue}
                    onStart={() => startEditCell(idx, "organization", entry.organization)}
                    onSave={saveEditCell}
                    onCancel={() => setEditingCell(null)}
                    render={(v) => <span className="text-gray-300">{v}</span>}
                  />
                </td>
                <td className="px-3 py-2">
                  <EditableCell
                    value={entry.role}
                    isEditing={editingCell?.rowIdx === idx && editingCell?.field === "role"}
                    editValue={editValue}
                    onEditValue={setEditValue}
                    onStart={() => startEditCell(idx, "role", entry.role)}
                    onSave={saveEditCell}
                    onCancel={() => setEditingCell(null)}
                    render={(v) => <span className="text-gray-400">{v}</span>}
                  />
                </td>
                <td className="px-3 py-2 text-xs text-gray-400">
                  {entry.duration.start || "?"} — {entry.duration.is_current ? "Present" : entry.duration.end || "?"}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {entry.skills_tools.slice(0, 3).map((s, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] text-gray-400 border-gray-600">
                        {s}
                      </Badge>
                    ))}
                    {entry.skills_tools.length > 3 && (
                      <Badge variant="outline" className="text-[10px] text-gray-500 border-gray-700">
                        +{entry.skills_tools.length - 3}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 text-center">
                  <EditableCell
                    value={entry.impact_rating}
                    isEditing={editingCell?.rowIdx === idx && editingCell?.field === "impact_rating"}
                    editValue={editValue}
                    onEditValue={setEditValue}
                    onStart={() => startEditCell(idx, "impact_rating", entry.impact_rating)}
                    onSave={saveEditCell}
                    onCancel={() => setEditingCell(null)}
                    render={(v) => (
                      <span className={`font-mono ${v >= 8 ? "text-green-400" : v >= 5 ? "text-yellow-400" : "text-red-400"}`}>
                        {v}/10
                      </span>
                    )}
                  />
                </td>
                <td className="px-3 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteEntry(idx)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 h-auto"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep(1)} className="text-gray-300 border-gray-600">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Mapping
        </Button>
        <Button
          onClick={() => setStep(3)}
          disabled={entries.length === 0}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Continue <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )

  // ── Step 4: Confirm ─────────────────────────────────────────────
  const renderConfirmStep = () => {
    const categoryCounts = {}
    entries.forEach((e) => {
      categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1
    })

    return (
      <div className="space-y-6">
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Check className="h-5 w-5 text-green-400" />
              Ready to Import
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{entries.length}</div>
                <div className="text-xs text-gray-400">Total Entries</div>
              </div>
              {Object.entries(categoryCounts).map(([cat, count]) => (
                <div key={cat} className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{count}</div>
                  <div className="text-xs text-gray-400">{cat.replace(/_/g, " ")}</div>
                </div>
              ))}
            </div>

            {errors.length > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-xs text-yellow-300">
                <AlertCircle className="h-3 w-3 inline mr-1" />
                {errors.length} warnings — entries will still be imported
              </div>
            )}

            <p className="text-sm text-gray-400">
              This will update <code className="text-orange-400">app/master-cv/data.js</code> with {entries.length} entries.
              The change takes effect immediately on reload.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setStep(2)} className="text-gray-300 border-gray-600">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = "master_cv_preview.json"
                a.click()
                URL.revokeObjectURL(url)
                toast.success("Preview JSON downloaded")
              }}
              className="text-gray-300 border-gray-600"
            >
              <Eye className="h-4 w-4 mr-2" /> Download Preview JSON
            </Button>
            <Button onClick={handleImport} className="bg-green-500 hover:bg-green-600 text-white">
              <Check className="h-4 w-4 mr-2" /> Import {entries.length} Entries
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ── Main render ─────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">CSV Import — Master CV</h2>
          <p className="text-sm text-gray-400">
            Upload a CSV, map columns, edit entries, then import.
          </p>
        </div>
        {step > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setStep(0)
              setCsvHeaders([])
              setCsvRows([])
              setMapping({})
              setEntries([])
              setErrors([])
              setFileName("")
            }}
            className="text-gray-400 border-gray-600"
          >
            <RotateCcw className="h-3 w-3 mr-1" /> Start Over
          </Button>
        )}
      </div>

      {renderStepIndicator()}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {step === 0 && renderUploadStep()}
          {step === 1 && renderMappingStep()}
          {step === 2 && renderPreviewStep()}
          {step === 3 && renderConfirmStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Editable Cell sub-component ────────────────────────────────────
function EditableCell({ value, isEditing, editValue, onEditValue, onStart, onSave, onCancel, render }) {
  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <input
          autoFocus
          value={editValue}
          onChange={(e) => onEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSave()
            if (e.key === "Escape") onCancel()
          }}
          className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-orange-500 focus:outline-none w-full"
        />
        <button onClick={onSave} className="text-green-400 hover:text-green-300 p-0.5">
          <Check className="h-3 w-3" />
        </button>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-300 p-0.5">
          <X className="h-3 w-3" />
        </button>
      </div>
    )
  }

  return (
    <div
      onClick={onStart}
      className="cursor-pointer hover:bg-gray-700/50 rounded px-1 py-0.5 -mx-1 transition-colors group"
    >
      {render(value)}
      <Edit3 className="h-2.5 w-2.5 text-gray-600 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}

// ── Helpers ─────────────────────────────────────────────────────────
function getCategoryColor(cat) {
  const colors = {
    work_experience: "#22c55e",
    project: "#3b82f6",
    education: "#8b5cf6",
    certification: "#f59e0b",
    volunteering: "#ec4899",
    award: "#E3AF64",
    skill: "#06b6d4",
    publication: "#f43f5e",
  }
  return colors[cat] || "#6b7280"
}
