"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentView, setCurrentView] = useState("developer")
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Detect current view from pathname
  useEffect(() => {
    if (pathname?.includes("/designer") || pathname === "/designer") {
      setCurrentView("designer")
    } else if (pathname?.includes("/developer") || pathname === "/developer") {
      setCurrentView("developer")
    } else {
      // Check current route/component context
      const isDeveloperView = document.querySelector('.matrix-bg') || document.querySelector('#matrix')
      const isDesignerView = document.querySelector('.hero-interactive-area')
      
      if (isDesignerView) {
        setCurrentView("designer")
      } else if (isDeveloperView) {
        setCurrentView("developer")
      }
    }
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      setIsMenuOpen(false)
    }
  }

  // Navigation items for each view
  const developerNavItems = [
    { label: "home", target: "#home" },
    { label: "projects", target: "#projects" },
    { label: "about", target: "#about" },
    { label: "contact", target: "#contact" },
  ]

  const designerNavItems = [
    { label: "home", target: "#designer-home" },
    { label: "featured work", target: "#featured-work" },
    { label: "projects", target: "#gallery" },
    { label: "about", target: "#designer-about" },
    { label: "contact", target: "#designer-contact" },
  ]

  const navItems = currentView === "designer" ? designerNavItems : developerNavItems

  // Styling based on current view
  const getNavStyles = () => {
    if (currentView === "designer") {
      return {
        container: `fixed ${isMobile ? 'top-4' : isScrolled ? "top-4" : "top-6"} left-0 right-0 z-50 flex justify-center items-center transition-all duration-500 ${isMobile ? 'px-4' : ''}`,
        menuContainer: `
          flex items-center ${isMobile ? 'flex-wrap justify-center gap-1 px-3 py-2' : 'gap-2 px-6 py-3'} rounded-full transition-all duration-300
          ${isScrolled 
            ? "backdrop-blur-md bg-gradient-to-r from-white/10 to-white/5 border border-white/20 shadow-2xl" 
            : "backdrop-blur-sm bg-gradient-to-r from-white/5 to-white/3 border border-white/10 shadow-xl"
          }
          ${isMobile ? 'max-w-[calc(100vw-32px)] w-full' : ''}
        `,
        button: `
          ${isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'} font-medium rounded-full transition-all duration-300 relative overflow-hidden
          text-white/90 hover:text-white backdrop-blur-sm
          hover:bg-gradient-to-r hover:from-blue-400/20 hover:to-purple-400/20
          hover:border-white/30 border border-transparent
          hover:shadow-lg hover:shadow-blue-400/20
          ${isScrolled ? "text-white/95" : "text-white/80"}
          ${isMobile ? 'min-w-0 flex-shrink whitespace-nowrap' : ''}
        `,
        menuButton: `
          ${isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'} font-medium rounded-full transition-all duration-300
          text-white/90 hover:text-white backdrop-blur-sm
          ${isMenuOpen 
            ? "bg-gradient-to-r from-blue-400/30 to-purple-400/30 border-white/40 text-white shadow-lg" 
            : "hover:bg-gradient-to-r hover:from-blue-400/20 hover:to-purple-400/20 hover:border-white/30"
          }
          border border-transparent hover:shadow-lg hover:shadow-blue-400/20
        `
      }
    } else {
      return {
        container: `menu-btn-container ${isMenuOpen ? "active" : ""}`,
        menuContainer: `nav-buttons ${isMenuOpen ? "active" : ""} flex justify-center items-center fixed top-10 left-0 right-0 z-50 ${isScrolled ? "scrolled" : ""}`,
        button: `menu-btn ${isScrolled ? "scrolled" : ""}`,
        menuButton: `menu-btn ${isScrolled ? "scrolled" : ""}`
      }
    }
  }

  const styles = getNavStyles()

  if (currentView === "designer") {
    return (
      <div className={styles.container}>
        <nav className={styles.menuContainer}>
          {navItems.map((item, index) => (
            <button
              key={index}
              type="button"
              className={styles.button}
              onClick={() => scrollToSection(item.target)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    )
  }

  // Developer view (original styling)
  return (
    <div className={styles.container}>
      <div className={styles.menuContainer}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={toggleMenu}
          data-menu="toggle"
        >
          {isMenuOpen ? "close" : "menu"}
        </button>
        
        {navItems.map((item, index) => (
          <button
            key={index}
            type="button"
            className={styles.button}
            onClick={() => scrollToSection(item.target)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
