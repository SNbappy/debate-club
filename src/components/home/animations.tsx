"use client"

import { motion, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"

export function Reveal({
  children,
  delay = 0,
  className = "",
  y = 24,
  duration = 0.6,
  amount = 0.12,
  scale = 0.98,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  y?: number
  duration?: number
  amount?: number
  scale?: number
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y, scale }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration, delay, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.div>
  )
}

export function CountUp({
  end,
  duration = 1400,
}: {
  end: number
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const safeEnd = Number(end)

    if (!Number.isFinite(safeEnd) || safeEnd < 0) {
      return
    }

    const node = ref.current
    if (!node || started.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true

        const startTime = performance.now()

        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          const nextValue = Math.round(safeEnd * eased)
          setValue(Number.isFinite(nextValue) ? nextValue : 0)

          if (progress < 1) requestAnimationFrame(tick)
        }

        requestAnimationFrame(tick)
      },
      { threshold: 0.35 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [end, duration])

  return <span ref={ref}>{Number.isFinite(value) ? value : 0}</span>
}

