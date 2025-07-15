"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check for saved preference in localStorage
    const savedView = localStorage.getItem("preferredView")
    
    // Redirect to saved view or default to developer
    if (savedView === "designer") {
      router.replace("/designer")
    } else {
      // Default to developer view (includes cases where savedView is null or "developer")
      router.replace("/developer")
    }
  }, [router])

  // Show a loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-4"></div>
        <p className="text-green-400 font-mono">Loading...</p>
      </div>
    </div>
  )
}
