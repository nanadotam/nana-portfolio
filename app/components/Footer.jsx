"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  // SVG icons as React components with white color
  const GithubIcon = () => (
    <svg width="32" height="32" viewBox="0 0 20 20" fill="white" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M10,1C15.523,1,20,5.59,20,11.253C20,15.782,17.138,19.624,13.167,20.981C12.66,21.082,12.48,20.762,12.48,20.489C12.48,20.151,12.492,19.047,12.492,17.675C12.492,16.719,12.172,16.095,11.813,15.777C14.04,15.523,16.38,14.656,16.38,10.718C16.38,9.598,15.992,8.684,15.35,7.966C15.454,7.707,15.797,6.664,15.252,5.252C15.252,5.252,14.414,4.977,12.505,6.303C11.706,6.076,10.85,5.962,10,5.958C9.15,5.962,8.295,6.076,7.497,6.303C5.586,4.977,4.746,5.252,4.746,5.252C4.203,6.664,4.546,7.707,4.649,7.966C4.01,8.684,3.619,9.598,3.619,10.718C3.619,14.646,5.954,15.526,8.175,15.785C7.889,16.041,7.63,16.493,7.54,17.156C6.97,17.418,5.522,17.871,4.63,16.304C4.63,16.304,4.101,15.319,3.097,15.247C3.097,15.247,2.122,15.234,3.029,15.87C3.029,15.87,3.684,16.185,4.139,17.37C4.139,17.37,4.726,19.2,7.508,18.58C7.513,19.437,7.522,20.245,7.522,20.489C7.522,20.76,7.338,21.077,6.839,20.982C2.865,19.627,0,15.783,0,11.253C0,5.59,4.478,1,10,1Z" />
      </g>
    </svg>
  )

  const LinkedinIcon = () => (
    <svg width="32" height="32" viewBox="0 0 20 20" fill="white" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M20,19.5h-4v-6.999c0-1.92-0.847-2.991-2.366-2.991c-1.653,0-2.634,1.116-2.634,2.991V19.5h-4v-13h4v1.462
          c0,0,1.255-2.202,4.083-2.202c2.829,0,4.917,1.726,4.917,5.298V19.5z M2.442,3.421C1.093,3.421,0,2.319,0,0.96
          C0,0.102,1.093-1,2.442-1c1.348,0,2.441,1.102,2.441,2.46C4.883,2.319,3.79,3.421,2.442,3.421z M0,19.5h5v-13H0V19.5z"/>
      </g>
    </svg>
  )

  const InstagramIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" />
        <circle cx="18" cy="6" r="1" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z" />
      </g>
    </svg>
  )

  const TiktokIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
    </svg>
  )

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/logo/nana-amoako-logo-white.png"
              alt="Nana Amoako Logo"
              width={48}
              height={48}
              className="mb-4 opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          {/* Social Links */}
          <nav>
            <ol className="footer-links flex justify-center gap-4 mb-4">
              <li className="footer-link">
                <a
                  title="GitHub"
                  href="https://github.com/nanadotam"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <GithubIcon />
                </a>
              </li>
              <li className="footer-link">
                <a
                  title="LinkedIn"
                  href="https://www.linkedin.com/in/nanaamoako/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon />
                </a>
              </li>
              <li className="footer-link">
                <a
                  title="Instagram"
                  href="https://instagram.com/nanadotam"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
              </li>
              <li className="footer-link">
                <a
                  title="TikTok"
                  href="https://tiktok.com/@nanadotam"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                >
                  <TiktokIcon />
                </a>
              </li>
            </ol>
          </nav>

          <p className="footer-text text-[#E8DDD0]">
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
