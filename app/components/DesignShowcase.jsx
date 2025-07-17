"use client"

import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"

// Navigation Arrow Components
function LeftArrow() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-black">
      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function RightArrow() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-black">
      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function PlayPauseIcon({ isPlaying }) {
  if (isPlaying) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-black">
        <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
        <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
      </svg>
    )
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-black">
      <polygon points="5,3 19,12 5,21" fill="currentColor"/>
    </svg>
  )
}

// Individual Card Component
function CarouselCard({ item, index, activeIndex, totalCards, onCardClick }) {
  const position = (index - activeIndex + totalCards) % totalCards
  const isActive = position === 0
  const isLeft = position === totalCards - 1
  const isRight = position === 1
  
  // Calculate transforms based on position
  const getTransform = () => {
    if (isActive) {
      // Center card (12 o'clock position)
      return {
        translateX: "0vw",
        translateY: "0vh",
        rotate: "0deg",
        scale: 1,
        opacity: 1,
        zIndex: 10
      }
    } else if (isLeft) {
      // Left card (9 o'clock position)
      return {
        translateX: "-35vw",
        translateY: "0vh",
        rotate: "-15deg",
        scale: 0.8,
        opacity: 0.7,
        zIndex: 5
      }
    } else if (isRight) {
      // Right card (3 o'clock position)
      return {
        translateX: "35vw",
        translateY: "0vh",
        rotate: "15deg", 
        scale: 0.8,
        opacity: 0.7,
        zIndex: 5
      }
    } else {
      // Hidden cards - position them off-screen
      // Alternate between top and bottom for clock tick effect
      const isFromTop = (position % 2 === 0)
      return {
        translateX: "0vw",
        translateY: isFromTop ? "-60vh" : "60vh",
        rotate: "0deg",
        scale: 0.6,
        opacity: 0,
        zIndex: 0
      }
    }
  }

  const transform = getTransform()

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 cursor-pointer"
      style={{
        width: "320px",
        height: "320px",
        marginLeft: "-160px",
        marginTop: "-160px",
      }}
      animate={{
        x: transform.translateX,
        y: transform.translateY,
        rotate: transform.rotate,
        scale: transform.scale,
        opacity: transform.opacity,
        zIndex: transform.zIndex,
      }}
      transition={{
        duration: 0.9,
        ease: [0.25, 0.75, 0.35, 1],
      }}
      onClick={() => onCardClick && onCardClick(item)}
      aria-label={`${item.title}: ${item.description}`}
    >
      <div className="w-full h-full bg-white/85 backdrop-blur-md rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)] overflow-hidden border border-white/30 cursor-pointer hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] transition-shadow duration-300">
        <div className="relative w-full h-4/5 bg-white/20">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 h-1/5 flex items-center justify-center bg-white/90 backdrop-blur-sm">
          <span className="inline-block px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-md border border-black/10">
            {item.category}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function DesignShowcase({ items, onProjectClick }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isScrolling, setIsScrolling] = useState(false)
  const sectionRef = useRef(null)
  const autoPlayRef = useRef(null)
  const lastScrollTime = useRef(0)
  
  // Reset activeIndex when items change or if it goes out of bounds
  useEffect(() => {
    if (items.length > 0 && activeIndex >= items.length) {
      setActiveIndex(0)
    }
  }, [items.length, activeIndex])
  
  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoPlaying && items.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % items.length)
      }, 4000) // Change slide every 4 seconds
    } else {
      clearInterval(autoPlayRef.current)
    }

    return () => clearInterval(autoPlayRef.current)
  }, [isAutoPlaying, items.length])

  // Handle horizontal scroll-based navigation
  useEffect(() => {
    const handleScroll = (e) => {
      if (!sectionRef.current) return
      
      const now = Date.now()
      if (now - lastScrollTime.current < 150) return // Throttle
      lastScrollTime.current = now
      
      const rect = sectionRef.current.getBoundingClientRect()
      const isInView = rect.top < window.innerHeight && rect.bottom > 0
      
      if (!isInView) return
      
      // Only respond to horizontal scroll (shift + wheel or trackpad horizontal)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 10 && !isScrolling) {
        e.preventDefault()
        setIsScrolling(true)
        setIsAutoPlaying(false) // Pause auto-play when user interacts
        
        if (e.deltaX > 0) {
          // Scroll right - next card
          setActiveIndex((prev) => (prev + 1) % items.length)
        } else {
          // Scroll left - previous card  
          setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
        }
        
        setTimeout(() => {
          setIsScrolling(false)
          setIsAutoPlaying(true) // Resume auto-play after interaction
        }, 1000)
      }
    }

    const element = sectionRef.current
    if (element) {
      element.addEventListener('wheel', handleScroll, { passive: false })
      return () => element.removeEventListener('wheel', handleScroll)
    }
  }, [items.length, isScrolling])

  const nextSlide = () => {
    if (items.length === 0) return
    setActiveIndex((prev) => (prev + 1) % items.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 3000)
  }

  const prevSlide = () => {
    if (items.length === 0) return
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 3000)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  const handleCardClick = (project) => {
    if (onProjectClick) {
      onProjectClick(project)
      setIsAutoPlaying(false) // Pause carousel when modal opens
      
      // Resume auto-play after a delay
      setTimeout(() => {
        setIsAutoPlaying(true)
      }, 5000)
    }
  }

  // Show loading state if no items
  if (items.length === 0) {
    return (
      <section className="py-24 px-6 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-light text-center mb-4 text-[#E8DDD0] font-serif"
            >
              Just a few of my favorite projects
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-[#fefefa] font-light"
            >
              Loading projects...
            </motion.p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 px-6 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-light text-center mb-4 text-[#E8DDD0] font-serif"
          >
            Just a few of my favorite projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-[#fefefa] font-light"
          >
            See for yourself
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div 
          ref={sectionRef}
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Carousel Track */}
          <div 
            className="relative w-full flex items-center justify-center"
            style={{ height: "400px" }}
            aria-live="polite"
          >
            {items.map((item, index) => (
              <CarouselCard
                key={index}
                item={item}
                index={index}
                activeIndex={activeIndex}
                totalCards={items.length}
                onCardClick={handleCardClick}
              />
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-6 mt-12">
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-black/10"
              aria-label="Previous project"
            >
              <LeftArrow />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={toggleAutoPlay}
              className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-black/10"
              aria-label={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
            >
              <PlayPauseIcon isPlaying={isAutoPlaying} />
            </button>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-black/10"
              aria-label="Next project"
            >
              <RightArrow />
            </button>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 gap-3">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index)
                  setIsAutoPlaying(false)
                  setTimeout(() => setIsAutoPlaying(true), 3000)
                }}
                className={`transition-all duration-300 rounded-full ${
                  index === activeIndex 
                    ? "w-8 h-3 bg-white border border-black/20" 
                    : "w-3 h-3 bg-white/60 hover:bg-white/80 border border-black/10"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Active Project Details */}
        {items.length > 0 && items[activeIndex] && (
          <motion.div 
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-12 max-w-2xl mx-auto"
          >
            <h3 className="text-3xl font-light text-white mb-3">
              {items[activeIndex].title}
            </h3>
            <p className="text-white/80 leading-relaxed mb-6">
              {items[activeIndex].description}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {items[activeIndex].tags?.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm text-black text-sm rounded-full border border-white/20 shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Instruction Text */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center text-white/60 text-sm mt-8"
        >
          Scroll horizontally or use navigation buttons 
        </motion.p>
      </div>
    </section>
  )
}
