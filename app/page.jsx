"use client"

import { useState, useEffect } from "react"
import LoadingScreen from "./components/LoadingScreen"
import DeveloperView from "./components/DeveloperView"

export default function HomePage() {
  // null = not yet checked, true = show loader, false = skip
  const [showLoader, setShowLoader] = useState(null)

  useEffect(() => {
    const seen = sessionStorage.getItem("nana_loaded")
    setShowLoader(!seen)
  }, [])

  const handleLoadComplete = () => {
    sessionStorage.setItem("nana_loaded", "1")
    setShowLoader(false)
  }

  // Don't render anything until we know whether to show the loader
  // (avoids a flash of DeveloperView during SSR hydration)
  if (showLoader === null) {
    return <div className="fixed inset-0 bg-black z-[99999]" />
  }

  return (
    <>
      {showLoader && <LoadingScreen onComplete={handleLoadComplete} />}
      <DeveloperView />
    </>
  )
}
