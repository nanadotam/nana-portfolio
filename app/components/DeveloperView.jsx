"use client"

import { useEffect, useState } from "react"
import Navigation from "./Navigation"
import Header from "./Header"
import Projects from "./Projects"
import About from "./About"
import Contact from "./Contact"
import Footer from "./Footer"
import PersistentPersonaToggle from "./PersistentPersonaToggle"
import ScrollIndicator from "./ScrollIndicator"
import ProjectModal from "./ProjectModal"

export default function DeveloperView() {
  const [selectedProject, setSelectedProject] = useState(null)

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
        <Projects onProjectSelect={setSelectedProject} />

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

      {/* Project Modal - Rendered at top level for proper overlay */}
      <ProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </div>
  )
}
