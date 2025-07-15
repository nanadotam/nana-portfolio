"use client"

import { useEffect } from "react"
import Navigation from "./Navigation"
import Header from "./Header"
import Projects from "./Projects"
import About from "./About"
import Contact from "./Contact"
import Footer from "./Footer"
import PersistentPersonaToggle from "./PersistentPersonaToggle"

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

      {/* Persistent Persona Toggle */}
      <PersistentPersonaToggle />
    </div>
  )
}
