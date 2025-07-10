"use client"

import { motion } from "framer-motion"
import ImageGallery from "./ImageGallery"
import DesignShowcase from "./DesignShowcase"
import Footer from "./Footer"
import { useState } from "react"

// Updated FloatingElements component with photos
function FloatingElements() {
  const elements = [
    // Mix of emojis and photos
    { type: "emoji", content: "🎨", x: "15%", y: "20%", delay: 0 },
    {
      type: "photo",
      content: "/images/gallery/UBORA-104.jpg",
      alt: "Design Work 1",
      x: "85%",
      y: "25%",
      delay: 0.2,
      size: "large",
    },
    { type: "emoji", content: "🖌️", x: "10%", y: "60%", delay: 0.4 },
    {
      type: "photo",
      content: "/placeholder.svg?height=80&width=80",
      alt: "Creative Project",
      x: "90%",
      y: "70%",
      delay: 0.6,
    },
    { type: "emoji", content: "💫", x: "25%", y: "80%", delay: 0.8 },
    {
      type: "photo",
      content: "/placeholder.svg?height=80&width=80",
      alt: "Portfolio Piece",
      x: "75%",
      y: "15%",
      delay: 1.0,
    },
    { type: "emoji", content: "🖼️", x: "5%", y: "40%", delay: 1.2 },
    {
      type: "photo",
      content: "/placeholder.svg?height=80&width=80",
      alt: "Art Direction",
      x: "95%",
      y: "50%",
      delay: 1.4,
    },
    { type: "emoji", content: "🌟", x: "20%", y: "35%", delay: 1.6 },
    {
      type: "photo",
      content: "/placeholder.svg?height=80&width=80",
      alt: "Brand Design",
      x: "80%",
      y: "85%",
      delay: 1.8,
    },
    { type: "emoji", content: "✏️", x: "12%", y: "75%", delay: 2.0 },
    {
      type: "photo",
      content: "/placeholder.svg?height=80&width=80",
      alt: "Visual Identity",
      x: "88%",
      y: "40%",
      delay: 2.2,
    },
  ]

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
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{
            opacity: 0.8,
            scale: 1,
            rotate: 0,
            y: [0, -10, 0],
          }}
          transition={{
            delay: element.delay,
            duration: 0.8,
            y: {
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }}
          whileHover={{
            scale: element.type === "photo" ? 1.3 : 2,
            opacity: 1,
            rotate: element.type === "photo" ? 5 : 360,
            y: -15,
            transition: {
              duration: 0.4,
              type: "spring",
              stiffness: 400,
              damping: 10,
            },
          }}
          whileTap={{
            scale: element.type === "photo" ? 1.5 : 2.5,
            rotate: element.type === "photo" ? 10 : 720,
            transition: {
              duration: 0.3,
              type: "spring",
              stiffness: 500,
              damping: 15,
            },
          }}
        >
          {element.type === "emoji" ? (
            <span className="text-2xl md:text-3xl filter drop-shadow-lg">{element.content}</span>
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
                  } rounded-2xl border-[5px] border-white shadow-lg overflow-hidden bg-gradient-to-br from-rose-100 to-amber-100 hover:shadow-xl transition-shadow duration-300`}
              >
                <img
                  src={element.content}
                  alt={element.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-400/20 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Dot indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-rose-400 to-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
          className="absolute w-2 h-2 bg-gradient-to-r from-rose-400 to-amber-400 rounded-full"
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
      category: "Branding",
      description: "Complete visual identity for a sustainable fashion startup",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Logo Design", "Typography", "Color Theory"],
    },
    {
      title: "Mobile App UI/UX",
      category: "Digital Design",
      description: "Intuitive meditation app with calming user experience",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["UI Design", "UX Research", "Prototyping"],
    },
    {
      title: "Editorial Photography",
      category: "Photography",
      description: "Fashion editorial shoot for emerging designers",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Fashion", "Editorial", "Studio Lighting"],
    },
    {
      title: "Motion Graphics",
      category: "Video",
      description: "Animated explainer video for tech startup",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Animation", "Motion Design", "Storytelling"],
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 text-gray-800">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-screen flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={handleHeroClick}
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-rose-200/30 to-amber-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-orange-200/30 to-rose-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-amber-100/20 to-rose-100/20 rounded-full blur-3xl" />
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
            className="text-6xl md:text-9xl font-light mb-6 bg-gradient-to-r from-rose-600 via-amber-600 to-orange-600 bg-clip-text text-transparent"
            style={{ fontFamily: "var(--font-bricolage)" }}
          >
            Nana Amoako
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-2xl md:text-3xl font-bricolage font-light text-gray-600 mb-8 font-serif"
          >
            Visual Designer & Creative Director
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            Crafting meaningful experiences through thoughtful design, compelling visuals, and authentic storytelling
            that resonates with audiences and drives engagement.
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
              <h2 className="text-4xl font-light mb-8 text-gray-800 font-serif">About My Creative Process</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                I believe in the power of visual storytelling to create emotional connections. My approach combines
                strategic thinking with artistic intuition, ensuring every design decision serves both aesthetic and
                functional purposes.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                From concept to execution, I focus on creating cohesive brand experiences that stand out in today's
                saturated visual landscape while remaining timeless and authentic.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-rose-200 to-amber-200 rounded-3xl p-8">
                <div className="w-full h-full bg-white/50 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎨</div>
                    <p className="text-gray-700 font-medium">Creative Excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />

      {/* <footer className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-600 text-sm mb-2">© 2023 Nana Amoako. All rights reserved.</p>
          <p className="text-gray-500 text-xs">Crafted with ❤️ in Ghana</p>
        </div>
      </footer> */}
    </div>
  )
}
