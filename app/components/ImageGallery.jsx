"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import DesignerProjectModal from "./DesignerProjectModal"

export default function ImageGallery() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
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
  ]

  const handleImageClick = (image) => {
    const modalProject = {
      title: image.title,
      category: image.category,
      description: image.description,
      concept: image.concept,
      philosophy: image.philosophy,
      client: image.client,
      year: image.year,
      role: image.role,
      tools: image.tools,
      features: image.features,
      images: [image.src],
      colors: ["#F8F7F5", "#E3AF64", "#5166C8", "#0F1939"], // Default designer colors
      headingFont: "Bricolage Grotesque",
      bodyFont: "Inter"
    }
    setSelectedProject(modalProject)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
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
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
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
        </div>
      </div>

      {/* Designer Project Modal */}
      <DesignerProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </section>
  )
}
