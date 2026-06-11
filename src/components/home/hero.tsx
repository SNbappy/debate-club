"use client"

import { motion, useReducedMotion } from "motion/react"
import { ArrowRight, Award, Sparkles, Trophy, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeroSlider } from "./hero-slider"

export function Hero({ memberCount }: { memberCount: number }) {
  const safeMemberCount = Number.isFinite(memberCount) && memberCount > 0 ? memberCount : 0
  const shouldReduceMotion = useReducedMotion()

  const fadeUp = (delay = 0) => ({
    initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: shouldReduceMotion
      ? { duration: 0 }
      : { duration: 0.42, delay, ease: "easeOut" },
  })

  return (
    <section className="relative min-h-[82svh] overflow-hidden -mt-16 text-white sm:min-h-screen">
      <HeroSlider />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,30,61,0.90)_0%,rgba(15,30,61,0.76)_28%,rgba(15,30,61,0.48)_56%,rgba(15,30,61,0.72)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#081126]/50 to-transparent sm:h-32" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0F1E3D] via-[#0F1E3D]/65 to-transparent sm:h-44" />

      <div className="relative z-10 mx-auto flex min-h-[82svh] max-w-7xl items-center px-5 pt-24 pb-10 sm:min-h-screen sm:px-6 sm:pt-32 sm:pb-16 md:pt-36 md:pb-20">
        <div className="w-full max-w-5xl">
          <motion.div {...fadeUp(0)}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-white/90 backdrop-blur-md sm:text-[11px] md:text-xs">
              {/* <Sparkles className="size-3 text-[#C19A3D]" /> */}
              Official Debate Society
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.14)}>
            <h1 className="mt-5 max-w-4xl font-display text-[3rem] leading-[0.88] tracking-[-0.04em] text-white sm:mt-6 sm:text-[4.4rem] sm:leading-[0.84] md:text-[5.8rem] lg:text-[6.6rem]">
              Where <span className="text-[#C19A3D] italic">ideas</span>
              <br />
              take stage.
            </h1>
          </motion.div>

          <motion.div {...fadeUp(0.3)}>
            <p className="mt-5 max-w-xl text-[0.98rem] leading-[1.72] text-white/82 sm:mt-6 sm:max-w-2xl sm:text-[1.02rem] sm:leading-[1.85] md:text-[1.14rem]">
              JUST Debate Club is where Bangladesh&apos;s sharpest student voices are forged — through rigorous debate,
              public speaking, and intellectual discourse in both Bangla and English.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.46)}>
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4 md:mt-10">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-12 w-full rounded-xl bg-[#C19A3D] px-8 text-base font-semibold text-black shadow-[0_18px_46px_rgba(193,154,61,0.28)] hover:bg-[#A88330] sm:h-13 sm:w-auto"
                >
                  Join the club
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/members" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full rounded-xl border-white/25 bg-white/6 px-8 text-base text-white backdrop-blur-md hover:bg-white/14 sm:h-13 sm:w-auto"
                >
                  Meet our members
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.62)}>
            <div className="hidden max-w-4xl gap-4 sm:mt-12 sm:grid sm:grid-cols-3 md:mt-14">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/7 px-5 py-5 backdrop-blur-md">
                <div className="mb-2 flex items-center gap-2 text-[#C19A3D]">
                  <Users className="size-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.24em]">Community</span>
                </div>
                <div className="text-3xl font-bold text-white md:text-[2rem]">{safeMemberCount}+</div>
                <div className="mt-1 text-sm leading-relaxed text-white/70">
                  Verified members building articulate futures.
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-white/10 bg-white/7 px-5 py-5 backdrop-blur-md">
                <div className="mb-2 flex items-center gap-2 text-[#C19A3D]">
                  <Trophy className="size-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.24em]">Debate</span>
                </div>
                <div className="text-3xl font-bold leading-[1.02] text-white md:text-[2rem]">Bangla + English</div>
                <div className="mt-1 text-sm leading-relaxed text-white/70">
                  Competitive formats, training, and practice culture.
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-white/10 bg-white/7 px-5 py-5 backdrop-blur-md">
                <div className="mb-2 flex items-center gap-2 text-[#C19A3D]">
                  <Award className="size-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.24em]">Recognition</span>
                </div>
                <div className="text-3xl font-bold text-white md:text-[2rem]">Certificates</div>
                <div className="mt-1 text-sm leading-relaxed text-white/70">
                  Publicly verifiable achievements and club records.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
