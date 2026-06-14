import Link from "next/link"
import { Calendar, Clock3, MapPin, ArrowRight, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Reveal } from "@/components/home/animations"

type Evt = {
  id: string
  title: string
  slug: string
  description: string | null
  event_date: string
  location: string | null
  cover_image_url: string | null
}

function normalizeText(value: string | null | undefined) {
  return value?.trim() || ""
}

function formatEventDate(value: string) {
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

function EventCard({
  event,
  isPast = false,
  featured = false,
  delay = 0,
}: {
  event: Evt
  isPast?: boolean
  featured?: boolean
  delay?: number
}) {
  const image = normalizeText(event.cover_image_url)
  const title = normalizeText(event.title) || "Untitled Event"
  const description = normalizeText(event.description)

  return (
    <Reveal delay={delay}>
      <Link href={`/events/${event.slug}`} className="group block h-full">
        <article
          className={[
            "h-full overflow-hidden border transition-all duration-300",
            featured
              ? "rounded-[1.9rem] border-white/10 bg-[#132750] text-white shadow-[0_32px_80px_rgba(0,0,0,0.28)]"
              : isPast
                ? "rounded-[1.55rem] border-[#0F1E3D]/10 bg-[#F7F1E6] shadow-[0_12px_34px_rgba(15,30,61,0.04)] hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(15,30,61,0.07)]"
                : "rounded-[1.55rem] border-[#0F1E3D]/10 bg-white shadow-[0_14px_38px_rgba(15,30,61,0.06)] hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(15,30,61,0.10)]",
          ].join(" ")}
        >
          <div className={featured ? "grid h-full lg:grid-cols-[1.05fr_0.95fr]" : ""}>
            <div className="relative overflow-hidden bg-[#0F1E3D]">
              <div className={featured ? "aspect-[4/3.4] h-full lg:aspect-auto" : "aspect-[4/2.6]"}>
                {image ? (
                  <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_24%_20%,rgba(193,154,61,0.22),transparent_18%),linear-gradient(180deg,#132750_0%,#0F1E3D_100%)]">
                    <div className="rounded-full border border-[#C19A3D]/35 bg-white/8 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F5E7BF] backdrop-blur-sm">
                      JUSTDC Event
                    </div>
                  </div>
                )}
              </div>
              <div className={[
                "absolute inset-0",
                featured
                  ? "bg-[linear-gradient(180deg,rgba(15,30,61,0.12)_0%,rgba(15,30,61,0.14)_38%,rgba(15,30,61,0.72)_100%)]"
                  : "bg-gradient-to-t from-[#0F1E3D]/18 via-transparent to-transparent",
              ].join(" ")} />
              <div className="absolute left-4 top-4 flex h-14 w-14 flex-col items-center justify-center rounded-[1rem] border border-white/12 bg-[#0F1E3D]/78 text-white backdrop-blur-md">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                  {formatEventMonth(event.event_date)}
                </span>
                <span className="mt-0.5 text-lg font-bold leading-none">
                  {formatEventDay(event.event_date)}
                </span>
              </div>
              {featured ? (
                <div className="absolute bottom-4 left-4 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/88 backdrop-blur-md">
                  Featured upcoming
                </div>
              ) : isPast ? (
                <div className="absolute bottom-4 left-4 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/88 backdrop-blur-md">
                  Past event
                </div>
              ) : null}
            </div>
            <div className={featured ? "flex flex-col justify-between p-6 md:p-8" : "p-5"}>
              <div>
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
                  {isPast ? "Archive" : "Event spotlight"}
                </div>
                <h3 className={[
                  "tracking-tight",
                  featured
                    ? "font-display text-[2.2rem] leading-[0.94] text-white md:text-[2.7rem]"
                    : "font-display text-[1.75rem] leading-[0.95] text-[#0F1E3D]",
                ].join(" ")}>
                  {title}
                </h3>
                <div className={[
                  "mt-4 space-y-2 text-sm",
                  featured ? "text-white/74" : "text-[#0F1E3D]/62",
                ].join(" ")}>
                  <div className="flex items-start gap-2">
                    <Calendar className="mt-0.5 size-4 shrink-0 text-[#C19A3D]" />
                    <span>{formatEventDate(event.event_date)}</span>
                  </div>
                  {normalizeText(event.location) ? (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-[#C19A3D]" />
                      <span>{event.location}</span>
                    </div>
                  ) : null}
                </div>
                {description ? (
                  <p className={[
                    "mt-5 line-clamp-3 text-[15px] leading-7",
                    featured ? "text-white/80" : "text-[#0F1E3D]/70",
                  ].join(" ")}>
                    {description}
                  </p>
                ) : null}
              </div>
              <div className={[
                "mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3",
                featured ? "text-white" : "text-[#0F1E3D]",
              ].join(" ")}>
                View details
                <ArrowRight className="size-4 text-[#C19A3D]" />
              </div>
            </div>
          </div>
        </article>
      </Link>
    </Reveal>
  )
}

export default async function EventsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("event_date", { ascending: true })

  const now = new Date()
  const upcoming = (data ?? []).filter((e) => new Date(e.event_date) >= now)
  const past = (data ?? []).filter((e) => new Date(e.event_date) < now).reverse()
  const featuredUpcoming = upcoming[0] ?? null
  const remainingUpcoming = featuredUpcoming ? upcoming.slice(1) : []

  return (
    <main className="bg-white text-[#0F1E3D]">
      <section className="relative overflow-hidden -mt-16 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0B1731_0%,#0F1E3D_58%,#112449_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(255,255,255,0.07),transparent_18%),radial-gradient(circle_at_82%_16%,rgba(193,154,61,0.16),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(8,17,38,0.62),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,30,61,0.94)_0%,rgba(15,30,61,0.78)_34%,rgba(15,30,61,0.44)_60%,rgba(15,30,61,0.76)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#081126]/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FDF8EE] via-[#FDF8EE]/42 to-transparent" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-28 pb-14 sm:pt-32 md:pt-36 md:pb-16">
          <div className="grid gap-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-end">
            <div className="max-w-4xl">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/90 backdrop-blur-md md:text-xs">
                  {/* <Sparkles className="size-3 text-[#C19A3D]" /> */}
                  JUSTDC events
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <h1 className="mt-6 font-display text-[3.15rem] leading-[0.84] tracking-[-0.045em] text-white sm:text-[4rem] md:text-[4.9rem] lg:text-[5.2rem]">
                  Tournaments,
                  <br />
                  sessions, and the
                  <br />
                  rhythm of the <span className="italic text-[#C19A3D]">club</span>.
                </h1>
              </Reveal>
              <Reveal delay={0.24}>
                <p className="mt-6 max-w-2xl text-[1rem] leading-[1.8] text-white/82 md:text-[1.05rem]">
                  Follow upcoming debates, workshops, training sessions, and major moments that shape the public life of JUST Debate Club.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.4}>
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-[1.3rem] border border-white/10 bg-white/7 px-5 py-5 backdrop-blur-md">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C19A3D]">Published</div>
                  <div className="text-3xl font-bold text-white">{data?.length ?? 0}</div>
                </div>
                <div className="rounded-[1.3rem] border border-white/10 bg-white/7 px-5 py-5 backdrop-blur-md">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C19A3D]">Upcoming</div>
                  <div className="text-3xl font-bold text-white">{upcoming.length}</div>
                </div>
                <div className="rounded-[1.3rem] border border-white/10 bg-white/7 px-5 py-5 backdrop-blur-md">
                  <div className="mb-2 flex items-center gap-2 text-[#C19A3D]">
                    <Clock3 className="size-4" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.24em]">Archive</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{past.length}</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {featuredUpcoming ? (
        <section className="relative overflow-hidden bg-[#FDF8EE] py-16 sm:py-20 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(193,154,61,0.10),transparent_24%),radial-gradient(circle_at_86%_20%,rgba(15,30,61,0.06),transparent_20%)]" />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="mb-10 max-w-2xl">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">Upcoming highlight</div>
                <h2 className="font-display text-[1.9rem] leading-[0.96] tracking-tight text-[#0F1E3D] sm:text-4xl md:text-5xl">
                  The next major date on the JUSTDC calendar.
                </h2>
              </div>
            </Reveal>
            <EventCard event={featuredUpcoming} featured />
          </div>
        </section>
      ) : null}

      {remainingUpcoming.length > 0 ? (
        <section className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(193,154,61,0.07),transparent_20%),radial-gradient(circle_at_84%_80%,rgba(15,30,61,0.05),transparent_22%)]" />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="mb-10 grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
                <div className="max-w-xl">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">Upcoming events</div>
                  <h2 className="font-display text-[1.9rem] leading-[0.96] tracking-tight text-[#0F1E3D] sm:text-4xl md:text-5xl">
                    What is coming next.
                  </h2>
                </div>
                <p className="max-w-2xl text-base leading-8 text-[#0F1E3D]/68 lg:justify-self-end">
                  A refined listing of scheduled debate activity, training sessions, workshops, and competitions open to the club community.
                </p>
              </div>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {remainingUpcoming.map((event, index) => (
                <EventCard key={event.id} event={event} delay={0.04 + index * 0.03} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {past.length > 0 ? (
        <section className="relative overflow-hidden bg-[#FDF8EE] py-16 sm:py-20 md:py-24">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(253,248,238,1)_14%)]" />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="mb-10 grid gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
                <div className="max-w-xl">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">Past events</div>
                  <h2 className="font-display text-[1.9rem] leading-[0.96] tracking-tight text-[#0F1E3D] sm:text-4xl md:text-5xl">
                    An archive of previous activity.
                  </h2>
                </div>
                <p className="max-w-2xl text-base leading-8 text-[#0F1E3D]/66 lg:justify-self-end">
                  Earlier tournaments, workshops, and gatherings remain visible here as part of the public record.
                </p>
              </div>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {past.map((event, index) => (
                <EventCard key={event.id} event={event} isPast delay={0.03 + index * 0.02} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {!featuredUpcoming && remainingUpcoming.length === 0 && past.length === 0 ? (
        <section className="relative overflow-hidden bg-[#FDF8EE] py-16 sm:py-20 md:py-24">
          <div className="relative mx-auto max-w-4xl px-6">
            <Reveal>
              <div className="rounded-[1.6rem] border border-[#0F1E3D]/10 bg-white p-10 text-center shadow-[0_18px_44px_rgba(15,30,61,0.06)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">Events</div>
                <h2 className="mt-3 font-display text-[2rem] leading-none text-[#0F1E3D]">No published events yet</h2>
                <p className="mt-4 text-sm leading-7 text-[#0F1E3D]/66">
                  Upcoming debates, workshops, and club activities will appear here once published.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}
    </main>
  )
}