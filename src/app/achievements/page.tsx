import Link from "next/link"
import { Trophy, Award, Users, Calendar, Medal, ArrowRight } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Reveal } from "@/components/home/animations"

const CATEGORY_LABELS: Record<string, string> = {
  speaker_award: "Speaker Award",
  adjudication_award: "Adjudication Award",
  team_result: "Team Result",
  training_conducted: "Training Conducted",
  other: "Other",
}

const CATEGORY_FILTERS = [
  { value: "", label: "All achievements" },
  { value: "speaker_award", label: "Speaker Awards" },
  { value: "adjudication_award", label: "Adjudication" },
  { value: "team_result", label: "Team Results" },
  { value: "training_conducted", label: "Training" },
  { value: "other", label: "Others" },
]

type Achievement = {
  id: string
  title: string
  category: string
  tournament_name: string | null
  tournament_year: number | null
  position: string | null
  achievement_date: string | null
  description: string | null
  image_url: string | null
}

export default async function AchievementsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const sp = await searchParams
  const category = sp.category ?? ""

  const supabase = await createClient()
  let query = supabase
    .from("achievements")
    .select("id, title, category, tournament_name, tournament_year, position, achievement_date, description, image_url")
    .eq("is_verified", true)

  if (category) {
    query = query.eq("category", category as "speaker_award" | "adjudication_award" | "team_result" | "training_conducted" | "other")
  }

  const { data: rawAchievements } = await query.order("created_at", { ascending: false })
  const achievements = (rawAchievements ?? []) as unknown as Achievement[]

  // Calculate statistics for the header
  const { data: allVerified } = await supabase
    .from("achievements")
    .select("category, profile_id")
    .eq("is_verified", true)

  const stats = {
    total: allVerified?.length ?? 0,
    teams: allVerified?.filter((a) => a.category === "team_result").length ?? 0,
    speakers: allVerified?.filter((a) => a.category === "speaker_award").length ?? 0,
    members: new Set(allVerified?.map((a) => a.profile_id).filter(Boolean)).size,
  }

  return (
    <main className="bg-white text-[#0F1E3D]">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden -mt-16 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0B1731_0%,#0F1E3D_62%,#112449_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_22%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_83%_16%,rgba(193,154,61,0.14),transparent_16%),radial-gradient(circle_at_52%_100%,rgba(8,17,38,0.6),transparent_34%)]" />
        <div className="absolute inset-0 opacity-[0.12]">
          <div
            className="absolute left-1/2 top-[22%] h-[132%] w-[160%] -translate-x-1/2 [transform:perspective(1200px)_rotateX(74deg)]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)",
              backgroundSize: "44px 44px",
              backgroundPosition: "center center",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.9) 68%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.9) 68%, transparent 100%)",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,30,61,0.92)_0%,rgba(15,30,61,0.74)_30%,rgba(15,30,61,0.48)_58%,rgba(15,30,61,0.76)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#081126]/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FDF8EE] via-[#FDF8EE]/45 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[64vh] max-w-7xl items-center px-6 pt-30 pb-12 md:pt-34 md:pb-14">
          <div className="w-full">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div className="max-w-4xl">
                <Reveal>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/90 backdrop-blur-md md:text-xs">
                    <Trophy className="size-3 text-[#C19A3D]" />
                    Club Achievements
                  </div>
                </Reveal>

                <Reveal delay={0.12}>
                  <h1 className="mt-6 max-w-4xl font-display text-[3.1rem] leading-[0.84] tracking-[-0.045em] text-white sm:text-[4rem] md:text-[4.9rem] lg:text-[5.4rem]">
                    Honors, titles,
                    <br />
                    and our path of <span className="text-[#C19A3D] italic">victories</span>.
                  </h1>
                </Reveal>

                <Reveal delay={0.24}>
                  <p className="mt-6 max-w-2xl text-[1rem] leading-[1.8] text-white/82 md:text-[1.05rem]">
                    Celebrating the intellectual triumphs, speaker rankings, and championship records earned by the debaters and adjudicators of JUST Debate Club.
                  </p>
                </Reveal>
              </div>

              <Reveal delay={0.36}>
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[1.3rem] border border-white/10 bg-white/7 px-4 py-4 backdrop-blur-md">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[#C19A3D]">
                      <Trophy className="size-3.5" />
                      <span className="text-[9px] font-semibold uppercase tracking-[0.2em]">Total</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{stats.total}</div>
                  </div>

                  <div className="rounded-[1.3rem] border border-white/10 bg-white/7 px-4 py-4 backdrop-blur-md">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[#C19A3D]">
                      <Award className="size-3.5" />
                      <span className="text-[9px] font-semibold uppercase tracking-[0.2em]">Teams</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{stats.teams}</div>
                  </div>

                  <div className="rounded-[1.3rem] border border-white/10 bg-white/7 px-4 py-4 backdrop-blur-md">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[#C19A3D]">
                      <Medal className="size-3.5" />
                      <span className="text-[9px] font-semibold uppercase tracking-[0.2em]">Speakers</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{stats.speakers}</div>
                  </div>

                  <div className="rounded-[1.3rem] border border-white/10 bg-white/7 px-4 py-4 backdrop-blur-md">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[#C19A3D]">
                      <Users className="size-3.5" />
                      <span className="text-[9px] font-semibold uppercase tracking-[0.2em]">Debaters</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{stats.members}</div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Main Listing Section */}
      <section className="relative overflow-hidden bg-[#FDF8EE] py-14 sm:py-18 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(193,154,61,0.10),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(15,30,61,0.06),transparent_20%)]" />
        
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          {/* Category Filters */}
          <Reveal>
            <div className="mb-10 flex flex-wrap gap-2 border-b border-[#0F1E3D]/8 pb-6">
              {CATEGORY_FILTERS.map((filter) => {
                const active = category === filter.value
                return (
                  <Link
                    key={filter.value}
                    href={filter.value ? `/achievements?category=${filter.value}` : "/achievements"}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all border ${
                      active
                        ? "bg-[#0F1E3D] text-white border-[#0F1E3D] shadow-sm"
                        : "bg-white/60 text-[#0F1E3D]/80 border-[#0F1E3D]/12 hover:bg-[#0F1E3D] hover:text-white"
                    }`}
                  >
                    {filter.label}
                  </Link>
                )
              })}
            </div>
          </Reveal>

          {achievements.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((ach, index) => {
                const typeLabel = CATEGORY_LABELS[ach.category] ?? ach.category
                return (
                  <Reveal key={ach.id} delay={index * 0.05}>
                    <Link href={`/achievements/${ach.id}`} className="group block h-full">
                      <article className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-[#0F1E3D]/10 bg-white shadow-[0_10px_30px_rgba(15,30,61,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,30,61,0.1)]">
                        {ach.image_url ? (
                          <div className="relative h-48 w-full overflow-hidden border-b border-[#0F1E3D]/10">
                            <img
                              src={ach.image_url}
                              alt={ach.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E3D]/40 to-transparent" />
                            <div className="absolute bottom-3 left-3">
                              <span className="rounded-full border border-white/20 bg-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                                {typeLabel}
                              </span>
                            </div>
                          </div>
                        ) : null}
                        
                        <div className="flex flex-col flex-1 p-6">
                          {!ach.image_url && (
                            <div className="mb-4 flex items-center justify-between gap-3">
                              <span className="rounded-full border border-[#C19A3D]/30 bg-[#FFFDF8] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#C19A3D]">
                                {typeLabel}
                              </span>
                              {ach.tournament_year && (
                                <span className="flex items-center gap-1 text-xs text-[#0F1E3D]/50 font-medium">
                                  <Calendar className="size-3.5" />
                                  {ach.tournament_year}
                                </span>
                              )}
                            </div>
                          )}

                          {ach.image_url && ach.tournament_year && (
                             <div className="mb-2 flex items-center gap-1 text-xs text-[#0F1E3D]/50 font-medium">
                               <Calendar className="size-3.5" />
                               {ach.tournament_year}
                             </div>
                          )}

                          <h3 className="font-display text-[1.45rem] font-bold leading-snug text-[#0F1E3D] transition-colors group-hover:text-[#C19A3D]">
                            {ach.title}
                          </h3>

                          {ach.tournament_name && (
                            <p className="mt-1 text-sm font-semibold text-[#0F1E3D]/70">
                              {ach.tournament_name}
                            </p>
                          )}

                          {ach.position && (
                            <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C19A3D]">
                              <Medal className="size-3.5" />
                              {ach.position}
                            </p>
                          )}

                          {ach.description && (
                            <p className="mt-3.5 line-clamp-3 text-sm leading-relaxed text-[#0F1E3D]/60 flex-1">
                              {ach.description}
                            </p>
                          )}

                          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#0F1E3D] transition-colors group-hover:text-[#C19A3D]">
                            View details
                            <ArrowRight className="size-4" />
                          </div>
                        </div>
                      </article>
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          ) : (
            <Reveal>
              <div className="rounded-3xl border border-[#0F1E3D]/10 bg-white p-12 text-center shadow-[0_10px_30px_rgba(15,30,61,0.04)]">
                <Trophy className="mx-auto size-12 text-[#C19A3D] opacity-40 animate-pulse" />
                <h3 className="mt-4 font-display text-2xl font-bold text-[#0F1E3D]">
                  No achievements listed
                </h3>
                <p className="mt-2 text-sm text-[#0F1E3D]/50">
                  There are no verified achievements currently in this category.
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </main>
  )
}
