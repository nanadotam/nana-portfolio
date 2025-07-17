"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export default function ImageGallery({ onProjectClick, projects = [] }) {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 6
  
  // Use projects prop if provided, otherwise fallback to sample data
  const images = projects.length > 0 ? projects : [
    { 
      src: "/placeholder.svg?height=400&width=300", 
      alt: "Add Projects",
      title: "No Non-Featured Projects",
      category: "ADMIN",
      description: "Add designer projects to your admin dashboard and mark them as non-featured to see them here in the Visual Stories section",
      concept: "Projects marked as 'not featured' in the admin dashboard will appear here",
      philosophy: "Every project has a story worth telling",
      client: "Your Portfolio",
      year: "2024",
      role: "Portfolio Manager",
      tools: ["Admin Dashboard", "Supabase Database"],
      features: ["Project Management", "Featured Toggle", "Visual Gallery"]
    }
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
            {projects.length > 0 ? (
              <>Page {currentPage + 1} of {totalPages} • {images.length} non-featured projects</>
            ) : (
              <>Add designer projects in the admin dashboard and uncheck "Featured" to see them here</>
            )}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
