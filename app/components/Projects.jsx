"use client"

import { useState } from "react"
import ProjectModal from "./ProjectModal"

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null)

  const featuredRepos = [
    {
      name: "NanoClip",
      description:
        "A file transfer and universal clipboard sharing platform that allows you to send files from device to device similar to AirDrop.",
      url: "https://nanoclip.vercel.app",
    },
    {
      name: "DSA File Explorers: Virtual File Management",
      description: "A file management system with CLI and GUI built using Java.",
      url: "https://github.com/nanadotam/DSA-File-Explorers",
    },
    {
      name: "Ashesi Parking Management System",
      description: "Advanced property management system for real estate.",
      url: "https://github.com/nanadotam/apms",
    },
    {
      name: "Kumi: Making Learning Fun",
      description: "An educational platform for collaborative learning.",
      url: "https://github.com/nanadotam/kumi_fcln",
    },
    {
      name: "Recifree: Free Recipes",
      description: "A recipe sharing platform with admin dashboard features.",
      url: "https://github.com/nanadotam/Recifree",
    },
    {
      name: "Volume Gesture Control App",
      description: "Control volume with hand gestures using computer vision.",
      url: "https://github.com/nanadotam/volume-gesture-control",
    },
    {
      name: "Cocoa Price Prediction App",
      description: "Machine learning model to predict cocoa market prices.",
      url: "https://github.com/nanadotam/Cocoa-Price-Prediction",
    },
    {
      name: "text clock by nanaamoako",
      description: "A creative text-based clock implemented with JavaScript.",
      url: "https://github.com/nanadotam/text-clock-by-nanaamoako",
    },
    {
      name: "Personal Pomodoro Timer",
      description: "A custom Pomodoro timer for productivity enthusiasts.",
      url: "https://github.com/nanadotam/personal-pomodoro-timer",
    },
  ]

  const gradientImages = [
    "https://images.unsplash.com/photo-1614854262409-bc319cba5802?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1614850715973-58c3167b30a0?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1614850523527-08bd62441994?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1614851099507-f1a93001d984?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1614849286521-4c58b2f0ff15?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ]

  const handleProjectClick = (url) => {
    window.open(url, "_blank")
  }

  return (
    <section id="projects" className="project-section">
      <h2 className="h2">Projects</h2>
      <div className="project-list" id="repo-container">
        {featuredRepos.map((repo, index) => (
          <div key={index} className="project-card" onClick={() => setSelectedProject(repo)}>
          {/* <div key={index} className="project-card" onClick={() => handleProjectClick(repo.url)}> */}
            {/* <div className="project-image" style={{ backgroundImage: `url('${gradientImages[index % gradientImages.length]}')` }} /> */}
            <div
              className="project-image"
              style={{
                backgroundImage: `url('${gradientImages[index % gradientImages.length]}')`,
              }}
            />
            <div className="project-details">
              <h3>{repo.name}</h3>
              <p>{repo.description}</p>
            </div>
          </div>
        ))}
      </div>

        <ProjectModal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          project={selectedProject}
        />

    </section>
  )
}
