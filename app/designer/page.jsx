import DesignerView from "../components/DesignerView"

export const metadata = {
  title: "Nana Amoako - Designer",
  description: "Creative designer portfolio — UI/UX, brand identity, visual design, photography.",
  keywords: "designer, ui/ux, creative, visual design, brand identity, portfolio, photography",
  openGraph: {
    title: "Nana Amoako — Designer",
    description: "UI/UX, brand identity, visual design & photography portfolio.",
    images: [{ url: "/images/og/og-designer.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nana Amoako — Designer",
    images: ["/images/og/og-designer.png"],
  },
}

export default function DesignerPage() {
  return <DesignerView />
}
