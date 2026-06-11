"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import { Mic, ArrowRight, ArrowDown } from "lucide-react"

const MOTIONS = [
  "This house would ban...",
  "Resolved: AI must be regulated",
  "Free education for all?",
  "Climate action over economy",
  "Should social media...",
]

const POSITIONS = [
  { top: "14%", left: "6%", rotate: -7 },
  { top: "22%", right: "8%", rotate: 5 },
  { top: "58%", left: "5%", rotate: 3 },
  { top: "68%", right: "7%", rotate: -5 },
  { top: "80%", left: "12%", rotate: 2 },
]

export function Hero({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative overflow-hidden min-h-[88vh] flex items-center">
      <motion.div
        aria-hidden
        className="absolute -top-40 -right-40 size-[36rem] rounded-full bg-primary/15 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-40 -left-40 size-[36rem] rounded-full bg-amber-500/10 blur-3xl"
        animate={{ x: [0, -25, 0], y: [0, -15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      {MOTIONS.map((m, i) => {
        const pos = POSITIONS[i]
        return (
          <motion.div
            key={i}
            className="absolute hidden md:flex items-center gap-2 bg-card/80 backdrop-blur border rounded-full px-4 py-2 text-xs shadow-sm pointer-events-none"
            style={{ top: pos.top, left: pos.left, right: pos.right, rotate: `${pos.rotate}deg` }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.85, scale: 1, y: [0, -12, 0] }}
            transition={{
              opacity: { delay: 0.4 + i * 0.15, duration: 0.5 },
              scale: { delay: 0.4 + i * 0.15, duration: 0.5 },
              y: { duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 },
            }}
          >
            <span className="size-1.5 rounded-full bg-primary/60" />
            <span className="text-muted-foreground">{m}</span>
          </motion.div>
        )
      })}

      <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm mb-8 border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Mic className="size-4" />Where ideas meet voice
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-[1.05]">
          {["We", "debate"].map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.6, ease: "easeOut" }}
            >
              {word}
            </motion.span>
          ))}
          <motion.span
            className="inline-block bg-gradient-to-r from-primary via-primary to-amber-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
          >
            everything.
          </motion.span>
        </h1>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          From parliamentary chambers to public forums, our club trains sharp thinkers and powerful speakers across tournaments worldwide.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-3 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Link href="/members">
            <Button size="lg" className="group">
              Meet our members
              <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          {!isLoggedIn && (
            <Link href="/signup">
              <Button size="lg" variant="outline">Join the club</Button>
            </Link>
          )}
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 1.5, duration: 0.5 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <ArrowDown className="size-5" />
      </motion.div>
    </section>
  )
}
