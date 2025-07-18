"use client"

export default function About() {
  return (
    <>
      <h2 className="h2">About Me</h2>
      <section id="about" className="about-container">
        <div className="profile-card">
          <img src="/images/dev-profile.jpeg?height=120&width=120" alt="Nana Amoako" className="profile-image" />
          <h3>Nana Amoako</h3>
          <p>Man of Many Talents (and Grace)</p>
          <div className="social-links">
            <a href="https://github.com/nanadotam" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/nanaamoako/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>LeetCode</h3>
            <p>100 Problems Solved</p>
          </div>
          <div className="stat-card">
            <h3>Projects</h3>
            <p>15 Completed</p>
          </div>
          <div className="stat-card">
            <h3>GitHub Repos</h3>
            <p>30+ Public Repos</p>
          </div>
          <div className="stat-card">
            <h3>Years of Experience</h3>
            <p>6+ Years</p>
          </div>
          <div className="stat-card">
            <h3>Tech Stack</h3>
            <p>JavaScript, Python, Java, C++, </p>
          </div>
          <div className="stat-card">
            <h3>Certifications</h3>
            <p>Google IT Support, AWS Cloud Practitioner</p>
          </div>
        </div>
      </section>
    </>
  )
}
