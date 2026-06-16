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

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function XTwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.88 0 1.441 1.441 0 012.88 0z" />
    </svg>
  )
}
import { createClient } from "@/lib/supabase/server"
import { Reveal } from "@/components/home/animations"

const SOCIAL_STYLES: Record<
  string,
  {
    btnClass: string
    iconColor: string
  }
> = {
  Facebook: {
    btnClass: "bg-[#1877F2]/10 border-[#1877F2]/20 hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-[0_0_15px_rgba(24,119,242,0.4)]",
    iconColor: "text-[#1877F2] group-hover:text-white",
  },
  LinkedIn: {
    btnClass: "bg-[#0A66C2]/10 border-[#0A66C2]/20 hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:shadow-[0_0_15px_rgba(10,102,194,0.4)]",
    iconColor: "text-[#0A66C2] group-hover:text-white",
  },
  X: {
    btnClass: "bg-white/5 border-white/10 hover:bg-white hover:border-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]",
    iconColor: "text-white group-hover:text-black",
  },
  Instagram: {
    btnClass: "bg-gradient-to-r from-[#E1306C]/10 to-[#C13584]/10 border-[#E1306C]/20 hover:from-[#E1306C] hover:to-[#C13584] hover:border-[#E1306C] hover:shadow-[0_0_15px_rgba(225,48,108,0.4)]",
    iconColor: "text-[#E1306C] group-hover:text-white",
  },
  Website: {
    btnClass: "bg-[#C19A3D]/10 border-[#C19A3D]/20 hover:bg-[#C19A3D] hover:border-[#C19A3D] hover:shadow-[0_0_15px_rgba(193,154,61,0.4)]",
    iconColor: "text-[#C19A3D] group-hover:text-[#0F1E3D]",
  },
}

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
    { url: profile.social_facebook, label: "Facebook", icon: FacebookIcon },
    { url: profile.social_linkedin, label: "LinkedIn", icon: LinkedInIcon },
    { url: profile.social_twitter, label: "X", icon: XTwitterIcon },
    { url: profile.social_instagram, label: "Instagram", icon: InstagramIcon },
    { url: profile.social_website, label: "Website", icon: Globe },
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
          label: "Session",
          value: `${profile.batch_year}-${String(profile.batch_year + 1).slice(-2)}`,
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
    <main className="min-h-screen bg-[#FDF8EE] text-[#0F1E3D] pb-16">
      {/* 1. Cover Banner Section */}
      <section className="relative h-44 sm:h-64 bg-[#081126] text-white -mt-16 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(193,154,61,0.18),transparent_25%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.06),transparent_20%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* "← All members" Back Link */}
        <div className="absolute top-24 left-6 sm:left-12 z-20">
          <Reveal>
            <Link
              href="/members"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/86 transition-all duration-300 hover:border-white/22 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="size-3.5" />
              All members
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 2. Profile Content Area */}
      <div className="mx-auto max-w-6xl px-6 -mt-14 sm:-mt-20 relative z-10">
        
        {/* A. Profile Header Card */}
        <Reveal delay={0.08}>
          <div className="bg-white rounded-3xl border border-[#0F1E3D]/10 p-6 sm:p-8 shadow-[0_12px_40px_rgba(15,30,61,0.04)] relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              
              {/* Avatar + Main Details */}
              <div className="flex flex-col md:flex-row gap-6 md:items-end">
                {/* Overlapping Avatar */}
                <div className="relative size-28 sm:size-36 shrink-0 rounded-full border-4 border-white bg-[#102246] shadow-md overflow-hidden -mt-16 sm:-mt-20">
                  {normalizeText(profile.avatar_url) ? (
                    <img
                      src={profile.avatar_url ?? undefined}
                      alt={name}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_25%,rgba(193,154,61,0.20),transparent_18%),linear-gradient(180deg,#132750_0%,#0F1E3D_100%)]">
                      <div className="rounded-full border border-[#C19A3D]/30 bg-white/8 px-5 py-4 font-display text-[2.2rem] leading-none tracking-tight text-[#F5E7BF] backdrop-blur-sm sm:text-[3rem]">
                        {initials}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#C19A3D]/15 bg-[#C19A3D]/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#C19A3D] font-bold">
                    <Sparkles className="size-3" />
                    Member Spotlight
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0F1E3D]">
                    {name}
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                    {displayTitle}
                  </p>
                </div>
              </div>

              {/* Role badge */}
              <div className="shrink-0 self-start md:self-end">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0F1E3D]/5 border border-[#0F1E3D]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F1E3D]">
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* B. Grid Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 items-start">
          
          {/* Main Content Column (Left, 2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Bio/About Card */}
            {normalizeText(profile.bio) ? (
              <Reveal delay={0.12}>
                <section className="bg-white rounded-3xl border border-[#0F1E3D]/10 p-6 sm:p-8 shadow-sm">
                  <h2 className="font-display text-lg sm:text-xl font-bold text-[#0F1E3D] border-b border-[#0F1E3D]/10 pb-3 mb-4">
                    About
                  </h2>
                  <p className="text-sm leading-relaxed text-[#0F1E3D]/76 whitespace-pre-line">
                    {profile.bio}
                  </p>
                </section>
              </Reveal>
            ) : null}

            {/* Achievements Card */}
            <Reveal delay={0.18}>
              <section className="bg-white rounded-3xl border border-[#0F1E3D]/10 p-6 sm:p-8 shadow-sm">
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#0F1E3D] border-b border-[#0F1E3D]/10 pb-3 mb-6">
                  Achievements & Milestones
                </h2>

                {!achievements || achievements.length === 0 ? (
                  <div className="py-8 text-center text-[#0F1E3D]/50">
                    <p className="text-sm">No verified achievements records found.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {CATEGORY_ORDER.filter((category) => grouped[category]?.length).map((category) => (
                      <div key={category} className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C19A3D] border-l-2 border-[#C19A3D] pl-3">
                          {CATEGORY_LABELS[category]}
                        </h3>
                        <div className="grid gap-4 pl-3.5">
                          {grouped[category]!.map((achievement) => (
                            <article
                              key={achievement.id}
                              className="group p-4 rounded-2xl border border-[#0F1E3D]/8 bg-[#FDF8EE]/40 hover:bg-[#FDF8EE]/80 transition-colors"
                            >
                              <div className="flex flex-col sm:flex-row justify-between gap-2">
                                <div>
                                  <h4 className="font-display text-base font-bold text-[#0F1E3D]">
                                    {achievement.title}
                                  </h4>
                                  <div className="mt-1 flex flex-wrap gap-x-2 text-xs text-[#0F1E3D]/60">
                                    {achievement.tournament_name ? <span>{achievement.tournament_name}</span> : null}
                                    {achievement.tournament_year ? <span>• {achievement.tournament_year}</span> : null}
                                    {achievement.position ? <span>• {achievement.position}</span> : null}
                                  </div>
                                </div>
                                {achievement.achievement_date ? (
                                  <span className="text-xs font-semibold text-[#0F1E3D]/40 shrink-0">
                                    {formatDate(achievement.achievement_date)}
                                  </span>
                                ) : null}
                              </div>
                              {normalizeText(achievement.description) ? (
                                <p className="mt-2 text-xs leading-relaxed text-[#0F1E3D]/70">
                                  {achievement.description}
                                </p>
                              ) : null}
                            </article>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </Reveal>

            {/* Certificates Card */}
            {certificates && certificates.length > 0 ? (
              <Reveal delay={0.24}>
                <section className="bg-white rounded-3xl border border-[#0F1E3D]/10 p-6 sm:p-8 shadow-sm">
                  <h2 className="font-display text-lg sm:text-xl font-bold text-[#0F1E3D] border-b border-[#0F1E3D]/10 pb-3 mb-6">
                    Verified Certificates
                  </h2>
                  <div className="grid gap-4">
                    {certificates.map((certificate) => (
                      <article
                        key={certificate.id}
                        className="rounded-2xl border border-[#0F1E3D]/8 bg-[#FDF8EE]/40 p-4 hover:bg-[#FDF8EE]/80 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C19A3D] mb-1">
                              ID: {certificate.certificate_id}
                            </div>
                            <h3 className="font-display text-base font-bold text-[#0F1E3D]">
                              {certificate.event_name}
                            </h3>
                            <div className="mt-1 flex flex-wrap gap-x-2 text-xs text-[#0F1E3D]/60">
                              {certificate.issued_date ? <span>{certificate.issued_date}</span> : null}
                              {certificate.issued_by ? <span>• by {certificate.issued_by}</span> : null}
                            </div>
                          </div>
                          <Link
                            href={`/verify/${certificate.certificate_id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#0F1E3D]/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0F1E3D] transition-colors hover:border-[#C19A3D]/40 hover:bg-[#fffaf0]"
                          >
                            Verify
                            <ExternalLink className="size-3.5 text-[#C19A3D]" />
                          </Link>
                        </div>
                        {normalizeText(certificate.achievement_description) ? (
                          <p className="mt-2 text-xs leading-relaxed text-[#0F1E3D]/68 border-t border-[#0F1E3D]/5 pt-2">
                            {certificate.achievement_description}
                          </p>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </section>
              </Reveal>
            ) : null}
          </div>

          {/* Sidebar Column (Right, 1/3 width) */}
          <div className="space-y-8">
            
            {/* Quick Profile Facts Card */}
            {facts.length > 0 ? (
              <Reveal delay={0.28}>
                <section className="bg-white rounded-3xl border border-[#0F1E3D]/10 p-6 shadow-sm">
                  <h2 className="font-display text-base font-bold text-[#0F1E3D] border-b border-[#0F1E3D]/10 pb-3 mb-4">
                    Member Details
                  </h2>
                  <div className="space-y-4">
                    {facts.map((fact) => {
                      const Icon = fact.icon
                      return (
                        <div key={`${fact.label}-${fact.value}`} className="flex items-start gap-3">
                          <div className="p-2.5 rounded-xl bg-[#FDF8EE] border border-[#0F1E3D]/5 text-[#C19A3D] shrink-0">
                            <Icon className="size-4" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F1E3D]/40">
                              {fact.label}
                            </div>
                            <div className="text-sm font-semibold text-[#0F1E3D]">
                              {fact.value}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              </Reveal>
            ) : null}

            {/* Socials & Contact Directory Card */}
            {(socials.length > 0 || showEmail || showPhone) && (
              <Reveal delay={0.34}>
                <section className="bg-white rounded-3xl border border-[#0F1E3D]/10 p-6 shadow-sm">
                  <h2 className="font-display text-base font-bold text-[#0F1E3D] border-b border-[#0F1E3D]/10 pb-3 mb-4">
                    Contact & Social Links
                  </h2>
                  <div className="flex flex-col gap-2.5">
                    {showEmail ? (
                      <a
                        href={`mailto:${profile.email}`}
                        className="group inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-semibold text-[#0F1E3D] transition-all duration-300 bg-[#C19A3D]/8 border-[#C19A3D]/20 hover:bg-[#C19A3D] hover:text-[#0F1E3D] hover:shadow-[0_0_12px_rgba(193,154,61,0.25)]"
                      >
                        <Mail className="size-4 text-[#C19A3D] group-hover:text-[#0F1E3D] transition-colors" />
                        <span className="truncate">{profile.email}</span>
                      </a>
                    ) : null}

                    {showPhone ? (
                      <a
                        href={`tel:${profile.phone}`}
                        className="group inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-semibold text-[#0F1E3D] transition-all duration-300 bg-emerald-500/8 border-emerald-500/20 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white hover:shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                      >
                        <Phone className="size-4 text-emerald-600 group-hover:text-white transition-colors" />
                        <span>{profile.phone}</span>
                      </a>
                    ) : null}

                    {socials.map((social) => {
                      const Icon = social.icon
                      const style = SOCIAL_STYLES[social.label] || {
                        btnClass: "bg-[#0F1E3D]/5 border-[#0F1E3D]/15 hover:bg-[#0F1E3D] hover:border-[#0F1E3D] hover:text-white",
                        iconColor: "text-[#0F1E3D] group-hover:text-white"
                      }

                      return (
                        <a
                          key={social.label}
                          href={social.url ?? undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-semibold text-[#0F1E3D] transition-all duration-300 ${style.btnClass}`}
                        >
                          <Icon className={`size-4 transition-colors ${style.iconColor}`} />
                          <span>{social.label}</span>
                        </a>
                      )
                    })}
                  </div>
                </section>
              </Reveal>
            )}
          </div>
        </div>
      </div>
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
