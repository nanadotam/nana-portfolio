"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ExternalLink, Github, Terminal } from "lucide-react"
import { createClient } from "../../utils/supabase/client"

function parseVideoUrl(url) {
  if (!url) return null

  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (ytMatch) {
    return { type: "iframe", src: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0` }
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch) {
    return { type: "iframe", src: `https://player.vimeo.com/video/${vimeoMatch[1]}` }
  }

  // Loom
  const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/)
  if (loomMatch) {
    return { type: "iframe", src: `https://www.loom.com/embed/${loomMatch[1]}` }
  }

  // Direct video file
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) {
    return { type: "video", src: url }
  }

  // If it already looks like an embed URL, pass through
  if (url.includes("embed") || url.includes("player")) {
    return { type: "iframe", src: url }
  }

  return null
}

function VideoPlayer({ videoUrl, fallbackImage, projectName }) {
  const parsed = parseVideoUrl(videoUrl)

  if (parsed?.type === "iframe") {
    return (
      <iframe
        src={parsed.src}
        title={`${projectName} demo`}
        className="w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ border: 0 }}
      />
    )
  }

  if (parsed?.type === "video") {
    return (
      <video
        src={parsed.src}
        controls
        className="w-full h-full object-cover rounded-lg"
        poster={fallbackImage}
      >
        Your browser does not support the video tag.
      </video>
    )
  }

  if (fallbackImage) {
    return (
      <img
        src={fallbackImage}
        alt={projectName}
        className="w-full h-full object-cover rounded-lg"
      />
    )
  }

  // Terminal-style placeholder
  return (
    <div className="w-full h-full rounded-lg bg-black/60 border border-[#4ade80]/30 flex items-center justify-center">
      <div className="text-center space-y-3">
        <Terminal className="w-12 h-12 text-[#4ade80]/50 mx-auto" />
        <div className="font-mono text-[#4ade80]/50 text-sm">
          <p>$ no preview available</p>
          <p className="animate-pulse">_</p>
        </div>
      </div>
    </div>
  )
}

export default function FeaturedSpotlight() {
  const [projects, setProjects] = useState([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)

  // Fetch featured developer projects
  useEffect(() => {
    async function fetchFeatured() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("project_type", "developer")
        .eq("is_featured", true)
        .order("sort_order", { ascending: true })

      if (!error && data) {
        setProjects(data)
      }
      setLoading(false)
    }
    fetchFeatured()
  }, [])

  // Auto-advance carousel
  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % projects.length)
  }, [projects.length])

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + projects.length) % projects.length)
  }, [projects.length])

  useEffect(() => {
    if (projects.length <= 1 || isPaused) {
      clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(nextSlide, 8000)
    return () => clearInterval(timerRef.current)
  }, [projects.length, isPaused, nextSlide])

  const handleManualNav = (action) => {
    setIsPaused(true)
    action()
    // Resume auto-advance after 12s of no interaction
    setTimeout(() => setIsPaused(false), 12000)
  }

  if (loading) return null
  if (projects.length === 0) return null

  const project = projects[current]
  const videoUrl = project.json_data?.video_url
  const fallbackImage = project.images?.[0]

  return (
    <section
      id="spotlight"
      className="py-20 px-4 md:px-8 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#4ade80]/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#4ade80]/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="mb-12">
          <p className="font-mono text-[#4ade80] text-sm mb-2 tracking-wider">
            {">"} Featured Projects
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-mono">
            Spotlight
          </h2>
          <div className="w-16 h-0.5 bg-[#4ade80] mt-3" />
        </div>

        {/* Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center"
          >
            {/* Video / Media — 60% on desktop */}
            <div className="lg:col-span-3 aspect-video bg-black/40 rounded-xl border border-gray-800 overflow-hidden">
              <VideoPlayer
                videoUrl={videoUrl}
                fallbackImage={fallbackImage}
                projectName={project.name}
              />
            </div>

            {/* Project info — 40% on desktop */}
            <div className="lg:col-span-2 space-y-5">
              <div>
                <p className="font-mono text-[#4ade80] text-xs tracking-wider mb-1">
                  {project.year} &middot; {project.role}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-white font-mono leading-tight">
                  {project.name}
                </h3>
                {project.tagline && (
                  <p className="text-gray-400 text-sm mt-1 font-mono">
                    {project.tagline}
                  </p>
                )}
              </div>

              {project.description && (
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                  {project.description}
                </p>
              )}

              {/* Tech stack badges */}
              {project.tools?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs font-mono rounded border border-[#4ade80]/30 text-[#4ade80] bg-[#4ade80]/5"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#4ade80] text-black text-sm font-mono font-medium rounded-lg hover:bg-[#22c55e] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Live
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-300 text-sm font-mono rounded-lg hover:border-[#4ade80] hover:text-[#4ade80] transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation controls */}
        {projects.length > 1 && (
          <div className="flex items-center justify-between mt-10">
            {/* Prev / Next */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleManualNav(prevSlide)}
                className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:border-[#4ade80] hover:text-[#4ade80] transition-colors"
                aria-label="Previous project"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleManualNav(nextSlide)}
                className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:border-[#4ade80] hover:text-[#4ade80] transition-colors"
                aria-label="Next project"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleManualNav(() => setCurrent(i))}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-8 bg-[#4ade80]"
                      : "w-2 bg-gray-600 hover:bg-gray-500"
                  }`}
                  aria-label={`Go to project ${i + 1}`}
                />
              ))}
            </div>

            {/* Slide counter */}
            <span className="font-mono text-gray-500 text-sm">
              {String(current + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
