import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"

import { Hero } from "@/components/home/hero"
import { CountUp, Reveal } from "@/components/home/animations"
import { WelcomeSection } from "@/components/home/welcome-section"
import {
  Trophy,
  Calendar,
  Mic,
  ArrowRight,  Camera,
  BookOpen,
  Scale,
  MessagesSquare,
  BrainCircuit,
  GraduationCap,
  Files,
} from "lucide-react"

export default async function Home() {
  const supabase = await createClient()
  const [{ data: events }, { data: albums }, { count: memberCount }] = await Promise.all([
    supabase.from("events").select("*").eq("is_published", true).order("event_date", { ascending: false }).limit(3),
    supabase.from("gallery_albums").select("*").eq("is_published", true).order("created_at", { ascending: false }).limit(4),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_verified", true),
  ])

  const safeMemberCount = Number(memberCount ?? 0)
  const stats = [
    {
      value: Number.isFinite(safeMemberCount) ? safeMemberCount : 0,
      label: "Active members",
      suffix: "+",
      note: "Verified public profiles",
    },
    {
      value: 25,
      label: "Tournaments",
      suffix: "+",
      note: "Campus and beyond",
    },
    {
      value: 100,
      label: "Events held",
      suffix: "+",
      note: "Sessions, workshops, and rounds",
    },
    {
      value: 5,
      label: "Years strong",
      suffix: "+",
      note: "Growing a debate culture",
    },
  ]

  return (
    <>
            <Hero memberCount={safeMemberCount} />



      <WelcomeSection />

      <section className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(193,154,61,0.08),transparent_20%),radial-gradient(circle_at_82%_14%,rgba(15,30,61,0.05),transparent_18%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <Reveal>
            <div className="max-w-2xl">
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">About JUSTDC</div>
              <h2 className="font-display text-[1.9rem] font-bold leading-[0.96] tracking-tight text-[#0F1E3D] sm:text-4xl md:text-5xl lg:text-[4.2rem]">
                A debating society built on reasoning, rigor, and responsibility.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-[#0F1E3D]/72">
                JUST Debate Club is more than a competitive platform. It is a culture of disciplined thinking,
                careful listening, persuasive speech, and respectful challenge — helping students grow as speakers,
                leaders, and intellectually confident individuals.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-[#0F1E3D]/10 bg-[#FDF8EE] p-5">
                  <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-[#0F1E3D] text-white">
                    <BookOpen className="size-5" />
                  </div>
                  <div className="font-display text-[1.7rem] leading-none text-[#0F1E3D]">Learn deeply</div>
                  <p className="mt-3 text-sm leading-6 text-[#0F1E3D]/68">
                    Practice argumentation, reading, rebuttal, and structured thinking.
                  </p>
                </div>

                <div className="rounded-[1.4rem] border border-[#0F1E3D]/10 bg-[#FDF8EE] p-5">
                  <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-[#0F1E3D] text-white">
                    <Scale className="size-5" />
                  </div>
                  <div className="font-display text-[1.7rem] leading-none text-[#0F1E3D]">Debate fairly</div>
                  <p className="mt-3 text-sm leading-6 text-[#0F1E3D]/68">
                    Build confidence with respect, discipline, and intellectual honesty.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/posts"
                  className="inline-flex items-center gap-2 border-b-2 border-[#C19A3D] pb-1 font-semibold text-[#0F1E3D] transition-all hover:gap-3"
                >
                  Read our story
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative">
              <div className="relative overflow-hidden rounded-[1.9rem] bg-[#0F1E3D] shadow-[0_32px_80px_rgba(15,30,61,0.16)]">
                <div className="aspect-[4/4.4]">
                  <img
                    src="/images/home/about-main.jpg"
                    alt="JUST Debate Club members together"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0F1E3D]/28 via-transparent to-[#C19A3D]/10" />
              </div>

              <div className="absolute -bottom-5 left-6 rounded-[1.35rem] bg-[#C19A3D] px-5 py-4 text-black shadow-2xl">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em]">Established momentum</div>
                <div className="text-3xl font-bold leading-none">5+</div>
                <div className="mt-1 text-sm opacity-80">Years of presence</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0F1E3D] py-16 sm:py-20 text-white md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(193,154,61,0.16),transparent_28%),radial-gradient(circle_at_82%_78%,rgba(193,154,61,0.12),transparent_24%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <Reveal>
              <div className="max-w-2xl">
                <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">Inside the club</div>
                <h2 className="font-display text-[1.9rem] leading-[0.96] tracking-tight sm:text-4xl md:text-5xl lg:text-[4.2rem]">
                  Every argument begins long before the stage.
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-white/76">
                  Beyond competitions, JUSTDC is built on practice, reading, rebuttal drills, peer feedback,
                  and the steady discipline of showing up prepared. This is where confidence is shaped session by session.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                    <div className="mb-3 flex items-center gap-2 text-[#C19A3D]">
                      <MessagesSquare className="size-4" />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Practice flow</span>
                    </div>
                    <div className="font-display text-[1.8rem] leading-none text-white">Speak. Respond. Refine.</div>
                    <p className="mt-3 text-sm leading-6 text-white/72">
                      Members improve through mock rounds, rebuttal sessions, feedback circles, and repeated practice.
                    </p>
                  </div>

                  <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                    <div className="mb-3 flex items-center gap-2 text-[#C19A3D]">
                      <BrainCircuit className="size-4" />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Mental discipline</span>
                    </div>
                    <div className="font-display text-[1.8rem] leading-none text-white">Think with structure.</div>
                    <p className="mt-3 text-sm leading-6 text-white/72">
                      The club trains students to listen carefully, organize ideas, and respond with clarity under pressure.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/78">
                  <div className="rounded-full border border-white/12 bg-white/6 px-4 py-2">Training sessions</div>
                  <div className="rounded-full border border-white/12 bg-white/6 px-4 py-2">Research culture</div>
                  <div className="rounded-full border border-white/12 bg-white/6 px-4 py-2">Rebuttal practice</div>
                  <div className="rounded-full border border-white/12 bg-white/6 px-4 py-2">Peer feedback</div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="relative">
                <div className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[#132750] shadow-[0_32px_80px_rgba(0,0,0,0.26)]">
                  <div className="aspect-[4/4.4]">
                    <img
                      src="/images/home/inside-club.jpg"
                      alt="JUST Debate Club practice session"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0F1E3D]/72 via-[#0F1E3D]/18 to-transparent" />
                </div>

                <div className="absolute -bottom-5 left-6 rounded-[1.35rem] bg-white px-5 py-4 text-[#0F1E3D] shadow-2xl">
                  <div className="mb-1 flex items-center gap-2 text-[#C19A3D]">
                    <Mic className="size-4" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Practice matters</span>
                  </div>
                  <div className="font-display text-[2rem] leading-none">Think. Speak. Respond.</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#FDF8EE] py-16 sm:py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(193,154,61,0.11),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="mb-10 max-w-2xl">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">Our impact</div>
              <h2 className="font-display text-[1.9rem] leading-[0.96] tracking-tight text-[#0F1E3D] sm:text-4xl md:text-5xl">
                Measured in growth, consistency, and participation.
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-4 md:gap-5 xl:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.07}>
                <div className="group relative overflow-hidden rounded-[1.35rem] border border-[#0F1E3D]/10 bg-white p-4 sm:p-6 shadow-[0_16px_44px_rgba(15,30,61,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(15,30,61,0.10)]">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#C19A3D] via-[#D8B15A] to-[#C19A3D]/40" />
                  <div className="mb-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0F1E3D]/52">
                    {s.label}
                  </div>
                  <div className="font-display text-[2.4rem] leading-none tracking-tight text-[#0F1E3D] sm:text-[3rem] md:text-[3.6rem]">
                    <CountUp end={s.value} />
                    {s.suffix}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#0F1E3D]/66">{s.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-28">
  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(253,248,238,0.45)_0%,rgba(255,255,255,1)_28%)]" />
  <div className="relative mx-auto max-w-6xl px-6">
    <Reveal>
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="max-w-[40rem]">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">What we do</div>
          <h2 className="font-display text-[1.9rem] leading-[0.96] tracking-tight text-[#0F1E3D] sm:text-4xl md:text-5xl lg:text-[3.8rem]">
            Debate training that turns participation into progress.
          </h2>
        </div>

        <p className="max-w-[32rem] text-lg leading-relaxed text-[#0F1E3D]/70 lg:justify-self-end">
          JUSTDC helps students learn how to think clearly, speak confidently, compete responsibly,
          and document their growth through visible achievements and verified records.
        </p>
      </div>
    </Reveal>

    <div className="mt-10 grid gap-6 lg:grid-cols-[1.18fr_0.82fr]">
      <Reveal delay={0.06}>
        <div className="group relative overflow-hidden rounded-[1.9rem] border border-[#0F1E3D]/10 bg-[#0F1E3D] text-white shadow-[0_28px_80px_rgba(15,30,61,0.14)]">
          <div className="absolute inset-0">
            <img
              src="/images/home/what-we-do.jpg"
              alt="JUST Debate Club members in training"
              className="h-full w-full object-cover object-center opacity-72 transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,30,61,0.42)_0%,rgba(15,30,61,0.36)_38%,rgba(15,30,61,0.72)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,30,61,0.74)_0%,rgba(15,30,61,0.46)_42%,rgba(15,30,61,0.20)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0F1E3D]/80 to-transparent" />

          <div className="relative p-7 md:p-8">
            <div className="max-w-xl">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white/12 text-[#C19A3D] backdrop-blur-sm">
                <GraduationCap className="size-7" />
              </div>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
                Core development
              </div>
              <h3 className="font-display text-[2.2rem] leading-[0.95] tracking-tight text-white md:text-[2.55rem]">
                Training, mentoring, and stage confidence.
              </h3>
              <p className="mt-5 text-[15px] leading-7 text-white/84">
                Members build fluency through workshops, mock rounds, feedback sessions, and regular speaking practice
                in both Bangla and English formats.
              </p>

              <div className="mt-7 flex flex-wrap gap-3 text-sm text-white/82">
                <div className="rounded-full border border-white/18 bg-white/10 px-4 py-2">Mock sessions</div>
                <div className="rounded-full border border-white/18 bg-white/10 px-4 py-2">Format training</div>
                <div className="rounded-full border border-white/18 bg-white/10 px-4 py-2">Confidence building</div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-6">
        <Reveal delay={0.12}>
          <div className="min-h-[180px] md:min-h-[220px] rounded-[1.7rem] border border-[#0F1E3D]/10 bg-[#FDF8EE] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#0F1E3D] text-white">
              <Trophy className="size-5" />
            </div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
              Competitive exposure
            </div>
            <h3 className="font-display text-[2rem] leading-none text-[#0F1E3D]">Tournaments</h3>
            <p className="mt-3 text-[15px] leading-7 text-[#0F1E3D]/68">
              Intra-university and national debate opportunities that sharpen performance under pressure.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="min-h-[180px] md:min-h-[220px] rounded-[1.7rem] border border-[#0F1E3D]/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#0F1E3D] text-white">
              <Files className="size-5" />
            </div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
              Visible outcomes
            </div>
            <h3 className="font-display text-[2rem] leading-none text-[#0F1E3D]">Recognition</h3>
            <p className="mt-3 text-[15px] leading-7 text-[#0F1E3D]/68">
              Verified achievements, public member identity, and certificate records that preserve progress.
            </p>
          </div>
        </Reveal>
      </div>
    </div>

    <Reveal delay={0.22}>
      <div className="mt-8">
        <Link
          href="/members"
          className="inline-flex items-center gap-2 border-b-2 border-[#C19A3D] pb-1 font-semibold text-[#0F1E3D] transition-all hover:gap-3"
        >
          Explore member profiles
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </Reveal>
  </div>
</section>

      {events && events.length > 0 && (
        <section className="relative overflow-hidden bg-[#FDF8EE] py-16 sm:py-20 md:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(193,154,61,0.10),transparent_24%),radial-gradient(circle_at_82%_76%,rgba(15,30,61,0.05),transparent_22%)]" />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
                <div className="max-w-2xl">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">Recent events</div>
                  <h2 className="font-display text-[1.9rem] leading-[0.96] tracking-tight text-[#0F1E3D] sm:text-[1.9rem] sm:text-4xl md:text-5xl lg:text-[4rem]">
                    Where ideas meet the room.
                  </h2>
                </div>

                <p className="max-w-2xl text-lg leading-relaxed text-[#0F1E3D]/70 lg:justify-self-end">
                  Workshops, tournaments, and special sessions keep the club active throughout the year —
                  creating real spaces for learning, competition, and community.
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
              <Reveal delay={0.06}>
                <Link href={`/events/${events[0].slug}`} className="group block h-full">
                  <div className="relative h-full overflow-hidden rounded-[1.9rem] border border-[#0F1E3D]/10 bg-[#0F1E3D] text-white shadow-[0_28px_80px_rgba(15,30,61,0.14)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_34px_92px_rgba(15,30,61,0.18)]">
                    <div className="relative aspect-[16/11] overflow-hidden">
                      {events[0].cover_image_url ? (
                        <img
                          src={events[0].cover_image_url}
                          alt={events[0].title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0F1E3D] to-[#1a2f5c]">
                          <Calendar className="size-14 text-white/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E3D] via-[#0F1E3D]/30 to-transparent" />
                    </div>

                    <div className="p-7 md:p-8">
                      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
                        Featured event · {new Date(events[0].event_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                      <h3 className="font-display text-[2.2rem] leading-[0.95] tracking-tight text-white md:text-[2.5rem]">
                        {events[0].title}
                      </h3>
                      {events[0].description && (
                        <p className="mt-4 line-clamp-3 text-[15px] leading-7 text-white/74">
                          {events[0].description}
                        </p>
                      )}
                      <div className="mt-6 inline-flex items-center gap-2 border-b border-[#C19A3D] pb-1 text-sm font-semibold text-white">
                        View event
                        <ArrowRight className="size-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>

              <div className="grid gap-6">
                {events.slice(1, 3).map((e, i) => (
                  <Reveal key={e.id} delay={0.12 + i * 0.06}>
                    <Link href={`/events/${e.slug}`} className="group block">
                      <div className="grid overflow-hidden rounded-[1.7rem] border border-[#0F1E3D]/10 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl md:grid-cols-[0.95fr_1.05fr]">
                        <div className="relative min-h-[180px] md:min-h-[220px] overflow-hidden bg-[#0F1E3D]">
                          {e.cover_image_url ? (
                            <img
                              src={e.cover_image_url}
                              alt={e.title}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0F1E3D] to-[#1a2f5c]">
                              <Calendar className="size-12 text-white/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E3D]/30 to-transparent" />
                        </div>

                        <div className="flex flex-col justify-center p-6">
                          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                            {new Date(e.event_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                          <h3 className="font-display text-[1.95rem] leading-none text-[#0F1E3D] transition-colors group-hover:text-[#C19A3D]">
                            {e.title}
                          </h3>
                          {e.location && (
                            <p className="mt-3 text-sm leading-6 text-[#0F1E3D]/60">{e.location}</p>
                          )}
                          {e.description && (
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#0F1E3D]/68">
                              {e.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal delay={0.24}>
              <div className="mt-8">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 border-b-2 border-[#C19A3D] pb-1 font-semibold text-[#0F1E3D] transition-all hover:gap-3"
                >
                  Browse all events
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_22%,rgba(193,154,61,0.08),transparent_24%),radial-gradient(circle_at_84%_78%,rgba(15,30,61,0.05),transparent_22%)]" />
        <div className="relative max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
              <div className="max-w-2xl">
                <div className="text-xs uppercase tracking-[0.2em] text-[#C19A3D] mb-3 font-semibold">Moments</div>
                <h2 className="font-display text-[1.9rem] sm:text-4xl md:text-5xl lg:text-[4rem] font-bold text-[#0F1E3D] leading-[0.96] tracking-tight">
                  Life beyond the podium.
                </h2>
              </div>

              <p className="max-w-2xl text-lg leading-relaxed text-[#0F1E3D]/70 lg:justify-self-end">
                Training rooms, celebrations, tournament journeys, and shared memories — the gallery captures the club as a living community, not just a competition space.
              </p>
            </div>
          </Reveal>

          {albums && albums.length > 0 ? (
            <div className="mt-10 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <Reveal delay={0.05}>
                <Link href={`/gallery/${albums[0].slug}`} className="group block">
                  <div className="relative min-h-[260px] sm:min-h-[340px] md:min-h-[420px] overflow-hidden rounded-[1.9rem] border border-[#0F1E3D]/10 bg-[#FDF8EE] shadow-[0_24px_70px_rgba(15,30,61,0.08)]">
                    {albums[0].cover_image_url ? (
                      <img
                        src={albums[0].cover_image_url}
                        alt={albums[0].title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FDF8EE] to-[#efe5cf]">
                        <Camera className="size-14 text-[#0F1E3D]/25" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E3D] via-[#0F1E3D]/28 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-7 text-white">
                      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
                        Featured album
                      </div>
                      <div className="font-display text-[2.2rem] leading-[0.95] tracking-tight">
                        {albums[0].title}
                      </div>
                      {albums[0].description && (
                        <p className="mt-3 max-w-xl line-clamp-2 text-sm leading-6 text-white/80">
                          {albums[0].description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </Reveal>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {albums.slice(1, 4).map((a, i) => (
                  <Reveal key={a.id} delay={0.1 + i * 0.05}>
                    <Link href={`/gallery/${a.slug}`} className="group block">
                      <div className="relative min-h-[120px] md:min-h-[130px] overflow-hidden rounded-[1.5rem] border border-[#0F1E3D]/10 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                        <div className="grid h-full md:grid-cols-[0.95fr_1.05fr]">
                          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[140px] overflow-hidden bg-[#FDF8EE]">
                            {a.cover_image_url ? (
                              <img
                                src={a.cover_image_url}
                                alt={a.title}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FDF8EE] to-[#efe5cf]">
                                <Camera className="size-9 text-[#0F1E3D]/25" />
                              </div>
                            )}
                          </div>

                          <div className="flex items-center p-5">
                            <div>
                              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                                Gallery
                              </div>
                              <div className="font-display text-[1.8rem] leading-none text-[#0F1E3D] transition-colors group-hover:text-[#C19A3D]">
                                {a.title}
                              </div>
                              {a.event_date && (
                                <p className="mt-3 text-sm leading-6 text-[#0F1E3D]/62">
                                  {new Date(a.event_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-10 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <Reveal delay={0.05}>
                <div className="relative min-h-[260px] sm:min-h-[340px] md:min-h-[420px] overflow-hidden rounded-[1.9rem] border border-[#0F1E3D]/10 bg-[#0F1E3D] text-white shadow-[0_24px_70px_rgba(15,30,61,0.08)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(193,154,61,0.18),transparent_28%)]" />
                  <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(135deg,transparent_0%,transparent_35%,#ffffff_35%,#ffffff_36%,transparent_36%,transparent_52%,#ffffff_52%,#ffffff_53%,transparent_53%,transparent_100%)]" />
                  <div className="relative flex h-full flex-col justify-end p-6 md:p-7">
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
                      Featured album
                    </div>
                    <div className="font-display text-[2.2rem] leading-[0.95] tracking-tight text-white">
                      Gallery updates coming soon
                    </div>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/78">
                      Event photography, practice sessions, celebrations, and tournament moments will appear here as new albums are published.
                    </p>
                  </div>
                </div>
              </Reveal>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <Reveal delay={0.1}>
                  <div className="relative min-h-[120px] md:min-h-[130px] overflow-hidden rounded-[1.5rem] border border-[#0F1E3D]/10 bg-[#FDF8EE] p-5 shadow-sm">
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                      Gallery
                    </div>
                    <div className="font-display text-[1.8rem] leading-none text-[#0F1E3D]">
                      Training moments
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#0F1E3D]/62">
                      Practice rooms, drills, and workshop snapshots.
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={0.15}>
                  <div className="relative min-h-[120px] md:min-h-[130px] overflow-hidden rounded-[1.5rem] border border-[#0F1E3D]/10 bg-white p-5 shadow-sm">
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                      Gallery
                    </div>
                    <div className="font-display text-[1.8rem] leading-none text-[#0F1E3D]">
                      Tournament journeys
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#0F1E3D]/62">
                      Travel, rounds, and competition highlights.
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={0.2}>
                  <div className="relative min-h-[120px] md:min-h-[130px] overflow-hidden rounded-[1.5rem] border border-[#0F1E3D]/10 bg-white p-5 shadow-sm">
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                      Gallery
                    </div>
                    <div className="font-display text-[1.8rem] leading-none text-[#0F1E3D]">
                      Club memories
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#0F1E3D]/62">
                      Community events, team bonding, and celebrations.
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          )}

          <Reveal delay={0.28}>
            <div className="mt-8">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 border-b-2 border-[#C19A3D] pb-1 font-semibold text-[#0F1E3D] transition-all hover:gap-3"
              >
                Explore full gallery
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 sm:py-20 md:py-28 text-white">
        <div className="absolute inset-0">
          <img
            src="/images/home/cta-bg.jpg"
            alt="JUST Debate Club session"
            className="h-full w-full object-cover scale-[1.02]"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,30,61,0.78)_0%,rgba(15,30,61,0.68)_34%,rgba(15,30,61,0.86)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,30,61,0.58)_0%,rgba(15,30,61,0.18)_48%,rgba(15,30,61,0.58)_100%)]" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.24em] text-[#C19A3D] mb-4 font-semibold">
              Join the conversation
            </div>
            <h2 className="font-display text-[2rem] sm:text-4xl md:text-6xl font-bold mb-6 leading-[0.96] tracking-tight text-white">
              Ready to find <span className="italic">your voice</span>?
            </h2>
            <p className="text-lg md:text-xl text-white/84 mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether you&apos;re a seasoned debater or just curious, there&apos;s a place for you at the JUSTDC podium.
            </p>
            <div className="flex flex-col gap-3 items-center sm:flex-row sm:flex-wrap sm:justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-[#C19A3D] hover:bg-[#A88330] text-black h-12 px-8 font-semibold rounded-xl shadow-xl">
                  Join now
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </Link>
              <Link href="/events">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/10 hover:bg-white/16 text-white h-12 px-8 rounded-xl backdrop-blur-md"
                >
                  See upcoming events
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

























