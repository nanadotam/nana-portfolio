"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import PersonaToggleOverlay from "./components/PersonaToggleOverlay"

export default function HomePage() {
  const router = useRouter()
  const [showOverlay, setShowOverlay] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has seen the persona toggle before
    const hasSeenPersonaToggle = localStorage.getItem("hasSeenPersonaToggle")
    const savedView = localStorage.getItem("preferredView")
    
    if (hasSeenPersonaToggle && savedView) {
      // Returning user - redirect directly to their preferred view
      router.replace(`/${savedView}`)
    } else {
      // New user - show the persona toggle overlay
      setShowOverlay(true)
      setIsLoading(false)
    }
  }, [router])

  const handlePersonaSelect = (persona) => {
    setShowOverlay(false)
    // Navigation is handled by the overlay component
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-green-400 font-mono">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {showOverlay && (
        <PersonaToggleOverlay onSelect={handlePersonaSelect} />
      )}
    </>
  )
}
