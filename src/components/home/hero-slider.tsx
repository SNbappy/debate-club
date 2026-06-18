"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

const slides = [
  "/images/home/hero-1.webp",
  "/images/home/hero-2.jpg",
  "/images/home/hero-3.webp",
  "/images/home/hero-4.webp",
  "/images/home/hero-5.webp",
]

export function HeroSlider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, 4500)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <>
      <div className="absolute inset-0 overflow-hidden" style={{ contain: "strict" }}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={slides[index]}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            style={{ willChange: "opacity" }}
          >
            <img
              src={slides[index]}
              alt="JUST Debate Club"
              className="h-full w-full object-cover object-center sm:object-top"
              style={{ willChange: "auto" }}
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = "/images/home/hero-1.webp"
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(255,255,255,0.10),transparent_26%),radial-gradient(circle_at_80%_22%,rgba(193,154,61,0.10),transparent_20%),radial-gradient(circle_at_50%_100%,rgba(15,30,61,0.55),transparent_40%)]" />

      <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`pointer-events-auto h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-10 bg-[#C19A3D]" : "w-5 bg-white/45 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </>
  )
}
