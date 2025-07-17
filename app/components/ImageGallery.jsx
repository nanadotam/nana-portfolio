"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export default function ImageGallery({ onProjectClick }) {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 6
  const images = [
    { 
      src: "/placeholder.svg?height=400&width=300", 
      alt: "Portrait Photography",
      title: "Editorial Portrait Series",
      category: "PHOTOGRAPHY",
      description: "A compelling series exploring contemporary identity through intimate portraiture",
      concept: "Capturing authentic moments that reveal the subject's true character beyond surface appearances",
      philosophy: "Photography as a medium for human connection and storytelling",
      client: "Vogue Magazine",
      year: "2024",
      role: "Lead Photographer",
      tools: ["Canon R5", "Profoto Lighting", "Lightroom", "Photoshop"],
      features: ["Natural lighting techniques", "Authentic emotional capture", "Minimal post-processing", "Documentary approach"]
    },
    { 
      src: "/placeholder.svg?height=300&width=400", 
      alt: "Landscape Photography",
      title: "Urban Landscapes",
      category: "PHOTOGRAPHY",
      description: "Reimagining cityscapes through a minimalist lens",
      concept: "Finding tranquility and composition within urban chaos",
      philosophy: "Every cityscape tells a story of human ambition and architectural poetry",
      client: "National Geographic",
      year: "2023",
      role: "Photographer & Editor",
      tools: ["Sony A7R IV", "DJI Drone", "Capture One", "Photoshop"],
      features: ["Aerial perspectives", "Golden hour timing", "Geometric composition", "Color grading mastery"]
    },
    { 
      src: "/placeholder.svg?height=500&width=300", 
      alt: "Street Photography",
      title: "Street Stories",
      category: "PHOTOGRAPHY",
      description: "Candid moments that capture the essence of urban life",
      concept: "Documenting spontaneous human interactions in their natural environment",
      philosophy: "Street photography as visual anthropology",
      client: "The Guardian",
      year: "2024",
      role: "Documentary Photographer",
      tools: ["Leica Q2", "Film Camera", "Street Photography Kit"],
      features: ["Decisive moment capture", "Authentic storytelling", "Black & white mastery", "Human connection"]
    },
    { 
      src: "/placeholder.svg?height=300&width=300", 
      alt: "Abstract Art",
      title: "Digital Abstract Expressions",
      category: "DIGITAL ART",
      description: "Exploring form, color, and emotion through digital mediums",
      concept: "Bridging traditional abstract art principles with modern digital techniques",
      philosophy: "Abstract art as pure emotional expression beyond representational constraints",
      client: "Contemporary Art Gallery",
      year: "2024",
      role: "Digital Artist",
      tools: ["Procreate", "Adobe Illustrator", "Blender", "After Effects"],
      features: ["Color theory exploration", "Dynamic compositions", "Digital brushwork", "Emotional resonance"]
    },
    { 
      src: "/placeholder.svg?height=400&width=400", 
      alt: "Product Photography",
      title: "Luxury Product Showcase",
      category: "COMMERCIAL",
      description: "Elevating product presentation through sophisticated visual storytelling",
      concept: "Creating desire through meticulous attention to detail and atmospheric lighting",
      philosophy: "Product photography as the intersection of technical precision and artistic vision",
      client: "Apple Inc.",
      year: "2024",
      role: "Commercial Photographer",
      tools: ["Phase One Camera", "Broncolor Lighting", "Capture One", "Retouching Suite"],
      features: ["Studio lighting mastery", "Macro detail work", "Reflective surface handling", "Brand consistency"]
    },
    { 
      src: "/placeholder.svg?height=350&width=300", 
      alt: "Architecture",
      title: "Modern Architecture Study",
      category: "ARCHITECTURE",
      description: "Documenting contemporary architectural marvels and their spatial relationships",
      concept: "Architecture photography that emphasizes form, function, and human scale",
      philosophy: "Buildings as sculptural forms that shape human experience",
      client: "Architectural Digest",
      year: "2023",
      role: "Architectural Photographer",
      tools: ["Nikon D850", "Tilt-Shift Lenses", "Tripod System", "HDR Processing"],
      features: ["Perspective correction", "Lighting balance", "Geometric precision", "Environmental context"]
    },
    { 
      src: "/placeholder.svg?height=380&width=300", 
      alt: "Fashion Editorial",
      title: "Contemporary Fashion Series",
      category: "FASHION",
      description: "High-end fashion editorial exploring modern minimalism and bold statements",
      concept: "Juxtaposing classic elegance with contemporary edge through lighting and composition",
      philosophy: "Fashion as artistic expression that transcends trends",
      client: "Harper's Bazaar",
      year: "2024",
      role: "Fashion Photographer",
      tools: ["Hasselblad H6D", "Profoto Flash System", "Phase One", "Retouching Suite"],
      features: ["Editorial storytelling", "High-fashion styling", "Studio mastery", "Creative direction"]
    },
    { 
      src: "/placeholder.svg?height=320&width=400", 
      alt: "Brand Identity",
      title: "Luxury Brand System",
      category: "BRANDING",
      description: "Complete brand identity for luxury hospitality group",
      concept: "Creating sophisticated visual language that embodies premium service and timeless elegance",
      philosophy: "Great brands tell stories that resonate across cultures and generations",
      client: "Ritz-Carlton Hotels",
      year: "2024",
      role: "Brand Designer",
      tools: ["Adobe Creative Suite", "Sketch", "Figma", "Brand Guidelines"],
      features: ["Logo design", "Typography system", "Color palette", "Brand applications"]
    },
    { 
      src: "/placeholder.svg?height=450&width=300", 
      alt: "Conceptual Art",
      title: "Digital Abstractions",
      category: "DIGITAL ART",
      description: "Experimental digital art exploring the intersection of technology and human emotion",
      concept: "Using digital tools to create organic, emotional expressions that bridge human and machine",
      philosophy: "Technology amplifies creativity rather than replacing human touch",
      client: "MoMA Digital",
      year: "2024",
      role: "Digital Artist",
      tools: ["Blender", "Cinema 4D", "After Effects", "TouchDesigner"],
      features: ["3D modeling", "Generative art", "Motion graphics", "Interactive installations"]
    },
    { 
      src: "/placeholder.svg?height=340&width=350", 
      alt: "Interior Design",
      title: "Scandinavian Minimalism",
      category: "INTERIOR",
      description: "Contemporary interior design project emphasizing light, space, and natural materials",
      concept: "Creating harmony between function and beauty through thoughtful material selection",
      philosophy: "Spaces should enhance well-being and reflect personal identity",
      client: "Private Residence",
      year: "2023",
      role: "Interior Designer",
      tools: ["SketchUp", "V-Ray", "AutoCAD", "Material Libraries"],
      features: ["Space planning", "Material selection", "Lighting design", "Custom furniture"]
    },
    { 
      src: "/placeholder.svg?height=290&width=380", 
      alt: "Web Design",
      title: "Interactive Experience",
      category: "DIGITAL",
      description: "Award-winning website design for innovative tech startup",
      concept: "Creating intuitive digital experiences that feel natural and engaging",
      philosophy: "Good design is invisible - users should focus on content, not interface",
      client: "TechFlow Innovations",
      year: "2024",
      role: "UX/UI Designer",
      tools: ["Figma", "Framer", "Principle", "Code Editor"],
      features: ["User research", "Wireframing", "Prototyping", "Responsive design"]
    },
    { 
      src: "/placeholder.svg?height=360&width=320", 
      alt: "Packaging Design",
      title: "Artisan Coffee Series",
      category: "PACKAGING",
      description: "Premium coffee packaging design celebrating artisanal craft and sustainability",
      concept: "Honoring traditional coffee culture while embracing modern environmental consciousness",
      philosophy: "Packaging should tell the product's story and reflect its values",
      client: "Blue Bottle Coffee",
      year: "2024",
      role: "Package Designer",
      tools: ["Illustrator", "Photoshop", "Packaging Software", "Prototyping"],
      features: ["Sustainable materials", "Structural design", "Brand storytelling", "Print production"]
    },
    { 
      src: "/placeholder.svg?height=420&width=300", 
      alt: "Typography Art",
      title: "Experimental Typography",
      category: "TYPOGRAPHY",
      description: "Pushing the boundaries of letterform and meaning through experimental type design",
      concept: "Typography as both functional communication and artistic expression",
      philosophy: "Letters carry emotion and personality beyond their literal meaning",
      client: "Type Directors Club",
      year: "2024",
      role: "Type Designer",
      tools: ["Glyphs", "FontLab", "Illustrator", "InDesign"],
      features: ["Custom typefaces", "Experimental layouts", "Cultural typography", "Digital applications"]
    },
  ]

  // Pagination logic
  const totalPages = Math.ceil(images.length / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentImages = images.slice(startIndex, endIndex)

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex)
  }

      const handleImageClick = (image) => {
    if (onProjectClick) {
      // Only add defaults if they don't exist, otherwise keep as null for optional display
      const imageWithOptionals = {
        ...image,
        colors: image.colors && image.colors.length > 0 ? image.colors : null,
        headingFont: image.headingFont && image.headingFont.trim() ? image.headingFont : null,
        bodyFont: image.bodyFont && image.bodyFont.trim() ? image.bodyFont : null
      }
      onProjectClick(imageWithOptionals)
    }
  }

  return (
    <section className="py-24 px-6 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-5xl font-light text-center mb-16 text-[#E8DDD0] font-serif"
        >
          Visual Stories
        </motion.h2>
        <motion.div 
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          {currentImages.map((image, index) => (
            <motion.div
              key={`${currentPage}-${index}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="break-inside-avoid group cursor-pointer"
              onClick={() => handleImageClick(image)}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-100/60 to-amber-100/60 backdrop-blur-sm border border-white/20">
                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-medium drop-shadow-md">{image.alt}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-8 mt-16"
        >
          {/* Previous Button */}
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: currentPage === 0 
                ? "linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(248, 247, 245, 0.5))"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 247, 245, 0.9))",
              border: "1px solid rgba(81, 106, 200, 0.2)",
              backdropFilter: "blur(10px)",
              boxShadow: currentPage === 0 ? "none" : "0 4px 16px rgba(0, 0, 0, 0.1)"
            }}
          >
            <svg 
              className={`w-5 h-5 transition-all duration-300 ${currentPage === 0 ? 'text-slate-400' : 'text-slate-700 group-hover:text-slate-900 group-hover:-translate-x-0.5'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Page Indicators */}
          <div className="flex items-center gap-3">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentPage 
                    ? "w-10 h-3" 
                    : "w-3 h-3 hover:w-6"
                }`}
                style={{
                  background: index === currentPage 
                    ? "rgba(255, 255, 255, 0.9)"
                    : "rgba(255, 255, 255, 0.4)",
                  border: index === currentPage 
                    ? "1px solid rgba(255, 255, 255, 0.8)"
                    : "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: index === currentPage 
                    ? "0 2px 8px rgba(255, 255, 255, 0.3)" 
                    : "0 1px 4px rgba(0, 0, 0, 0.1)"
                }}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: currentPage === totalPages - 1
                ? "linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(248, 247, 245, 0.5))"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 247, 245, 0.9))",
              border: "1px solid rgba(81, 106, 200, 0.2)",
              backdropFilter: "blur(10px)",
              boxShadow: currentPage === totalPages - 1 ? "none" : "0 4px 16px rgba(0, 0, 0, 0.1)"
            }}
          >
            <svg 
              className={`w-5 h-5 transition-all duration-300 ${currentPage === totalPages - 1 ? 'text-slate-400' : 'text-slate-700 group-hover:text-slate-900 group-hover:translate-x-0.5'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>

        {/* Page Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-white/60 text-sm font-light">
            Page {currentPage + 1} of {totalPages} • {images.length} total projects
          </p>
        </motion.div>
      </div>
    </section>
  )
}
