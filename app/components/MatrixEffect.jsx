"use client"

import { useEffect, useRef } from "react"

export default function MatrixEffect() {
  const canvasRef = useRef(null)
  const animationFrameId = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()

    const fontSize = 16
    let columns = Math.floor(canvas.width / fontSize)
    let drops = Array(columns).fill(1)

    const nameText = "NANA AMOAKO"
    let isMorphing = false
    const speedFactor = 0.55

    const drawMatrix = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#0F0"
      ctx.font = `${fontSize}px monospace`

      drops.forEach((y, i) => {
        let text
        if (isMorphing) {
          text = nameText[i % nameText.length]
        } else {
          text = String.fromCharCode(65 + Math.random() * 33)
        }

        ctx.fillText(text, i * fontSize, y * fontSize)

        if (Math.random() < speedFactor) {
          drops[i]++
        }

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
      })

      animationFrameId.current = requestAnimationFrame(drawMatrix)
    }

    animationFrameId.current = requestAnimationFrame(drawMatrix)

    // Trigger morphing effect after 5 seconds
    const morphTimeout = setTimeout(() => {
      isMorphing = true
    }, 5000)

    // Handle resize
    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        const oldColumns = columns
        resizeCanvas()
        columns = Math.floor(canvas.width / fontSize)

        if (columns > oldColumns) {
          drops = [...drops, ...Array(columns - oldColumns).fill(1)]
        } else {
          drops = drops.slice(0, columns)
        }
      }, 100)
    }

    window.addEventListener("resize", handleResize)

    // Pause animation when window is not in focus (optimize performance)
    const handleBlur = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }

    const handleFocus = () => {
      animationFrameId.current = requestAnimationFrame(drawMatrix)
    }

    window.addEventListener("blur", handleBlur)
    window.addEventListener("focus", handleFocus)

    // Cleanup
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      clearTimeout(morphTimeout)
      clearTimeout(resizeTimeout)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("blur", handleBlur)
      window.removeEventListener("focus", handleFocus)
    }
  }, [])

  return <canvas ref={canvasRef} id="matrix" />
}
