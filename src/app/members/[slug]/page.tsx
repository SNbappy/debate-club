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

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

  const query = supabase
    .from("profiles")
    .select("*")
    .eq("is_verified", true);

  if (isUuid) {
    query.or(`slug.eq.${slug},id.eq.${slug}`);
  } else {
    query.eq("slug", slug);
  }

  const { data: profile } = await query.maybeSingle();

  if (!profile) notFound()

  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .eq("profile_id", profile.id)
    .order("issued_date", { ascending: false })

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

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-14">
            <Reveal delay={0.08}>
              <div className="relative max-w-[28rem] mx-auto lg:mx-0">
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

                <div className="absolute -bottom-5 left-5 rounded-[1.35rem] bg-[#C19A3D] px-4 py-3 sm:px-5 sm:py-4 text-black shadow-2xl">
                  <div className="mb-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em]">
                    Member profile
                  </div>
                  <div className="font-display text-xl sm:text-2xl font-bold tracking-tight leading-none">
                    {roleLabel}
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="max-w-3xl">
              <Reveal delay={0.18}>
                <h1 className="mt-2 max-w-4xl font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  {name}
                </h1>
              </Reveal>

              <Reveal delay={0.24}>
                <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.24em] text-[#C19A3D]">
                  {displayTitle}
                </p>
              </Reveal>

              {/* CONNECT Section between title and bio */}
              {(socials.length > 0 || showEmail || showPhone) && (
                <Reveal delay={0.27}>
                  <div className="mt-6 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C19A3D]">
                      CONNECT
                    </div>
                    <div className="flex flex-wrap gap-4 items-center">
                      {showEmail ? (
                        <a
                          href={`mailto:${profile.email}`}
                          title={profile.email ?? undefined}
                          className="group flex items-center justify-center rounded-full border p-3 text-white transition-all duration-300 hover:scale-110 bg-[#C19A3D]/10 border-[#C19A3D]/20 hover:bg-[#C19A3D] hover:text-[#0F1E3D] hover:border-[#C19A3D] hover:shadow-[0_0_15px_rgba(193,154,61,0.4)]"
                        >
                          <Mail className="size-[22px] text-[#C19A3D] group-hover:text-[#0F1E3D] transition-colors" />
                        </a>
                      ) : null}

                      {showPhone ? (
                        <a
                          href={`tel:${profile.phone}`}
                          title={profile.phone ?? undefined}
                          className="group flex items-center justify-center rounded-full border p-3 text-white transition-all duration-300 hover:scale-110 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                        >
                          <Phone className="size-[22px] text-emerald-400 group-hover:text-white transition-colors" />
                        </a>
                      ) : null}

                      {socials.map((social) => {
                        const Icon = social.icon
                        const style = SOCIAL_STYLES[social.label] || {
                          btnClass: "bg-white/8 border-white/14 hover:bg-white/12 hover:border-white/24 text-white",
                          iconColor: "text-[#C19A3D] group-hover:text-white"
                        }

                        return (
                          <a
                            key={social.label}
                            href={social.url ?? undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={social.label}
                            className={`group flex items-center justify-center rounded-full border p-3 text-white transition-all duration-300 hover:scale-110 ${style.btnClass}`}
                          >
                            <Icon className={`size-[22px] transition-colors ${style.iconColor}`} />
                          </a>
                        )
                      })}
                    </div>
                  </div>
                </Reveal>
              )}

              {normalizeText(profile.bio) ? (
                <Reveal delay={0.3}>
                  <p className="mt-6 max-w-2xl text-[1rem] leading-[1.85] text-white/80 md:text-[1.05rem]">
                    {profile.bio}
                  </p>
                </Reveal>
              ) : null}

              {facts.length > 0 ? (
                <Reveal delay={0.36}>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {facts.map((fact) => {
                      const Icon = fact.icon

                      return (
                        <div key={`${fact.label}-${fact.value}`} className="flex items-center gap-2 bg-white/6 border border-white/12 rounded-full px-4 py-2 backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                          <Icon className="size-4 text-[#C19A3D] shrink-0" />
                          <span className="text-white/40 uppercase tracking-[0.12em] text-[10px] font-bold">
                            {fact.label}:
                          </span>
                          <span className="font-semibold text-white text-[13px] sm:text-sm">
                            {fact.value}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </Reveal>
              ) : null}
            </div>
          </div>
        </div>
      </section>



      {certificates && certificates.length > 0 ? (
        <section className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(193,154,61,0.08),transparent_26%),linear-gradient(180deg,rgba(253,248,238,0.42)_0%,rgba(255,255,255,1)_26%)]" />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="mb-10 max-w-xl">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                  <Award className="size-4" />
                  Certificates
                </div>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0F1E3D] leading-tight">
                  Verified records issued through club activity.
                </h2>
              </div>
            </Reveal>

            <div className="grid gap-4">
              {certificates.map((certificate, index) => (
                <Reveal key={certificate.id} delay={0.05 + index * 0.03}>
                  <article className="rounded-[1.55rem] border border-[#0F1E3D]/10 bg-[#FDF8EE] p-5 shadow-[0_12px_34px_rgba(15,30,61,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(15,30,61,0.07)] sm:p-6">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0 flex-1">
                        <span className="inline-flex items-center rounded-md bg-[#EEF2F6] px-2.5 py-1 text-xs font-mono font-bold text-[#0F1E3D]/60 ring-1 ring-inset ring-[#0F1E3D]/10 mb-3">
                          ID: {certificate.certificate_id}
                        </span>
                        <h3 className="font-display text-lg sm:text-xl font-semibold tracking-tight text-[#0F1E3D] leading-snug">
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

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

  const query = supabase
    .from("profiles")
    .select("full_name, bio")
    .eq("is_verified", true);

  if (isUuid) {
    query.or(`slug.eq.${slug},id.eq.${slug}`);
  } else {
    query.eq("slug", slug);
  }

  const { data: profile } = await query.maybeSingle();

  if (!profile) return { title: "Member not found" }

  return {
    title: profile.full_name,
    description: profile.bio ?? `${profile.full_name} — Debate Club`,
  }
}
