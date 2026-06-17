"use client"

import { useMemo, useState, useTransition } from "react"
import { adminDeleteEvent } from "@/lib/actions/events"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"
import {
  Calendar,
  CalendarClock,
  Check,
  ExternalLink,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react"

type Evt = {
  id: string
  title: string
  slug: string
  description: string | null
  event_date: string
  end_date: string | null
  location: string | null
  registration_url: string | null
  cover_image_url: string | null
  is_published: boolean
}

function formatEventDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

export function EventsAdminClient({ events, basePath = "/admin/events" }: { events: Evt[], basePath?: string }) {
  const [isPending, startTransition] = useTransition()
  const [now] = useState(() => Date.now())

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      ),
    [events]
  )

  const upcomingEvents = useMemo(
    () => sortedEvents.filter((event) => new Date(event.event_date).getTime() >= now),
    [sortedEvents, now]
  )

  const pastEvents = useMemo(
    () =>
      sortedEvents
        .filter((event) => new Date(event.event_date).getTime() < now)
        .reverse(),
    [sortedEvents, now]
  )

  const publishedCount = events.filter((event) => event.is_published).length
  const draftCount = events.length - publishedCount

  function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return

    startTransition(async () => {
      const result = await adminDeleteEvent(id)
      if (result?.error) toast.error(result.error)
      else toast.success("Event deleted")
    })
  }

  function EventCard({
    event,
    urgent = false,
  }: {
    event: Evt
    urgent?: boolean
  }) {
    return (
      <div
        className={`rounded-[22px] border p-5 transition-shadow hover:shadow-[0_14px_35px_rgba(15,30,61,0.08)] ${
          urgent
            ? "border-amber-200 bg-amber-50/50"
            : "border-[#0F1E3D]/8 bg-white"
        }`}
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[1rem] font-semibold text-[#0F1E3D]">
                {event.title}
              </h3>

              {event.is_published ? (
                <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  Published
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="rounded-full border-amber-300 bg-amber-50 text-amber-700"
                >
                  Draft
                </Badge>
              )}
            </div>

            <div className="mt-2 text-sm text-[#0F1E3D]/45">/events/{event.slug}</div>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#0F1E3D]/60">
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock className="size-3.5" />
                {formatEventDate(event.event_date)}
              </span>
              {event.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {event.location}
                </span>
              )}
            </div>

            {event.description && (
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#0F1E3D]/65">
                {event.description}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              {event.registration_url && (
                <span className="rounded-full border border-[#0F1E3D]/10 bg-[#F8F8FA] px-3 py-1.5 text-[#0F1E3D]/55">
                  Registration link added
                </span>
              )}
              {event.cover_image_url && (
                <span className="rounded-full border border-[#0F1E3D]/10 bg-[#F8F8FA] px-3 py-1.5 text-[#0F1E3D]/55">
                  Cover uploaded
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 xl:justify-end">
            {event.is_published && (
              <Link href={`/events/${event.slug}`} target="_blank">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-[#0F1E3D]/12"
                >
                  <ExternalLink className="mr-1.5 size-4" />
                  View
                </Button>
              </Link>
            )}

            <Link href={`${basePath}/${event.id}/edit`}>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl border-[#0F1E3D]/12"
              >
                <Pencil className="mr-1.5 size-4" />
                Edit
              </Button>
            </Link>

            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => handleDelete(event.id)}
              className="rounded-xl border-[#0F1E3D]/12"
            >
              <Trash2 className="mr-1.5 size-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#0F1E3D]/8 bg-white p-5 shadow-[0_20px_60px_rgba(15,30,61,0.06)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C19A3D]/20 bg-[#FBF6E8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A17C27]">
              Event management
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#0F1E3D]">
                Events
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#0F1E3D]/62">
                Manage upcoming programs, publish event pages, and keep debate club
                scheduling clear across the public site.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
            <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-[#F8F8FA] px-4 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/45">
                Total events
              </div>
              <div className="mt-2 text-2xl font-semibold text-[#0F1E3D]">
                {events.length}
              </div>
            </div>

            <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-[#F8F8FA] px-4 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/45">
                Published
              </div>
              <div className="mt-2 text-2xl font-semibold text-[#0F1E3D]">
                {publishedCount}
              </div>
            </div>

            <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-[#F8F8FA] px-4 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/45">
                Drafts
              </div>
              <div className="mt-2 text-2xl font-semibold text-[#0F1E3D]">
                {draftCount}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[#0F1E3D]/8 bg-[#FCFCFD] px-4 py-4">
          <div>
            <div className="text-sm font-medium text-[#0F1E3D]">Create or update event</div>
            <p className="mt-1 text-sm text-[#0F1E3D]/58">
              Add dates, location, registration details, and a public cover image.
            </p>
          </div>

          <Link href={`${basePath}/new`}>
            <Button className="rounded-xl bg-[#0F1E3D] text-white hover:bg-[#1A2E5A]">
              <Plus className="mr-2 size-4" />
              New event
            </Button>
          </Link>
        </div>
      </section>

      {events.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-[#0F1E3D]/15 bg-white p-10 text-center">
          <Calendar className="mx-auto mb-4 size-10 text-[#0F1E3D]/20" />
          <p className="text-sm font-medium text-[#0F1E3D]/55">No events have been added yet.</p>
          <p className="mt-2 text-sm text-[#0F1E3D]/45">
            Create the first event to start building the public calendar.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {upcomingEvents.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarClock className="size-4 text-[#C19A3D]" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/55">
                  Upcoming events
                </h3>
              </div>

              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} urgent />
                ))}
              </div>
            </div>
          )}

          {pastEvents.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Check className="size-4 text-[#C19A3D]" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/55">
                  Past events
                </h3>
              </div>

              <div className="space-y-3">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}