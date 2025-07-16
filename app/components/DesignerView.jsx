"use client"

import { motion } from "framer-motion"
import ImageGallery from "./ImageGallery"
import DesignShowcase from "./DesignShowcase"
import Footer from "./Footer"
import PersistentPersonaToggle from "./PersistentPersonaToggle"
import { useState, useEffect } from "react"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"

// Updated FloatingElements component with photos and interactive reveal
function FloatingElements() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [revealedElements, setRevealedElements] = useState(new Set())

  const elements = [
    // Mix of photos and brand logos - scattered aesthetic pattern
    // Left side elements
    {
      type: "photo",
      content: "/images/gallery/UBORA-104.jpg",
      alt: "Design Work 1",
      x: "8%",
      y: "15%",
      delay: 0,
      size: "large",
    },
    {
      type: "logo",
      content: (
        <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.219.083.338-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
        </svg>
      ),
      alt: "McDonald's",
      x: "15%",
      y: "35%",
      delay: 0.3,
    },
    {
      type: "photo",
      content: "/placeholder.svg?height=80&width=80",
      alt: "Creative Project",
      x: "12%",
      y: "55%",
      delay: 0.6,
    },
    {
      type: "logo",
      content: (
        <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
        </svg>
      ),
      alt: "Apple",
      x: "18%",
      y: "75%",
      delay: 0.9,
    },

    // Center/Middle elements - above the name
    {
      type: "logo",
      content: (
        <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205 31.247 31.247 0 0 0 .016 12.002a31.247 31.247 0 0 0 .512 5.797 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.797 31.247 31.247 0 0 0-.5-5.797zM9.609 15.601V8.408l6.264 3.602z"/>
        </svg>
      ),
      alt: "Microsoft",
      x: "35%",
      y: "10%",
      delay: 1.2,
    },
    {
      type: "photo",
      content: "/placeholder.svg?height=80&width=80",
      alt: "Portfolio Piece",
      x: "45%",
      y: "25%",
      delay: 1.5,
      size: "small",
    },
    {
      type: "logo",
      content: (
        <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      ),
      alt: "GitHub",
      x: "55%",
      y: "15%",
      delay: 1.8,
    },
    {
      type: "photo",
      content: "/placeholder.svg?height=80&width=80",
      alt: "Art Direction",
      x: "42%",
      y: "73%",
      delay: 2.1,
      size: "large",
    },

    // Right side elements
    {
      type: "logo",
      content: (
        <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.99 0C5.362 0 0 5.362 0 12s5.362 12 11.99 12c6.628 0 11.99-5.362 11.99-12S18.618 0 11.99 0zm5.424 7.968l-5.458 7.932H8.033l3.458-5.025-3.458-5.025h3.923l5.458 7.118z"/>
        </svg>
      ),
      alt: "Starbucks",
      x: "78%",
      y: "20%",
      delay: 2.4,
    },
    {
      type: "photo",
      content: "/placeholder.svg?height=80&width=80",
      alt: "Brand Design",
      x: "85%",
      y: "40%",
      delay: 2.7,
    },
    {
      type: "logo",
      content: (
        <svg width="50" height="50" viewBox="0 0 87.5 100" fill="currentColor">
          <defs>
            <clipPath id="a">
              <path d="M0 0h87.5v100H0z"/>
            </clipPath>
          </defs>
          <g clipPath="url(#a)">
            <path d="M43.75 0C19.62 0 0 19.62 0 43.75S19.62 87.5 43.75 87.5 87.5 67.88 87.5 43.75 67.88 0 43.75 0z" fill="#00704A"/>
            <path d="M43.75 84.38C21.34 84.38 3.13 66.16 3.13 43.75S21.35 3.13 43.75 3.13 84.38 21.34 84.38 43.75 66.16 84.38 43.75 84.38zM21.88 43.75c0-12.08 9.79-21.88 21.87-21.88S65.63 31.67 65.63 43.75 55.83 65.63 43.75 65.63 21.88 55.83 21.88 43.75z" fill="#FFF"/>
          </g>
        </svg>
      ),
      alt: "McDonald's",
      x: "88%",
      y: "65%",
      delay: 3.0,
    },
    {
      type: "photo",
      content: "/placeholder.svg?height=80&width=80",
      alt: "Visual Identity",
      x: "82%",
      y: "80%",
      delay: 3.3,
      size: "small",
    },

    // Additional scattered elements for more dynamic layout
    {
      type: "logo",
      content: (
        <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 0v24h24V0H0zm13.5 18h-3v-6h3v6zm-1.5-7.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>
      ),
      alt: "Apple",
      x: "25%",
      y: "90%",
      delay: 3.6,
    },
    {
      type: "photo",
      content: "/placeholder.svg?height=80&width=80",
      alt: "Design Excellence",
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
        >
          {element.type === "logo" ? (
            <div className="relative group">
              <div
                className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-2xl overflow-hidden transition-all duration-300 flex items-center justify-center"
              >
                <div className="text-white/90 group-hover:text-white transition-colors duration-300">
                  {element.content}
                </div>
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
  const portfolioItems = [
    {
      title: "Brand Identity System",
      category: "SHAKESHACK",
      description: "Complete visual identity for a sustainable fashion startup featuring modern typography and cohesive color palette",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Logo Design", "Typography", "Color Theory"],
    },
    {
      title: "Mobile App UI/UX",
      category: "JAFFA",
      description: "Intuitive meditation app with calming user experience and seamless interaction design",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["UI Design", "UX Research", "Prototyping"],
    },
    {
      title: "Editorial Photography",
      category: "FASHION",
      description: "Fashion editorial shoot for emerging designers showcasing contemporary styles",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Fashion", "Editorial", "Studio Lighting"],
    },
    {
      title: "Motion Graphics",
      category: "BRANDING",
      description: "Animated explainer video for tech startup with engaging visual storytelling",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Animation", "Motion Design", "Storytelling"],
    },
    {
      title: "Package Design",
      category: "PRODUCT",
      description: "Sustainable packaging solution for eco-friendly beauty brand",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Packaging", "Sustainability", "Brand"],
    },
  ]

  const [sparkles, setSparkles] = useState([])

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

      {/* Content Container */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div
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
              Visual Designer & Creative Director
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="text-lg max-w-2xl mx-auto leading-relaxed mb-8"
              style={{ color: "rgba(15,25,57,0.85)" }}
            >
              Crafting meaningful experiences through thoughtful design, compelling visuals, and authentic storytelling
              that resonates with audiences and drives engagement.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-sm font-light opacity-60 animate-pulse"
              style={{ color: "rgba(15,25,57,0.7)" }}
            >
              Wanna see some magic? Move your cursor around
            </motion.p>
          </div>
        </motion.div>

        {/* Portfolio Showcase */}
        <DesignShowcase items={portfolioItems} />

        {/* Image Gallery */}
        <ImageGallery />

        {/* About Section */}
        <motion.section
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
                <p className="text-lg leading-relaxed mb-6" style={{ color: "rgba(15,25,57,0.85)" }}>
                  I believe in the power of visual storytelling to create emotional connections. My approach combines
                  strategic thinking with artistic intuition, ensuring every design decision serves both aesthetic and
                  functional purposes.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: "rgba(15,25,57,0.85)" }}>
                  From concept to execution, I focus on creating cohesive brand experiences that stand out in today's
                  saturated visual landscape while remaining timeless and authentic.
                </p>
              </div>
              <div className="relative">
                <div 
                  className="aspect-square rounded-3xl p-8 backdrop-blur-sm border"
                  style={{ 
                    background: "linear-gradient(135deg, rgba(81, 106, 200, 0.2), rgba(227, 175, 100, 0.2))",
                    borderColor: "rgba(248, 247, 245, 0.2)",
                    boxShadow: "inset 0 0 0.5px rgba(255,255,255,0.05)"
                  }}
                >
                  <div 
                    className="w-full h-full rounded-2xl backdrop-blur-sm flex items-center justify-center"
                    style={{ background: "rgba(248, 247, 245, 0.5)" }}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎨</div>
                      <p className="font-medium" style={{ color: "#0F1939" }}>Creative Excellence</p>
                    </div>
                  </div>
                </div>
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
    </div>
  )
}
