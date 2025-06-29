"use client"

import { useState, useEffect } from "react"

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <nav>
            <ol className="footer-links">
              <li className="footer-link">
                <a title="GitHub" href="https://github.com/nanadotam" target="_blank" rel="noopener noreferrer">
                  <img loading="lazy" src="/placeholder.svg?height=32&width=32" alt="GitHub" />
                </a>
              </li>
              <li className="footer-link">
                <a
                  title="LinkedIn"
                  href="https://www.linkedin.com/in/nanaamoako/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img loading="lazy" src="/placeholder.svg?height=32&width=32" alt="LinkedIn" />
                </a>
              </li>
            </ol>
          </nav>
          <p className="footer-text">
            &copy; <span>{currentYear}</span> • Designed & Developed by
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/nanadotam">
              {" "}
              Nana Amoako.
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
