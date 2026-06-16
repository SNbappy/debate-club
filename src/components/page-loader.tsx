"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"

export function PageLoader() {
  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(true)

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      setMounted(true)
    }, 0)

    const timer = setTimeout(() => {
      setShow(false)
    }, 2300) // Plays for 2.3s, then initiates exit slide-up

    return () => {
      clearTimeout(mountTimer)
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (show) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [show, mounted])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ 
            y: "-100%",
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#081126] text-white"
        >
          {/* Injecting CSS Keyframes directly in component to keep it fully modular */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes grid-scroll {
              0% {
                background-position: 0 0;
              }
              100% {
                background-position: 0 80px;
              }
            }
          `}} />

          {/* 3D Scrolling Perspective Grid Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.24]">
            <div 
              className="w-full h-full"
              style={{
                perspective: "400px",
                perspectiveOrigin: "50% 50%",
              }}
            >
              <div 
                className="w-full h-[200%] origin-top bg-[linear-gradient(rgba(193,154,61,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(193,154,61,0.08)_1px,transparent_1px)]"
                style={{
                  backgroundSize: "80px 80px",
                  transform: "rotateX(72deg) translateZ(0)",
                  animation: "grid-scroll 24s linear infinite",
                }}
              />
            </div>
          </div>

          {/* SVGs Network Grid Overlay */}
          <svg 
            className="absolute inset-0 w-full h-full opacity-10 pointer-events-none stroke-[#C19A3D]" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            <path d="M 0 30 L 30 50 L 50 20 L 70 60 L 100 40" strokeWidth="0.1" fill="none" />
            <path d="M 0 70 L 40 40 L 60 80 L 80 30 L 100 70" strokeWidth="0.1" fill="none" />
            <circle cx="30" cy="50" r="0.6" fill="#C19A3D" />
            <circle cx="50" cy="20" r="0.6" fill="#C19A3D" />
            <circle cx="70" cy="60" r="0.6" fill="#C19A3D" />
            <circle cx="40" cy="40" r="0.6" fill="#C19A3D" />
            <circle cx="80" cy="30" r="0.6" fill="#C19A3D" />
          </svg>

          {/* Center Logo & Brand Info Container */}
          <div className="relative flex flex-col items-center z-10">
            {/* Halo Backdrop Glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 0.15, 
                scale: 1,
                transition: { delay: 0.15, duration: 1.2, ease: "easeOut" } 
              }}
              className="absolute size-48 rounded-full bg-[#C19A3D] blur-3xl"
            />

            {/* Back-to-front Zooming Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.25, filter: "blur(8px)" }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                filter: "blur(0px)",
                transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } 
              }}
              className="flex size-24 items-center justify-center rounded-3xl border border-white/10 bg-white/8 p-4 shadow-[0_12px_40px_rgba(8,17,38,0.32)] backdrop-blur-md"
            >
              <img
                src="/logo.png"
                alt="JUST Debate Club"
                className="h-16 w-16 object-contain"
              />
            </motion.div>

            {/* Spaced Serif Title */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.45, duration: 0.6, ease: "easeOut" } 
              }}
              className="mt-6 font-display text-[1.45rem] font-medium tracking-[0.32em] text-[#FCFAF6] text-center"
            >
              JUST DEBATE CLUB
            </motion.h1>

            {/* Motivate Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 0.58,
                transition: { delay: 0.75, duration: 0.6 } 
              }}
              className="mt-3 text-[10px] uppercase tracking-[0.24em] text-[#F6E7B8]"
            >
              Reason • Clarity • Conviction
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
