"use client"

import { motion, AnimatePresence } from "framer-motion"
import ImageGallery from "./ImageGallery"
import DesignShowcase from "./DesignShowcase"
import Footer from "./Footer"
import PersistentPersonaToggle from "./PersistentPersonaToggle"
import Navigation from "./Navigation"
import DesignerProjectModal from "./DesignerProjectModal"
import ContactForm from "./ContactForm"
import { useState, useEffect } from "react"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"
import { createClient } from '../../utils/supabase/client'

// Updated FloatingElements component with photos and interactive reveal
function FloatingElements() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [revealedElements, setRevealedElements] = useState(new Set())
  const [hoveredElement, setHoveredElement] = useState(null)

  const elements = [
    // Mix of photos and brand logos - scattered aesthetic pattern
    // Left side elements
    {
      type: "photo",
      content: "/images/me-working/me-working1 Large.jpeg",
      alt: "Nana working on creative projects",
      tooltip: "Behind the scenes of my creative process",
      x: "8%",
      y: "15%",
      delay: 0,
      size: "large",
    },
    {
      type: "logo",
      content: "/images/brands-hero/1NRI LOGO.png",
      alt: "1NRI",
      tooltip: "Brand identity work for 1NRI",
      x: "15%",
      y: "35%",
      delay: 0.3,
    },
    {
      type: "photo",
      content: "/images/me-working/me-working2.jpeg",
      alt: "Creative workspace setup",
      tooltip: "My creative workspace and design process",
      x: "12%",
      y: "55%",
      delay: 0.6,
    },
    {
      type: "logo",
      content: "/images/brands-hero/akosombo-international-school.png",
      alt: "Akosombo International School",
      tooltip: "Brand development for Akosombo International School",
      x: "18%",
      y: "75%",
      delay: 0.9,
    },

    // Center/Middle elements - above the name
    {
      type: "logo",
      content: "/images/brands-hero/ASC LOGO FLAT - WHITE.png",
      alt: "ASC",
      tooltip: "Visual identity for ASC",
      x: "35%",
      y: "10%",
      delay: 1.2,
    },
    {
      type: "photo",
      content: "/images/me-working/me-working3 Large.jpeg",
      alt: "Design consultation",
      tooltip: "Collaborating with clients on design solutions",
      x: "55%",
      y: "75%",
      delay: 1.5,
      size: "small",
    },
    {
      type: "logo",
      content: "/images/brands-hero/Revamp logo - transparent.png",
      alt: "Revamp",
      tooltip: "Creative direction for Revamp brand",
      x: "55%",
      y: "15%",
      delay: 1.8,
    },
    {
      type: "photo",
      content: "/images/me-working/me-working4 Large.jpeg",
      alt: "Creative direction session",
      tooltip: "Leading creative direction for brand campaigns",
      x: "42%",
      y: "73%",
      delay: 2.1,
      size: "large",
    },

    // Right side elements
    {
      type: "photo",
      content: "/images/me-working/me-working5 Large.jpeg",
      alt: "Photography and design",
      tooltip: "Combining photography with design expertise",
      x: "78%",
      y: "20%",
      delay: 2.4,
    },
    {
      type: "photo",
      content: "/images/me-working/me-working6 Large.jpeg",
      alt: "Creative workspace",
      tooltip: "My dedicated creative workspace setup",
      x: "85%",
      y: "40%",
      delay: 2.7,
    },
    {
      type: "photo",
      content: "/images/me-working/me-working1 Large.jpeg",
      alt: "Design process documentation",
      tooltip: "Documenting the creative design process",
      x: "82%",
      y: "80%",
      delay: 3.3,
      size: "small",
    },

    // Additional scattered elements for more dynamic layout
    {
      type: "photo",
      content: "/images/me-working/me-working2.jpeg",
      alt: "Creative excellence",
      tooltip: "Award-winning creative work and design concepts",
      x: "70%",
      y: "5%",
      delay: 3.9,
    },
  ]

  // Mouse tracking and proximity detection
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setMousePosition({ x, y })

      // Check proximity to each element
      elements.forEach((element, index) => {
        const elementX = parseFloat(element.x)
        const elementY = parseFloat(element.y)
        const distance = Math.sqrt(
          Math.pow(x - elementX, 2) + Math.pow(y - elementY, 2)
        )

        // Reveal element if mouse is within 15% distance
        if (distance < 15 && !revealedElements.has(index)) {
          setRevealedElements(prev => new Set([...prev, index]))
        }
      })
    }

    const heroSection = document.querySelector('.hero-interactive-area')
    if (heroSection) {
      heroSection.addEventListener('mousemove', handleMouseMove)
      return () => heroSection.removeEventListener('mousemove', handleMouseMove)
    }
  }, [revealedElements])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute pointer-events-auto cursor-pointer select-none"
          style={{
            left: element.x,
            top: element.y,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={revealedElements.has(index) ? {
            opacity: 0.8,
            scale: 1,
            y: [0, -10, 0],
          } : {
            opacity: 0,
            scale: 0,
          }}
          transition={revealedElements.has(index) ? {
            type: "spring",
            stiffness: 500,
            damping: 15,
            y: {
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          } : {
            duration: 0.2,
          }}
          whileHover={{
            scale: 1.15,
            opacity: 1,
            y: -8,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          }}
          whileTap={{
            scale: 0.95,
            transition: {
              duration: 0.15,
              ease: "easeInOut",
            },
          }}
          onMouseEnter={() => setHoveredElement(index)}
          onMouseLeave={() => setHoveredElement(null)}
        >
          {/* Tooltip */}
          {hoveredElement === index && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
            >
              <div
                className="px-3 py-2 text-xs font-medium whitespace-nowrap shadow-lg border"
                style={{
                  background: "linear-gradient(135deg, rgba(248, 247, 245, 0.95), rgba(255, 253, 250, 0.95))",
                  color: "#0F1939",
                  borderColor: "rgba(15, 25, 57, 0.1)",
                  borderRadius: "50px",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05)",
                }}
              >
                {element.tooltip}
                {/* Tooltip arrow */}
                <div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
                  style={{
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: "5px solid rgba(248, 247, 245, 0.95)",
                  }}
                />
              </div>
            </motion.div>
          )}

          {element.type === "logo" ? (
            <div className="relative group">
              <div
                className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-2xl overflow-hidden transition-all duration-300 flex items-center justify-center bg-white/10 backdrop-blur-sm"
              >
                <img
                  src={element.content}
                  alt={element.alt}
                  className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ) : (
            <div className="relative group">
              <div
                className={`${element.size === "large"
                  ? "w-[160px] h-[160px]"
                  : element.size === "small"
                    ? "w-[80px] h-[80px]"
                    : "w-[120px] h-[120px]" // default
                  } md:${element.size === "large"
                    ? "w-[200px] h-[200px]"
                    : element.size === "small"
                      ? "w-[100px] h-[100px]"
                      : "w-[160px] h-[160px]"
                  } rounded-2xl border-[5px] border-white shadow-lg overflow-hidden bg-gradient-to-br from-blue-100 to-slate-100 hover:shadow-xl transition-shadow duration-300`}
              >
                <img
                  src={element.content}
                  alt={element.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Subtle overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          )}

        </motion.div>
      ))}
    </div>
  )
}

function SparkleEffect({ x, y, show, onComplete }) {
  if (!show) return null

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x - 10, top: y - 10 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      onAnimationComplete={onComplete}
    >
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-slate-400 rounded-full"
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{
            x: Math.cos((i * Math.PI * 2) / 6) * 30,
            y: Math.sin((i * Math.PI * 2) / 6) * 30,
            opacity: 0,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </motion.div>
  )
}

export default function DesignerView() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [nonFeaturedProjects, setNonFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDesignerProjects() {
      try {
        setLoading(true);
        const supabase = createClient();

        // Fetch featured projects for DesignShowcase
        const { data: featuredProjects, error: featuredError } = await supabase
          .from('projects')
          .select('*')
          .eq('project_type', 'designer')
          .eq('is_featured', true)
          .order('sort_order', { ascending: true });

        if (featuredError) {
          throw featuredError;
        }

        // Fetch non-featured projects for ImageGallery
        const { data: nonFeaturedProjectsData, error: nonFeaturedError } = await supabase
          .from('projects')
          .select('*')
          .eq('project_type', 'designer')
          .eq('is_featured', false)
          .order('created_at', { ascending: false });

        if (nonFeaturedError) {
          throw nonFeaturedError;
        }

        // Transform featured projects for DesignShowcase
        const transformedFeaturedProjects = featuredProjects?.map(project => {
          // Debug logging for images
          console.log(`Featured Project: ${project.name}`, {
            images: project.images,
            imagesType: typeof project.images,
            imagesLength: project.images?.length,
            firstImage: project.images?.[0]
          })

          return {
            title: project.name,
            category: project.category || 'DESIGN',
            description: project.description,
            image: project.images && project.images.length > 0 ? project.images[0] : "/placeholder.svg?height=400&width=600",
            images: project.images || [],
            tags: project.tools || [],
            client: project.client,
            year: project.year,
            role: project.role,
            concept: project.concept,
            philosophy: project.philosophy,
            colors: project.colors && project.colors.length > 0 ? project.colors : null,
            headingFont: project.heading_font && project.heading_font.trim() ? project.heading_font : null,
            bodyFont: project.body_font && project.body_font.trim() ? project.body_font : null,
            features: project.features || [],
            liveUrl: project.live_url,
            caseStudyUrl: project.case_study_url,
            behanceUrl: project.behance_url,
            id: project.id
          }
        }) || [];

        // Transform non-featured projects for ImageGallery
        const transformedNonFeaturedProjects = nonFeaturedProjectsData?.map(project => {
          console.log(`Non-Featured Project: ${project.name}`, {
            images: project.images,
            imagesType: typeof project.images,
            imagesLength: project.images?.length,
            firstImage: project.images?.[0]
          })

          return {
            src: project.images && project.images.length > 0 ? project.images[0] : "/placeholder.svg",
            alt: project.name,
            title: project.name,
            category: project.category || 'DESIGN',
            description: project.description,
            concept: project.concept,
            philosophy: project.philosophy,
            client: project.client,
            year: project.year,
            role: project.role,
            tools: project.tools || [],
            features: project.features || [],
            colors: project.colors && project.colors.length > 0 ? project.colors : null,
            headingFont: project.heading_font && project.heading_font.trim() ? project.heading_font : null,
            bodyFont: project.body_font && project.body_font.trim() ? project.body_font : null,
            images: project.images || [],
            liveUrl: project.live_url,
            caseStudyUrl: project.case_study_url,
            behanceUrl: project.behance_url,
            id: project.id
          }
        }) || [];

        setPortfolioItems(transformedFeaturedProjects);
        setNonFeaturedProjects(transformedNonFeaturedProjects);

      } catch (error) {
        console.error('Error fetching designer projects:', error);
        // Fallback to sample data if there's an error
        setPortfolioItems([
          {
            title: "Sample Featured Project",
            category: "PORTFOLIO",
            description: "Add your featured design projects to Supabase to see them here",
            image: "/placeholder.svg?height=400&width=600",
            tags: ["Design", "Portfolio"],
            client: "Your Client",
            year: "2024",
            role: "Designer",
            concept: "Add your projects to the database",
            philosophy: "Design with purpose",
            colors: ["#66BB6A", "#FFA726", "#42A5F5", "#26A69A"],
            headingFont: "Inter",
            bodyFont: "Source Sans Pro",
            features: []
          }
        ]);

        setNonFeaturedProjects([
          {
            src: "/placeholder.svg?height=400&width=300",
            alt: "Sample Non-Featured Project",
            title: "Sample Gallery Project",
            category: "GALLERY",
            description: "Add your non-featured design projects to see them in the Visual Stories section",
            concept: "Projects marked as non-featured appear here",
            philosophy: "All work tells a story",
            client: "Sample Client",
            year: "2024",
            role: "Designer",
            tools: ["Adobe Creative Suite"],
            features: []
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchDesignerProjects();
  }, []);

  // Sample data structure for reference (keeping first few for fallback)
  const sampleItems = [
    {
      title: "Brand Identity System",
      category: "SAMPLE",
      description: "Complete visual identity for a sustainable fashion startup featuring modern typography and cohesive color palette",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Logo Design", "Typography", "Color Theory"],
      client: "Sample Client",
      year: "2024",
      role: "Brand Designer",
      concept: "Creating a fresh, approachable identity that reflects the brand's commitment to quality ingredients and community connection",
      philosophy: "Great branding creates emotional connections that transcend the product itself",
      colors: ["#66BB6A", "#FFA726", "#42A5F5", "#26A69A"],
      headingFont: "Poppins",
      bodyFont: "Open Sans",
      features: []
    }
  ];

  const [sparkles, setSparkles] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)

  const handleProjectClick = (project) => {
    // Convert project item to modal format
    const modalProject = {
      title: project.title,
      category: project.category,
      description: project.description,
      client: project.client || "Creative Studio",
      year: project.year || "2024",
      role: project.role || "Creative Director",
      tools: project.tags || project.tools || ["Adobe Creative Suite", "Figma", "Sketch"],
      concept: project.concept,
      philosophy: project.philosophy,
      colors: project.colors,
      headingFont: project.headingFont,
      bodyFont: project.bodyFont,
      features: project.features,
      images: project.images || [project.image || project.src],
      liveUrl: project.liveUrl,
      caseStudyUrl: project.caseStudyUrl,
      behanceUrl: project.behanceUrl
    }
    setSelectedProject(modalProject)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  const handleHeroClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newSparkle = {
      id: Date.now(),
      x,
      y,
    }

    setSparkles((prev) => [...prev, newSparkle])

    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id))
    }, 600)
  }

  return (
    <div className="relative min-h-screen text-gray-800">
      {/* Background Gradient Animation */}
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(220, 230, 245)" // Lighter blue-tinted start instead of warm beige
        gradientBackgroundEnd="rgb(15, 25, 57)"      // Cosmic Odyssey (keep the deep blue)
        firstColor="81, 106, 200"     // Sapphire Dust (more prominent blue)
        secondColor="38, 66, 139"     // Blue Oblivion (deeper blue)
        thirdColor="51, 85, 180"      // New medium blue between the two
        fourthColor="120, 140, 200"   // Light blue instead of warm tone
        fifthColor="200, 210, 240"    // Very light blue instead of warm white
        pointerColor="81, 106, 200"   // Sapphire Dust for interaction
        blendingValue="screen"
        size="80%"
        interactive={true}
        containerClassName="fixed inset-0 -z-10"
      />

      {/* Navigation */}
      <Navigation />

      {/* Content Container */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div
          id="designer-home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="hero-interactive-area relative h-screen flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={handleHeroClick}
        >
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-700/15 to-blue-400/25 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-blue-800/15 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-300/10 to-blue-600/15 rounded-full blur-3xl" />
          </div>

          {/* Floating Elements with Photos */}
          <FloatingElements />

          {/* Sparkle effects */}
          {sparkles.map((sparkle) => (
            <SparkleEffect key={sparkle.id} x={sparkle.x} y={sparkle.y} show={true} onComplete={() => { }} />
          ))}

          {/* Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl md:text-9xl font-light mb-6"
              style={{
                fontFamily: "var(--font-bricolage)",
                background: "linear-gradient(to bottom right, #F8F7F5, #FAEBD7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              Nana Amoako
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-2xl md:text-3xl font-bricolage font-light mb-8 font-serif"
              style={{ color: "#E3AF64" }}
            >
              Designer • Marketing & Public Relations • Creative Director 
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="text-lg max-w-2xl mx-auto leading-relaxed mb-8"
              style={{ color: "#F8F7F5" }}
            >
              I’m the full-stack creative who blends
              <span className="font-bold"> photography</span>, <span className="font-bold">filmmaking</span>, <span className="font-bold">design</span>, <span className="font-bold">creative direction</span>, 
              and <span className="font-bold">digital strategy.</span> 

              <br />
              <br />
              I care about the <span className="italic">little</span> <span className="font-bold">details</span> — that’s why I'm the <span className="font-italic">right</span> fit for your needs.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-sm font-light opacity-60 animate-pulse"
              style={{ color: "#F8F7F5" }}
            >
              Wanna see some magic? Move your cursor around
            </motion.p>
          </div>
        </motion.div>

        {/* Portfolio Showcase */}
        <div id="featured-work">
          <DesignShowcase items={portfolioItems} onProjectClick={handleProjectClick} />
        </div>

        {/* Image Gallery */}
        <div id="gallery">
          <ImageGallery projects={nonFeaturedProjects} onProjectClick={handleProjectClick} />
        </div>

        {/* About Section */}
        {(() => {
          const { useState } = require("react");
          const { motion, AnimatePresence } = require("framer-motion");
          const [hovered, setHovered] = useState(false);

          const aboutImages = [
            {
              src: "/images/CREATIVE-PROCESS.jpeg",
              alt: "Creative Process",
            },
            {
              src: "/images/CREATIVE-PROCESS-2.jpeg",
              alt: "Creative Process Alternate",
            },
          ];

          return (
            <motion.section
              id="designer-about"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="py-24 px-6"
            >
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                  <div>
                    <h2 className="text-4xl font-light mb-8 font-serif" style={{ color: "#F8F7F5" }}>About My Creative Process</h2>
                    <p className="text-lg leading-relaxed mb-6" style={{ color: "#F8F7F5" }}>
                      I believe in the power of visual storytelling to create emotional connections. My approach combines
                      strategic thinking with artistic intuition, ensuring every design decision serves both aesthetic and
                      functional purposes.
                    </p>
                    <p className="text-lg leading-relaxed" style={{ color: "#F8F7F5" }}>
                      From concept to execution, I focus on creating cohesive brand experiences that stand out in today's
                      saturated visual landscape while remaining timeless and authentic.
                    </p>
                  </div>
                  <div
                    className="relative flex items-center justify-center"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    style={{ cursor: "pointer" }}
                  >
                    <AnimatePresence initial={false} mode="wait">
                      <motion.img
                        key={hovered ? aboutImages[1].src : aboutImages[0].src}
                        src={hovered ? aboutImages[1].src : aboutImages[0].src}
                        alt={hovered ? aboutImages[1].alt : aboutImages[0].alt}
                        className="rounded-3xl w-full object-cover aspect-square shadow-lg border border-white/10"
                        style={{
                          background: "linear-gradient(135deg, rgba(81, 106, 200, 0.2), rgba(227, 175, 100, 0.2))"
                        }}
                        loading="lazy"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                      />
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.section>
          );
        })()}

        {/* Contact Section */}
        <motion.section
          id="designer-contact"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-24 px-6"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-light mb-8 font-serif" style={{ color: "#F8F7F5" }}>Let's Create Together</h2>
            <p className="text-lg leading-relaxed mb-12" style={{ color: "#F8F7F5" }}>
              Ready to bring your vision to life? I'd love to hear about your project and explore how we can create something extraordinary together.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => setShowContactForm(true)}
                className="px-8 py-4 rounded-full font-medium transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-blue-400/20"
                style={{
                  background: "linear-gradient(135deg, rgba(81, 106, 200, 0.3), rgba(227, 175, 100, 0.3))",
                  color: "#F8F7F5"
                }}
              >
                Get In Touch
              </button>
              <a
                href="https://www.linkedin.com/in/nanaamoako/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full font-medium transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:bg-white/10"
                style={{ color: "#F8F7F5" }}
              >
                Connect on LinkedIn
              </a>
            </div>
            {/* Social links section, neatly centered */}
            <div className="flex flex-col items-center justify-center mt-12">
              <p className="text-lg leading-relaxed mb-6 text-center" style={{ color: "#F8F7F5" }}>
                You can also reach out through my social media platforms
              </p>
              <div className="social-links flex flex-wrap gap-6 justify-center items-center">
                <a href="https://github.com/nanadotam" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/nanaamoako/" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                <a href="https://www.tiktok.com/@unclesettings" target="_blank" rel="noopener noreferrer">
                  TikTok
                </a>
                <a href="https://www.instagram.com/unclesettings" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <Footer />

        {/* Extra spacing for giant toggle */}
        <div className="h-80"></div>

        {/* Persistent Persona Toggle */}
        <PersistentPersonaToggle />
      </div>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowContactForm(false)
              }
            }}
          >
            <ContactForm variant="designer" onClose={() => setShowContactForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Designer Project Modal - At top level for proper z-index */}
      <DesignerProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </div>
  )
}
