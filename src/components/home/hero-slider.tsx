"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"

const slides = ["/images/hero/hero-1.jpg", "/images/hero/hero-2.jpg", "/images/hero/hero-3.jpg"]

export function HeroSlider() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5500)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="absolute inset-0 bg-[#0F1E3D]">
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.4 }, scale: { duration: 7, ease: "linear" } }}
          className="absolute inset-0"
        >
          <img src={slides[index]} alt="" className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden" }} />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F1E3D]/70 via-[#0F1E3D]/50 to-[#0F1E3D]/90" />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all ${i === index ? "w-10 bg-[#C19A3D]" : "w-5 bg-white/40"}`} />
        ))}
      </div>
    </div>
  )
}
