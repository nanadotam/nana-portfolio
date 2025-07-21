"use client"

import { useEffect, useState } from "react"
import Navigation from "./Navigation"
import Header from "./Header"
import Projects from "./Projects"
import About from "./About"
import ContactForm from "./ContactForm"
import Footer from "./Footer"
import PersistentPersonaToggle from "./PersistentPersonaToggle"
import ScrollIndicator from "./ScrollIndicator"
import ProjectModal from "./ProjectModal"
import { motion, AnimatePresence } from "framer-motion"

export default function DeveloperView() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [showContactForm, setShowContactForm] = useState(false)

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
        <Projects onProjectSelect={setSelectedProject} projectType="developer" />

        {/* About Section */}
        <About />

        {/* Contact Section */}
        <section id="contact">
          <div className="container">
            <h2 className="h2">Contact Me</h2>
            <p className="contact-text">
              Feel free to reach out for collaborations, opportunities, or just a friendly chat.
            </p>

            <div className="flex flex-col items-center space-y-6 mt-8">
              <button
                onClick={() => setShowContactForm(true)}
                className="bg-white text-black py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Get In Touch
              </button>
              
              <div className="text-center">
                <p className="contact-text mb-4">You can also reach out through my social media platforms:</p>
                <div className="social-links">
                  <a href="https://github.com/nanadotam" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/nanaamoako/" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                  <a href="https://www.tiktok.com/@unclesettings" target="_blank" rel="noopener noreferrer">
                    TikTok
                  </a>
                  <a href="https://www.instagram.com/unclesettings" target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Extra spacing for giant toggle */}
      <div className="h-80"></div>

      {/* Persistent Persona Toggle */}
      <PersistentPersonaToggle />

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowContactForm(false)
              }
            }}
          >
            <ContactForm variant="developer" onClose={() => setShowContactForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Modal - Rendered at top level for proper overlay */}
      <ProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </div>
  )
}
