"use client"

export default function Contact() {
  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const name = formData.get("name")?.toString().trim()
    const email = formData.get("_replyto")?.toString().trim()
    const subject = formData.get("subject")?.toString().trim()
    const message = formData.get("message")?.toString().trim()

    if (!name || !email || !subject || !message) {
      alert("Please fill in all fields before submitting the form.")
      return
    }

    // In a real implementation, you would handle form submission here
    console.log("Form submitted:", { name, email, subject, message })
  }

  return (
    <section id="contact">
      <div className="container">
        <h2 className="h2">Contact Me</h2>
        <p className="contact-text">
          Feel free to reach out for collaborations, opportunities, or just a friendly chat.
        </p>

        <div className="contact-content">
          <form
            id="contact-form"
            className="contact-form"
            action="https://formspree.io/f/meoqoznr"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required placeholder="Your Name" />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="_replyto" required placeholder="Your Email" />
            </div>
            <div className="form-field">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" required placeholder="Subject" />
            </div>
            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" required placeholder="Your Message" />
            </div>
            <button type="submit" className="btn btn-cta">
              Send Message
            </button>
          </form>

          <div className="contact-textbox">
            <div className="logo-box">
              <img
                id="logo"
                alt="Nana Amoako's Logo"
                className="contact-logo"
                src="/logo/nana-amoako-logo-white.png"
              />
            </div>
            <p className="contact-text">You can also reach out through my social media platforms:</p>
            <div className="social-links">
              <a href="https://github.com/nanadotam" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/nanaamoako/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              {/* tiktok */}
              <a href="https://www.tiktok.com/@nanaamoako" target="_blank" rel="noopener noreferrer">
                TikTok
              </a>
              {/* instagram */}
              <a href="https://www.instagram.com/nanaamoako" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
