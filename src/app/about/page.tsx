import { BookOpen, Target, Sparkles, Award, Shield, Heart } from "lucide-react"
import { Reveal } from "@/components/home/animations"

export default function AboutPage() {
  return (
    <main className="bg-white text-[#0F1E3D]">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden -mt-16 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0B1731_0%,#0F1E3D_62%,#112449_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_22%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_83%_16%,rgba(193,154,61,0.14),transparent_16%),radial-gradient(circle_at_52%_100%,rgba(8,17,38,0.6),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,30,61,0.92)_0%,rgba(15,30,61,0.74)_30%,rgba(15,30,61,0.48)_58%,rgba(15,30,61,0.76)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#081126]/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FDF8EE] via-[#FDF8EE]/45 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[55vh] max-w-7xl items-center px-6 pt-30 pb-12 md:pt-34 md:pb-14">
          <div className="max-w-4xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/90 backdrop-blur-md md:text-xs">
                <Sparkles className="size-3 text-[#C19A3D]" />
                About Us
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <h1 className="mt-6 max-w-4xl font-display text-[3.1rem] leading-[0.84] tracking-[-0.045em] text-white sm:text-[4rem] md:text-[4.9rem] lg:text-[5.4rem]">
                Where ideas meet,
                <br />
                and voices find <span className="text-[#C19A3D] italic">purpose</span>.
              </h1>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="mt-6 max-w-2xl text-[1rem] leading-[1.8] text-white/82 md:text-[1.05rem]">
                JUST Debate Club is the premier platform for critical thinking, public speaking, and intellectual discourse at Jashore University of Science and Technology.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Section 1: Our Story */}
      <section className="relative overflow-hidden bg-[#FDF8EE] py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(193,154,61,0.06),transparent_24%)]" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="space-y-6">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                  Our Story
                </div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-[#0F1E3D] sm:text-4xl md:text-5xl">
                  Shaping minds since inception.
                </h2>
                <p className="text-base leading-relaxed text-[#0F1E3D]/70">
                  Founded with the vision to nurture analytical capabilities and public eloquence among university students, JUST Debate Club has grown into a bustling hub of intellectual activity. We provide students with the structural tools, competitive arenas, and community support needed to transform raw passion into sharp, rational discourse.
                </p>
                <p className="text-base leading-relaxed text-[#0F1E3D]/70">
                  Through weekly training sessions, intra-university matches, and representation in prestigious national festivals, our members learn to approach complex social, economic, and moral issues with rigor, intelligence, and empathy.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-[#0F1E3D]/10 shadow-lg">
                <img
                  src="/images/home/about-main.jpg"
                  alt="Debaters inside JUST Debate Club"
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Section 2: Core Pillars */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24">
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <div className="mb-14 text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                Core Pillars
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0F1E3D] sm:text-4xl md:text-5xl">
                The values that guide us.
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-8 sm:grid-cols-3">
            <Reveal delay={0.05}>
              <div className="rounded-3xl border border-[#0F1E3D]/8 bg-[#FDF8EE]/45 p-8 text-center h-full flex flex-col items-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-[#C19A3D]/10 text-[#C19A3D] mb-6">
                  <BookOpen className="size-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#0F1E3D]">Reason</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#0F1E3D]/65">
                  We value logic above all. We teach debaters to strip away emotional biases and construct arguments on empirical data, structured thinking, and sound logic.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="rounded-3xl border border-[#0F1E3D]/8 bg-[#FDF8EE]/45 p-8 text-center h-full flex flex-col items-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-[#C19A3D]/10 text-[#C19A3D] mb-6">
                  <Target className="size-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#0F1E3D]">Clarity</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#0F1E3D]/65">
                  Complex ideas require simple expression. We specialize in articulating intricate geopolitical, economic, and ethical concepts in a manner that is understandable and impactful.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="rounded-3xl border border-[#0F1E3D]/8 bg-[#FDF8EE]/45 p-8 text-center h-full flex flex-col items-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-[#C19A3D]/10 text-[#C19A3D] mb-6">
                  <Heart className="size-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#0F1E3D]">Conviction</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#0F1E3D]/65">
                  A strong voice comes from robust debate. We foster the courage to speak up, challenge opinions, stand by values, and represent ideas on any national stage.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Section 3: What We Do */}
      <section className="relative overflow-hidden bg-[#FDF8EE] py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_78%,rgba(193,154,61,0.06),transparent_24%)]" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal className="lg:order-2">
              <div className="space-y-6">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                  Our Activities
                </div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-[#0F1E3D] sm:text-4xl md:text-5xl">
                  What we engage in.
                </h2>
                <div className="space-y-4 pt-2">
                  <div className="flex gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#0F1E3D]/10 text-[#C19A3D]">
                      <Sparkles className="size-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-[#0F1E3D]">Weekly Training Sessions</h4>
                      <p className="text-sm text-[#0F1E3D]/65 mt-1 leading-relaxed">
                        Interactive workshops covering British Parliamentary (BP), Asian Parliamentary (AP), and traditional debate formats.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#0F1E3D]/10 text-[#C19A3D]">
                      <Award className="size-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-[#0F1E3D]">Inter-Department Tournaments</h4>
                      <p className="text-sm text-[#0F1E3D]/65 mt-1 leading-relaxed">
                        Fierce intra-university contests designed to discover hidden debating talents across Jashore University departments.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#0F1E3D]/10 text-[#C19A3D]">
                      <Shield className="size-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-[#0F1E3D]">Public Speaking Workshops</h4>
                      <p className="text-sm text-[#0F1E3D]/65 mt-1 leading-relaxed">
                        Seminars geared toward removing stage fright, mastering body language, and honing oral presentation skills.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2} className="lg:order-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-[#0F1E3D]/10 shadow-lg">
                <img
                  src="/images/home/what-we-do.jpg"
                  alt="Weekly debating session"
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Section 4: Join Us CTA */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24">
        <div className="relative mx-auto max-w-5xl px-5 sm:px-6">
          <Reveal>
            <div className="rounded-[2.5rem] border border-[#0F1E3D]/10 bg-[radial-gradient(circle_at_14%_22%,rgba(255,255,255,0.06),transparent_18%),linear-gradient(135deg,#0B1731_0%,#0F1E3D_100%)] px-8 py-12 text-center text-white shadow-xl md:px-16 md:py-16">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ready to find your <span className="text-[#C19A3D] italic">voice</span>?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
                Join Jashore University of Science and Technology's intellectual vanguard. Whether you are a beginner or a veteran speaker, we have a place for you.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href="/signup"
                  className="rounded-full bg-[#C19A3D] px-6 py-3 text-sm font-semibold text-black hover:bg-[#A88330] transition-colors"
                >
                  Join the Club
                </a>
                <a
                  href="/contact"
                  className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
