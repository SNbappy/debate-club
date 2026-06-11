import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, ExternalLink, MapPin, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Reveal } from "@/components/home/animations"

function normalizeText(value: string | null | undefined) {
  return value?.trim() || ""
}

function formatFullDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  })
}

function formatShortDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

function formatEventMonth(value: string) {
  return new Date(value).toLocaleString(undefined, { month: "short" })
}

function formatEventDay(value: string) {
  return new Date(value).toLocaleString(undefined, { day: "2-digit" })
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle()

  if (!event) notFound()

  const isPast = new Date(event.event_date) < new Date()
  const image = normalizeText(event.cover_image_url)
  const title = normalizeText(event.title) || "Untitled Event"
  const description = normalizeText(event.description)
  const location = normalizeText(event.location)

  return (
    <main className="bg-white text-[#0F1E3D]">
      <section className="relative overflow-hidden -mt-16 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0B1731_0%,#0F1E3D_58%,#112449_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(255,255,255,0.07),transparent_18%),radial-gradient(circle_at_82%_16%,rgba(193,154,61,0.16),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(8,17,38,0.62),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,30,61,0.94)_0%,rgba(15,30,61,0.78)_34%,rgba(15,30,61,0.44)_60%,rgba(15,30,61,0.76)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#081126]/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FDF8EE] via-[#FDF8EE]/42 to-transparent" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-28 pb-14 sm:pt-32 md:pt-36 md:pb-16">
          <Reveal>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/86 transition-all duration-300 hover:border-white/22 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="size-4" />
              All events
            </Link>
          </Reveal>

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-end lg:gap-14">
            <Reveal delay={0.08}>
              <div className="relative max-w-[30rem]">
                <div className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[#132750] shadow-[0_32px_80px_rgba(0,0,0,0.28)]">
                  <div className="aspect-[4/4.2] bg-[#102246]">
                    {image ? (
                      <img
                        src={image}
                        alt={title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_25%,rgba(193,154,61,0.20),transparent_18%),linear-gradient(180deg,#132750_0%,#0F1E3D_100%)]">
                        <div className="rounded-full border border-[#C19A3D]/30 bg-white/8 px-7 py-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F5E7BF] backdrop-blur-sm">
                          JUSTDC Event
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,30,61,0.02)_0%,rgba(15,30,61,0.10)_42%,rgba(15,30,61,0.42)_100%)]" />
                </div>
                <div className="absolute -bottom-5 left-5 rounded-[1.35rem] bg-[#C19A3D] px-5 py-4 text-black shadow-2xl">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
                    {isPast ? "Past event" : "Upcoming"}
                  </div>
                  <div className="font-display text-[2rem] leading-none">
                    {formatEventMonth(event.event_date)}
                  </div>
                  <div className="mt-1 text-3xl font-bold leading-none">
                    {formatEventDay(event.event_date)}
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="max-w-3xl">
              <Reveal delay={0.12}>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/90 backdrop-blur-md md:text-xs">
                  <Sparkles className="size-3 text-[#C19A3D]" />
                  {isPast ? "Event archive" : "JUSTDC event"}
                </div>
              </Reveal>
              <Reveal delay={0.18}>
                <h1 className="mt-6 font-display text-[3.2rem] leading-[0.88] tracking-[-0.04em] text-white sm:text-[4rem] md:text-[4.8rem] lg:text-[5.05rem]">
                  {title}
                </h1>
              </Reveal>
              <Reveal delay={0.26}>
                <div className="mt-6 space-y-3 text-sm text-white/80">
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 size-4 shrink-0 text-[#C19A3D]" />
                    <span>{formatFullDate(event.event_date)}</span>
                  </div>
                  {event.end_date ? (
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 size-4 shrink-0 text-[#C19A3D]/60" />
                      <span className="text-white/60">Ends: {formatShortDate(event.end_date)}</span>
                    </div>
                  ) : null}
                  {location ? (
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-[#C19A3D]" />
                      <span>{location}</span>
                    </div>
                  ) : null}
                </div>
              </Reveal>
              {normalizeText(event.registration_url) && !isPast ? (
                <Reveal delay={0.34}>
                  <div className="mt-8">
                    <a
                      href={event.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#C19A3D] px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#D8B15A]"
                    >
                      Register for this event
                      <ExternalLink className="size-4" />
                    </a>
                  </div>
                </Reveal>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {description ? (
        <section className="relative overflow-hidden bg-[#FDF8EE] py-16 sm:py-20 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(193,154,61,0.10),transparent_24%),radial-gradient(circle_at_86%_20%,rgba(15,30,61,0.06),transparent_20%)]" />
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
              <Reveal>
                <div>
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                    About this event
                  </div>
                  <h2 className="font-display text-[1.9rem] leading-[0.96] tracking-tight text-[#0F1E3D] sm:text-4xl md:text-5xl">
                    What to expect.
                  </h2>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="rounded-[1.6rem] border border-[#0F1E3D]/10 bg-white p-6 shadow-[0_16px_40px_rgba(15,30,61,0.06)] sm:p-8">
                  <p className="whitespace-pre-wrap text-[1rem] leading-[1.9] text-[#0F1E3D]/82">
                    {description}
                  </p>
                  {normalizeText(event.registration_url) && !isPast ? (
                    <div className="mt-8 border-t border-[#0F1E3D]/10 pt-6">
                      <a
                        href={event.registration_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-[#C19A3D]/40 bg-[#FDF8EE] px-6 py-3 text-sm font-semibold text-[#0F1E3D] transition-all duration-300 hover:border-[#C19A3D] hover:bg-[#fffaf0]"
                      >
                        Register now
                        <ExternalLink className="size-4 text-[#C19A3D]" />
                      </a>
                    </div>
                  ) : null}
                </div>
              </Reveal>
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
  const { data: event } = await supabase
    .from("events")
    .select("title, description")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle()
  if (!event) return { title: "Event not found" }
  return {
    title: event.title,
    description: event.description?.slice(0, 200) ?? undefined,
  }
}