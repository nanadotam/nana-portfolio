import DeveloperView from "../components/DeveloperView"

export const metadata = {
  title: "Nana Amoako - Developer",
  description: "Full-stack developer portfolio showcasing technical projects, ML, and DevOps work.",
  keywords: "developer, full-stack, devops, programming, portfolio, react, next.js, python, ml",
  openGraph: {
    title: "Nana Amoako — Developer",
    description: "Full-stack developer portfolio. React, Next.js, Python, ML, DevOps.",
    images: [{ url: "/images/og/og-developer.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nana Amoako — Developer",
    images: ["/images/og/og-developer.png"],
  },
}

export default function DeveloperPage() {
  return <DeveloperView />
}
