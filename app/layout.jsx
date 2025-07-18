import "./globals.css"

// Site configuration - update these for deployment
const siteConfig = {
  url: "https://nanaamoako.dev", // Update with your actual domain
  title: "Nana Amoako - Developer & Designer",
  description: "Portfolio showcasing full-stack development and creative design work. Experienced Developer & Designer",
  author: "Nana Amoako",
  keywords: ["developer", "designer", "portfolio", "devops", "ui/ux", "full-stack", "web development", "creative design", "photography", "filmmaking", "design", "graphic design", "marketing", "public relations"]
}

export const metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords.join(", "),
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
  },
  
  // Open Graph for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [
      {
        url: '/images/og-hero-card.png', // We'll create this
        width: 1200,
        height: 630,
        alt: 'Nana Amoako - Developer & Designer Portfolio',
      },
      {
        url: '/images/dev-profile.jpeg',
        width: 800,
        height: 600,
        alt: 'Nana Amoako Developer Profile',
      }
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    creator: '@nanaamoako', // Update with your actual Twitter handle
    images: ['/images/og-hero-card.png'],
  },

  // Favicon and icons
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.png',
        color: '#000000'
      }
    ]
  },

  // Manifest for PWA
  manifest: '/site.webmanifest',

  // Theme color
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],

  // Viewport
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },

  // Additional meta tags
  other: {
    'application-name': 'Nana Amoako Portfolio',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Nana Amoako',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileColor': '#000000',
    'msapplication-tap-highlight': 'no',
  }
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

        {/* Additional PWA and mobile optimization */}
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body suppressHydrationWarning={true} style={{
        '--font-developer': '"JetBrains Mono", monospace',
        '--font-designer': '"Playfair Display", serif',
        '--font-designer-alt': '"Bricolage Grotesque", sans-serif'
      }}>{children}</body>
    </html>
  )
}
