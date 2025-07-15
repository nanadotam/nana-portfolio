"use client"

import { motion } from "framer-motion"

export default function ImageGallery() {
  const images = [
    { src: "/placeholder.svg?height=400&width=300", alt: "Portrait Photography" },
    { src: "/placeholder.svg?height=300&width=400", alt: "Landscape Photography" },
    { src: "/placeholder.svg?height=500&width=300", alt: "Street Photography" },
    { src: "/placeholder.svg?height=300&width=300", alt: "Abstract Art" },
    { src: "/placeholder.svg?height=400&width=400", alt: "Product Photography" },
    { src: "/placeholder.svg?height=350&width=300", alt: "Architecture" },
  ]

  return (
    <section className="py-24 px-6 bg-white/5 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-5xl font-light text-center mb-16 text-gray-800 font-serif"
        >
          Visual Stories
        </motion.h2>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="break-inside-avoid group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-100/60 to-amber-100/60 backdrop-blur-sm border border-white/20">
                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-medium drop-shadow-md">{image.alt}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
