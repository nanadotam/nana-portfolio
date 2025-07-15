import "./globals.css"

export const metadata = {
  title: "Nana Amoako - Developer & Designer",
  description: "Dual-persona portfolio showcasing development and design work",
  keywords: "developer, designer, portfolio, devops, ui/ux, full-stack",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap"
          rel="stylesheet"
        />

        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body suppressHydrationWarning={true} style={{
        '--font-developer': '"JetBrains Mono", monospace',
        '--font-designer': '"Playfair Display", serif',
        '--font-designer-alt': '"Bricolage Grotesque", sans-serif'
      }}>{children}</body>
    </html>
  )
}
