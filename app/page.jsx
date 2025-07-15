"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import PersonaToggleOverlay from "./components/PersonaToggleOverlay"
import { AnimatedPersonaSection } from "./components/AnimatedPersonaSection"

export default function HomePage() {
  const [showOverlay, setShowOverlay] = useState(true)
  const [hasSeenToggle, setHasSeenToggle] = useState(false)

  useEffect(() => {
    // Check if user has seen the persona toggle before
    const hasSeenBefore = localStorage.getItem("hasSeenPersonaToggle")
    const preferredView = localStorage.getItem("preferredView")
    
    if (hasSeenBefore && preferredView) {
      setHasSeenToggle(true)
      setShowOverlay(false)
      // You could auto-redirect here if desired
      // window.location.href = `/${preferredView}`
    }
  }, [])

  const handlePersonaSelect = (persona) => {
    setShowOverlay(false)
    setHasSeenToggle(true)
    // Navigation is handled by the overlay component
  }

  const resetToggle = () => {
    setShowOverlay(true)
    localStorage.removeItem("hasSeenPersonaToggle")
    localStorage.removeItem("preferredView")
  }

  if (showOverlay) {
    return <PersonaToggleOverlay onSelect={handlePersonaSelect} />
  }

  // Demo/fallback page when overlay is not shown
  return (
    <div className="min-h-screen">
      <AnimatedPersonaSection>
        <div className="text-center text-white max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
              Welcome to my Portfolio
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience the intersection of development and design through an interactive, animated journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                onClick={() => window.location.href = '/developer'}
                className="px-8 py-4 bg-green-500/20 border border-green-400/30 text-green-400 rounded-lg font-semibold hover:bg-green-500/30 transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Enter Developer Mode
              </motion.button>
              
              <motion.button
                onClick={() => window.location.href = '/designer'}
                className="px-8 py-4 bg-rose-500/20 border border-rose-400/30 text-rose-400 rounded-lg font-semibold hover:bg-rose-500/30 transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Enter Designer Mode
              </motion.button>
            </div>

            {hasSeenToggle && (
              <motion.button
                onClick={resetToggle}
                className="mt-8 px-6 py-2 text-sm text-gray-400 border border-gray-600/30 rounded-lg hover:text-white hover:border-gray-400/50 transition-all duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                Reset Persona Toggle
              </motion.button>
            )}
          </motion.div>
        </div>
      </AnimatedPersonaSection>
    </div>
  )
}
