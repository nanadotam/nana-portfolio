"use client"

import { useState, useEffect } from "react"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

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

  return (
    <div className={`menu-btn-container ${isMenuOpen ? "active" : ""} `}>
      {/* <div className={`nav-buttons ${isMenuOpen ? "active" : ""} `}> */}
      <div
  className={`nav-buttons ${isMenuOpen ? "active" : ""} flex justify-center items-center fixed top-10 left-0 right-0 z-50 ${isScrolled ? "scrolled" : ""} `}
>

        <button
          type="button"
          className={`menu-btn ${isScrolled ? "scrolled" : ""}`}
          onClick={toggleMenu}
          data-menu="toggle"
        >
          {isMenuOpen ? "close" : "menu"}
        </button>
        <button
          type="button"
          className={`menu-btn ${isScrolled ? "scrolled" : ""}`}
          onClick={() => scrollToSection("#home")}
        >
          home
        </button>
        <button
          type="button"
          className={`menu-btn ${isScrolled ? "scrolled" : ""}`}
          onClick={() => scrollToSection("#projects")}
        >
          projects
        </button>
        <button
          type="button"
          className={`menu-btn ${isScrolled ? "scrolled" : ""}`}
          onClick={() => scrollToSection("#about")}
        >
          about
        </button>
        <button
          type="button"
          className={`menu-btn ${isScrolled ? "scrolled" : ""}`}
          onClick={() => scrollToSection("#contact")}
        >
          contact
        </button>
      </div>
    </div>
  )
}
