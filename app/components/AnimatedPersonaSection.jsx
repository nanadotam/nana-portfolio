"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BackgroundGradientAnimation } from "../../components/ui/background-gradient-animation"
import Image from "next/image"

export function AnimatedPersonaSection({ 
  children, 
  hoveredPersona = null, 
  selectedPersona = null 
}) {
  const [isMobile, setIsMobile] = useState(false)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Color configurations for different persona states
  const getGradientConfig = () => {
    if (selectedPersona === "developer" || hoveredPersona === "developer") {
      return {
        gradientBackgroundStart: "rgb(0, 0, 0)",
        gradientBackgroundEnd: "rgb(10, 10, 10)",
        firstColor: "34, 197, 94", // Green primary
        secondColor: "22, 163, 74", // Green secondary  
        thirdColor: "21, 128, 61", // Green tertiary
        fourthColor: "34, 197, 94", // Green accent
        fifthColor: "74, 222, 128", // Light green
        pointerColor: "34, 197, 94"
      }
    } else if (selectedPersona === "designer" || hoveredPersona === "designer") {
      return {
        gradientBackgroundStart: "rgb(0, 0, 0)",
        gradientBackgroundEnd: "rgb(10, 5, 8)",
        firstColor: "244, 63, 94", // Rose primary
        secondColor: "225, 29, 72", // Rose secondary
        thirdColor: "190, 18, 60", // Rose tertiary
        fourthColor: "244, 63, 94", // Rose accent
        fifthColor: "251, 113, 133", // Light rose
        pointerColor: "244, 63, 94"
      }
    } else {
      // Default state - subtle green with hint of pink
      return {
        gradientBackgroundStart: "rgb(0, 0, 0)",
        gradientBackgroundEnd: "rgb(5, 5, 5)",
        firstColor: "34, 197, 94", // Green primary
        secondColor: "22, 163, 74", // Green secondary
        thirdColor: "244, 63, 94", // Pink accent (subtle)
        fourthColor: "21, 128, 61", // Green tertiary
        fifthColor: "74, 222, 128", // Light green
        pointerColor: "34, 197, 94"
      }
    }
  }

  const gradientConfig = getGradientConfig()

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Semi-transparent PNG Logo Overlay */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        animate={{
          opacity: hoveredPersona === "designer" ? 0.2 : 0.1,
        }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src="/logo/nana-amoako-logo-white.png"
          alt="Nana Amoako Logo Overlay"
          fill
          className="object-contain opacity-30 mix-blend-overlay"
          priority
        />
      </motion.div>

      {/* Animated Gradient Background */}
      <BackgroundGradientAnimation
        {...gradientConfig}
        size="90%"
        blendingValue="hard-light"
        interactive={true}
        containerClassName="h-full w-full"
      >
        {/* Logo and Name in top-left - Mobile Responsive */}
        <motion.div 
          className={`absolute z-20 flex items-center space-x-2 sm:space-x-3 ${
            isMobile ? "top-4 left-4" : "top-6 left-6"
          }`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image 
              src="/logo/nana-amoako-logo-white.png"
              width={isMobile ? 28 : 36} 
              height={isMobile ? 28 : 36} 
              alt="Nana Amoako Logo" 
              className="drop-shadow-lg"
            />
          </motion.div>

          {/* Name */}
          <motion.span 
            className={`text-white font-bold tracking-tight font-sans drop-shadow-lg ${
              isMobile ? "text-base sm:text-lg" : "text-xl md:text-2xl"
            }`}
            animate={{
              textShadow: hoveredPersona === "developer" 
                ? "0 0 20px rgba(34, 197, 94, 0.5)"
                : hoveredPersona === "designer"
                ? "0 0 20px rgba(244, 63, 94, 0.5)"
                : "0 0 10px rgba(255, 255, 255, 0.2)",
            }}
            transition={{ duration: 0.3 }}
          >
            Nana Amoako
          </motion.span>
        </motion.div>

        {/* Center Content Area */}
        <div className="absolute z-30 inset-0 flex items-center justify-center">
          {children}
        </div>

        {/* Bible Verse Overlay at Bottom - Mobile Responsive */}
        <div className={`absolute inset-x-0 bottom-0 flex flex-col items-center justify-center pointer-events-none z-10 ${
          isMobile ? "px-4 pb-4" : "px-6 pb-6"
        }`}>
          <div className={`bg-black/10 rounded-[16px] shadow-lg mx-auto ${
            isMobile ? "px-3 py-2 max-w-xs mb-3" : "px-4 py-2 max-w-md mb-4"
          }`}>
            <p className={`italic text-center font-serif text-gray-300 ${
              isMobile ? "text-[10px] leading-tight" : "text-xs md:text-[10px]"
            }`}>
              the LORD, has filled Nana Koaku Amoako<br />
              with the Spirit of God in wisdom and skill,<br />
              in understanding and intelligence, in knowledge,<br />
              and in all kinds of craftsmanship
            </p>
            <p className={`mt-2 text-center font-serif text-gray-400 ${
              isMobile ? "text-[8px]" : "text-[10px]"
            }`}>
              <span className="font-bold text-gray-200">Exodus 31:3</span>
            </p>
          </div>
        </div>

        {/* Persona-specific background effects */}
        {hoveredPersona === "developer" && (
          <motion.div
            className="absolute inset-0 z-5 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Matrix-like dots effect */}
            <div className="matrix-dots w-full h-full opacity-20" />
            
            {/* Animated code-like lines - Fewer on mobile */}
            {[...Array(isMobile ? 8 : 12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-px bg-green-400/10"
                style={{ 
                  left: `${(i * (isMobile ? 12 : 8)) % 100}%`,
                  height: "100%"
                }}
                animate={{
                  opacity: [0.1, 0.4, 0.1],
                  scaleY: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </motion.div>
        )}

        {hoveredPersona === "designer" && (
          <motion.div
            className="absolute inset-0 z-5 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Organic floating shapes - Fewer on mobile */}
            {[...Array(isMobile ? 5 : 8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-gradient-to-br from-rose-200/5 to-pink-200/5 blur-xl"
                style={{
                  left: `${(i * 15) % 80}%`,
                  top: `${(i * 20) % 70}%`,
                  width: `${(isMobile ? 40 : 60) + Math.random() * (isMobile ? 60 : 100)}px`,
                  height: `${(isMobile ? 40 : 60) + Math.random() * (isMobile ? 60 : 100)}px`,
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.1, 0.3, 0.1],
                  x: [0, Math.random() * 20 - 10, 0],
                  y: [0, Math.random() * 20 - 10, 0],
                }}
                transition={{
                  duration: 5 + Math.random() * 3,
                  repeat: Infinity,
                  delay: i * 0.6,
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Background transition effects */}
        <motion.div
          className="absolute inset-0 z-1"
          animate={{
            background: selectedPersona === "developer" 
              ? "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(34, 197, 94, 0.1) 100%)"
              : selectedPersona === "designer"
              ? "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(244, 63, 94, 0.1) 100%)"
              : "transparent",
          }}
          transition={{ duration: 0.5 }}
        />
      </BackgroundGradientAnimation>
    </div>
  )
} 