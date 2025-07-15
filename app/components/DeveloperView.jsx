"use client"

import { useEffect } from "react"
import Navigation from "./Navigation"
import Header from "./Header"
import Projects from "./Projects"
import About from "./About"
import Contact from "./Contact"
import Footer from "./Footer"
import PersistentPersonaToggle from "./PersistentPersonaToggle"
import ScrollIndicator from "./ScrollIndicator"

export default function DeveloperView() {
  useEffect(() => {
    // Force dark theme for developer mode
    document.body.classList.add("dark")
    document.body.classList.remove("light")
    localStorage.setItem("theme", "dark")
  }, [])

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Header with Matrix Effect */}
      <Header />

      {/* Scroll Indicator */}
      <ScrollIndicator />

      {/* Main Content */}
      <main>
        {/* Projects Section */}
        <Projects />

        {/* About Section */}
        <About />

        {/* Contact Section */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Extra spacing for giant toggle */}
      <div className="h-80"></div>

      {/* Persistent Persona Toggle */}
      <PersistentPersonaToggle />
    </div>
  )
}
