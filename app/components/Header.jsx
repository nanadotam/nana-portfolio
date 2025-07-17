"use client"

import MatrixEffect from "./MatrixEffect"

export default function Header() {
  return (
    <header id="home" className="header">
      <MatrixEffect />
      <div className="container">
        <div className="header-textbox">
          <h1 className="h1">
            <span>Hi, I'm Nana Amoako.</span>
          </h1>
          <h2 className="h2">
            <span>Developer & Graphic Designer.</span>
          </h2>
          <p className="header-text">Man of Many Talents (and Grace) creating meaningful and mindblowing things.</p>
          
          {/* Enhanced mobile-friendly button container */}
          <div className="header-btns mobile-responsive-btns">
            <a
              href="https://www.linkedin.com/in/nanaamoako/"
              className="btn btn-cta mobile-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hire me
            </a>
            <button
              type="button"
              className="btn btn-secondary mobile-btn"
              onClick={() => {
                const projectsSection = document.querySelector("#projects");
                if (projectsSection) {
                  projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            >
              See my work
            </button>
            <a
              href="/cv.pdf"
              className="btn btn-secondary mobile-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              See my CV
            </a>
          </div>
        </div>
      </div>
      
      {/* Mobile-specific styles */}
      <style jsx>{`
        .mobile-responsive-btns {
          display: inline-flex;
          gap: var(--gutter-x-small);
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          width: 100%;
          max-width: 100%;
        }

        .mobile-btn {
          flex-shrink: 1;
          min-width: 0;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Enhanced responsive breakpoints */
        @media (max-width: 768px) {
          .header-textbox {
            margin-left: 16px;
            margin-right: 16px;
            padding-left: 16px !important;
            padding-right: 16px !important;
            max-width: calc(100vw - 32px);
            box-sizing: border-box;
          }
          
          .mobile-responsive-btns {
            flex-direction: column;
            gap: 12px;
            width: 100%;
            max-width: 100%;
          }
          
          .mobile-btn {
            width: 100%;
            max-width: 280px;
            padding: 14px 24px !important;
            font-size: 1.1rem !important;
            margin: 0 auto;
          }
        }

        @media (max-width: 480px) {
          .header-textbox {
            margin-left: 12px;
            margin-right: 12px;
            padding-left: 12px !important;
            padding-right: 12px !important;
            max-width: calc(100vw - 24px);
          }
          
          .mobile-btn {
            max-width: 240px;
            padding: 12px 20px !important;
            font-size: 1rem !important;
          }
        }

        @media (max-width: 380px) {
          .header-textbox {
            margin-left: 8px;
            margin-right: 8px;
            padding-left: 8px !important;
            padding-right: 8px !important;
            max-width: calc(100vw - 16px);
          }
          
          .mobile-btn {
            max-width: 200px;
            padding: 10px 16px !important;
            font-size: 0.95rem !important;
          }
        }

        @media (max-width: 320px) {
          .header-textbox {
            margin-left: 4px;
            margin-right: 4px;
            padding-left: 4px !important;
            padding-right: 4px !important;
            max-width: calc(100vw - 8px);
          }
          
          .mobile-btn {
            max-width: 180px;
            padding: 8px 12px !important;
            font-size: 0.9rem !important;
          }
        }

        /* Ensure text doesn't overflow */
        .header-text {
          padding-left: 8px;
          padding-right: 8px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        /* Additional safety for very small screens */
        @media (max-width: 280px) {
          .mobile-btn {
            font-size: 0.85rem !important;
            padding: 6px 8px !important;
            max-width: 160px;
          }
          
          .header-textbox {
            padding: 16px 4px !important;
          }
        }
      `}</style>
    </header>
  )
}
