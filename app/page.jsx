"use client"

import PersonaToggleOverlay from "./components/PersonaToggleOverlay"

export default function HomePage() {
  const handlePersonaSelect = (persona) => {
    // Navigation is handled by the overlay component
  }

  return <PersonaToggleOverlay onSelect={handlePersonaSelect} />
}
