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
          <div className="header-btns">
            <a
              href="https://www.linkedin.com/in/nanaamoako/"
              className="btn btn-cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hire me
            </a>
            <a
              href="https://github.com/nanadotam"
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              See my work
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
