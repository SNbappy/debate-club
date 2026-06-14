import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Award,
  Calendar,
  ExternalLink,
  Globe,
  GraduationCap,
  Mail,
  Phone,
  Sparkles,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Reveal } from "@/components/home/animations"

const ROLE_LABELS: Record<string, string> = {
  member: "Member",
  executive: "Executive",
  general_secretary: "General Secretary",
  president: "President",
  alumni: "Alumni",
}

const CATEGORY_LABELS: Record<string, string> = {
  speaker_award: "Speaker Awards",
  adjudication_award: "Adjudication Awards",
  team_result: "Team Results",
  training_conducted: "Training Conducted",
  other: "Other",
}

const CATEGORY_ORDER = [
  "speaker_award",
  "adjudication_award",
  "team_result",
  "training_conducted",
  "other",
] as const

function normalizeText(value: string | null | undefined) {
  return value?.trim() || ""
}

function getInitials(name: string | null | undefined) {
  return (
    normalizeText(name)
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  )
}

function formatLabel(value: string | null | undefined, fallback: string) {
  return normalizeText(value) || fallback
}

function formatDate(value: string | null | undefined) {
  return normalizeText(value)
}

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .eq("is_verified", true)
    .maybeSingle()

  if (!profile) notFound()

  const [{ data: achievements }, { data: certificates }] = await Promise.all([
    supabase
      .from("achievements")
      .select("*")
      .eq("profile_id", profile.id)
      .eq("is_verified", true)
      .order("achievement_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("certificates")
      .select("*")
      .eq("profile_id", profile.id)
      .order("issued_date", { ascending: false }),
  ])

  const grouped: Record<string, typeof achievements> = {}
  for (const achievement of achievements ?? []) {
    if (!grouped[achievement.category]) grouped[achievement.category] = []
    grouped[achievement.category]!.push(achievement)
  }

  const name = formatLabel(profile.full_name, "Unnamed Member")
  const initials = getInitials(profile.full_name)
  const roleLabel = ROLE_LABELS[profile.role] ?? "Member"
  const displayTitle =
    normalizeText(profile.exec_position) ||
    normalizeText(profile.role && ROLE_LABELS[profile.role]) ||
    "Club Member"

  const showEmail = profile.email_visibility === "public" && normalizeText(profile.email)
  const showPhone = profile.phone_visibility === "public" && normalizeText(profile.phone)

  const socials = [
    { url: profile.social_facebook, label: "Facebook", isWeb: false },
    { url: profile.social_linkedin, label: "LinkedIn", isWeb: false },
    { url: profile.social_twitter, label: "X / Twitter", isWeb: false },
    { url: profile.social_instagram, label: "Instagram", isWeb: false },
    { url: profile.social_website, label: "Website", isWeb: true },
  ].filter((item) => normalizeText(item.url))

  const facts = [
    profile.department
      ? {
          label: "Department",
          value: profile.department,
          icon: GraduationCap,
        }
      : null,
    profile.batch_year
      ? {
          label: "Batch",
          value: String(profile.batch_year),
          icon: GraduationCap,
        }
      : null,
    profile.joined_year
      ? {
          label: "Joined",
          value: String(profile.joined_year),
          icon: Calendar,
        }
      : null,
    roleLabel
      ? {
          label: "Role",
          value: roleLabel,
          icon: Sparkles,
        }
      : null,
  ].filter(Boolean) as {
    label: string
    value: string
    icon: typeof GraduationCap
  }[]

  return (
    <main className="bg-white text-[#0F1E3D]">
      <section className="relative overflow-hidden -mt-16 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0B1731_0%,#0F1E3D_58%,#112449_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(255,255,255,0.07),transparent_18%),radial-gradient(circle_at_82%_16%,rgba(193,154,61,0.16),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(8,17,38,0.62),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,30,61,0.94)_0%,rgba(15,30,61,0.78)_34%,rgba(15,30,61,0.44)_60%,rgba(15,30,61,0.76)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#081126]/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FDF8EE] via-[#FDF8EE]/42 to-transparent" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-28 pb-14 sm:pt-32 md:pt-36 md:pb-18">
          <Reveal>
            <Link
              href="/members"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/86 transition-all duration-300 hover:border-white/22 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="size-4" />
              All members
            </Link>
          </Reveal>

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-end lg:gap-14">
            <Reveal delay={0.08}>
              <div className="relative max-w-[28rem]">
                <div className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[#132750] shadow-[0_32px_80px_rgba(0,0,0,0.28)]">
                  <div className="aspect-[4/4.65] bg-[#102246]">
                    {normalizeText(profile.avatar_url) ? (
                      <img
                        src={profile.avatar_url ?? undefined}
                        alt={name}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_25%,rgba(193,154,61,0.20),transparent_18%),linear-gradient(180deg,#132750_0%,#0F1E3D_100%)]">
                        <div className="rounded-full border border-[#C19A3D]/30 bg-white/8 px-7 py-6 font-display text-[4.6rem] leading-none tracking-tight text-[#F5E7BF] backdrop-blur-sm sm:text-[5.4rem]">
                          {initials}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,30,61,0.02)_0%,rgba(15,30,61,0.10)_42%,rgba(15,30,61,0.42)_100%)]" />
                </div>

                <div className="absolute -bottom-5 left-5 rounded-[1.35rem] bg-[#C19A3D] px-5 py-4 text-black shadow-2xl">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
                    Member profile
                  </div>
                  <div className="font-display text-[1.9rem] leading-none">
                    {roleLabel}
                  </div>
                  {profile.batch_year ? (
                    <div className="mt-1 text-sm opacity-80">Batch {profile.batch_year}</div>
                  ) : null}
                </div>
              </div>
            </Reveal>

            <div className="max-w-3xl">
              <Reveal delay={0.12}>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/90 backdrop-blur-md md:text-xs">
                  <Sparkles className="size-3 text-[#C19A3D]" />
                  Member spotlight
                </div>
              </Reveal>

              <Reveal delay={0.18}>
                <h1 className="mt-6 max-w-4xl font-display text-[3.2rem] leading-[0.88] tracking-[-0.04em] text-white sm:text-[4rem] md:text-[4.8rem] lg:text-[5.05rem]">
                  {name}
                </h1>
              </Reveal>

              <Reveal delay={0.24}>
                <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.24em] text-[#C19A3D]">
                  {displayTitle}
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <p className="mt-6 max-w-2xl text-[1rem] leading-[1.85] text-white/80 md:text-[1.05rem]">
                  {normalizeText(profile.bio) ||
                    `${name} is part of the speaking, learning, and leadership culture that shapes JUST Debate Club.`}
                </p>
              </Reveal>

              {facts.length > 0 ? (
                <Reveal delay={0.36}>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {facts.map((fact) => {
                      const Icon = fact.icon

                      return (
                        <div
                          key={`${fact.label}-${fact.value}`}
                          className="rounded-[1.35rem] border border-white/10 bg-white/7 px-5 py-4 backdrop-blur-md"
                        >
                          <div className="mb-2 flex items-center gap-2 text-[#C19A3D]">
                            <Icon className="size-4" />
                            <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                              {fact.label}
                            </span>
                          </div>
                          <div className="font-display text-[1.55rem] leading-none text-white">
                            {fact.value}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Reveal>
              ) : null}

              {(socials.length > 0 || showEmail || showPhone) && (
                <Reveal delay={0.42}>
                  <div className="mt-8 flex flex-wrap gap-3 text-sm">
                    {showEmail ? (
                      <a
                        href={`mailto:${profile.email}`}
                        className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 py-2.5 text-white/86 transition-all duration-300 hover:border-white/24 hover:bg-white/12 hover:text-white"
                      >
                        <Mail className="size-4 text-[#C19A3D]" />
                        {profile.email}
                      </a>
                    ) : null}

                    {showPhone ? (
                      <a
                        href={`tel:${profile.phone}`}
                        className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 py-2.5 text-white/86 transition-all duration-300 hover:border-white/24 hover:bg-white/12 hover:text-white"
                      >
                        <Phone className="size-4 text-[#C19A3D]" />
                        {profile.phone}
                      </a>
                    ) : null}

                    {socials.map((social) => {
                      const Icon = social.isWeb ? Globe : ExternalLink

                      return (
                        <a
                          key={social.label}
                          href={social.url ?? undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 py-2.5 text-white/86 transition-all duration-300 hover:border-white/24 hover:bg-white/12 hover:text-white"
                        >
                          <Icon className="size-4 text-[#C19A3D]" />
                          {social.label}
                        </a>
                      )
                    })}
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#FDF8EE] py-16 sm:py-20 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(193,154,61,0.10),transparent_24%),radial-gradient(circle_at_86%_20%,rgba(15,30,61,0.06),transparent_20%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="mb-10 max-w-2xl">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                Achievements
              </div>
              <h2 className="font-display text-[1.9rem] leading-[0.96] tracking-tight text-[#0F1E3D] sm:text-4xl md:text-5xl">
                Verified milestones and competitive highlights.
              </h2>
            </div>
          </Reveal>

          {!achievements || achievements.length === 0 ? (
            <Reveal delay={0.08}>
              <div className="rounded-[1.6rem] border border-[#0F1E3D]/10 bg-white p-8 text-center shadow-[0_18px_44px_rgba(15,30,61,0.06)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
                  Records
                </div>
                <h3 className="mt-3 font-display text-[2rem] leading-none text-[#0F1E3D]">
                  No verified achievements yet
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#0F1E3D]/66">
                  Public achievement records will appear here as the member profile grows.
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="space-y-10">
              {CATEGORY_ORDER.filter((category) => grouped[category]?.length).map((category, categoryIndex) => (
                <Reveal key={category} delay={0.06 + categoryIndex * 0.05}>
                  <section>
                    <div className="mb-5 flex items-end justify-between gap-4 border-b border-[#0F1E3D]/10 pb-4">
                      <div>
                        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                          Category
                        </div>
                        <h3 className="font-display text-[1.85rem] leading-none text-[#0F1E3D] sm:text-[2.15rem]">
                          {CATEGORY_LABELS[category]}
                        </h3>
                      </div>
                      <div className="text-sm text-[#0F1E3D]/52">
                        {grouped[category]!.length} item{grouped[category]!.length > 1 ? "s" : ""}
                      </div>
                    </div>

                    <div className="grid gap-4">
                      {grouped[category]!.map((achievement, itemIndex) => (
                        <Reveal key={achievement.id} delay={0.08 + itemIndex * 0.03}>
                          <article className="group overflow-hidden rounded-[1.55rem] border border-[#0F1E3D]/10 bg-white shadow-[0_12px_34px_rgba(15,30,61,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(15,30,61,0.08)]">
                            <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-[0.92fr_1.08fr] md:gap-8">
                              <div>
                                <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
                                  Highlight
                                </div>
                                <h4 className="font-display text-[1.65rem] leading-[0.95] text-[#0F1E3D] sm:text-[1.9rem]">
                                  {achievement.title}
                                </h4>
                              </div>

                              <div>
                                <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm text-[#0F1E3D]/62">
                                  {achievement.tournament_name ? <span>{achievement.tournament_name}</span> : null}
                                  {achievement.tournament_year ? <span>• {achievement.tournament_year}</span> : null}
                                  {achievement.position ? <span>• {achievement.position}</span> : null}
                                  {achievement.achievement_date ? (
                                    <span>• {formatDate(achievement.achievement_date)}</span>
                                  ) : null}
                                </div>

                                {normalizeText(achievement.description) ? (
                                  <p className="mt-4 text-[15px] leading-7 text-[#0F1E3D]/70">
                                    {achievement.description}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          </article>
                        </Reveal>
                      ))}
                    </div>
                  </section>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {certificates && certificates.length > 0 ? (
        <section className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(193,154,61,0.08),transparent_26%),linear-gradient(180deg,rgba(253,248,238,0.42)_0%,rgba(255,255,255,1)_26%)]" />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="mb-10 grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
                <div className="max-w-xl">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                    <Award className="size-4" />
                    Certificates
                  </div>
                  <h2 className="font-display text-[1.9rem] leading-[0.96] tracking-tight text-[#0F1E3D] sm:text-4xl md:text-5xl">
                    Verified records issued through club activity.
                  </h2>
                </div>
                <p className="max-w-2xl text-base leading-8 text-[#0F1E3D]/68 lg:justify-self-end">
                  Certificate entries remain connected to their verification pages so achievements can stay public, traceable, and easy to confirm.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-4">
              {certificates.map((certificate, index) => (
                <Reveal key={certificate.id} delay={0.05 + index * 0.03}>
                  <article className="rounded-[1.55rem] border border-[#0F1E3D]/10 bg-[#FDF8EE] p-5 shadow-[0_12px_34px_rgba(15,30,61,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(15,30,61,0.07)] sm:p-6">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
                          Certificate ID · {certificate.certificate_id}
                        </div>
                        <h3 className="font-display text-[1.55rem] leading-none text-[#0F1E3D] sm:text-[1.8rem]">
                          {certificate.event_name}
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-sm text-[#0F1E3D]/60">
                          {certificate.issued_date ? <span>{certificate.issued_date}</span> : null}
                          {certificate.issued_by ? <span>• by {certificate.issued_by}</span> : null}
                        </div>

                        {normalizeText(certificate.achievement_description) ? (
                          <p className="mt-4 text-[15px] leading-7 text-[#0F1E3D]/68">
                            {certificate.achievement_description}
                          </p>
                        ) : null}
                      </div>

                      <div className="md:shrink-0">
                        <Link
                          href={`/verify/${certificate.certificate_id}`}
                          target="_blank"
                          className="inline-flex items-center gap-2 rounded-full border border-[#0F1E3D]/12 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F1E3D] transition-all duration-300 hover:border-[#C19A3D]/40 hover:bg-[#fffaf0]"
                        >
                          Verify certificate
                          <ExternalLink className="size-4 text-[#C19A3D]" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, bio")
    .eq("slug", slug)
    .eq("is_verified", true)
    .maybeSingle()

  if (!profile) return { title: "Member not found" }

  return {
    title: profile.full_name,
    description: profile.bio ?? `${profile.full_name} — Debate Club`,
  }
}
