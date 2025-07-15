"use client"

import { useState } from "react"
import PersonaToggleOverlay from "./components/PersonaToggleOverlay"

export default function HomePage() {
  const [showOverlay, setShowOverlay] = useState(true)

  const handlePersonaSelect = (persona) => {
    setShowOverlay(false)
    // Navigation is handled by the overlay component
  }

  return (
    <>
      {showOverlay && (
        <PersonaToggleOverlay onSelect={handlePersonaSelect} />
      )}
    </>
  )
}
