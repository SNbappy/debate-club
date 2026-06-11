"use client"

import { useMemo, useState, useTransition } from "react"
import {
  adminCreateEvent,
  adminDeleteEvent,
  adminUpdateEvent,
} from "@/lib/actions/events"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CldUploadWidget } from "next-cloudinary"
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
  Upload,
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

function isoToLocalInput(iso: string | null | undefined): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`
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

export function EventsAdminClient({ events }: { events: Evt[] }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Evt | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const now = Date.now()

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

  function openNew() {
    setEditing(null)
    setCoverUrl(null)
    setOpen(true)
  }

  function openEdit(event: Evt) {
    setEditing(event)
    setCoverUrl(event.cover_image_url)
    setOpen(true)
  }

  function closeAll() {
    setOpen(false)
    setEditing(null)
    setCoverUrl(null)
  }

  function handleSubmit(formData: FormData) {
    const input = {
      title: formData.get("title") as string,
      slug: (formData.get("slug") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      event_date: formData.get("event_date") as string,
      end_date: (formData.get("end_date") as string) || undefined,
      location: (formData.get("location") as string) || undefined,
      registration_url: (formData.get("registration_url") as string) || undefined,
      cover_image_url: coverUrl || undefined,
      is_published: formData.get("is_published") === "on",
    }

    startTransition(async () => {
      const result = editing
        ? await adminUpdateEvent(editing.id, input)
        : await adminCreateEvent(input)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(editing ? "Event updated" : "Event created")
        closeAll()
      }
    })
  }

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

            <Button
              size="sm"
              variant="outline"
              onClick={() => openEdit(event)}
              className="rounded-xl border-[#0F1E3D]/12"
            >
              <Pencil className="mr-1.5 size-4" />
              Edit
            </Button>

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

          <Button
            onClick={openNew}
            className="rounded-xl bg-[#0F1E3D] text-white hover:bg-[#1A2E5A]"
          >
            <Plus className="mr-2 size-4" />
            New event
          </Button>
        </div>
      </section>

      <Dialog
        open={open}
        modal={false}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) closeAll()
        }}
      >
        <DialogContent
          className="max-h-[90vh] max-w-2xl overflow-y-auto border-[#0F1E3D]/10 bg-[#FFFEFC] p-0 shadow-[0_24px_80px_rgba(15,30,61,0.16)]"
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="border-b border-[#0F1E3D]/8 bg-[linear-gradient(180deg,rgba(8,23,49,0.98)_0%,rgba(13,34,68,0.98)_100%)] px-6 py-5 text-white">
            <DialogHeader className="space-y-2 text-left">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F7E9BF]">
                {editing ? "Edit event" : "New event"}
              </div>
              <DialogTitle className="text-xl font-semibold text-white">
                {editing ? "Update event details" : "Create event"}
              </DialogTitle>
              <DialogDescription className="max-w-xl text-sm leading-6 text-white/72">
                Set timing, visibility, location, and cover media for the event page.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form
            key={editing?.id ?? "new"}
            action={handleSubmit}
            className="space-y-5 p-6"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="title" className="text-[#0F1E3D]">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  required
                  defaultValue={editing?.title ?? ""}
                  className="h-11 rounded-xl border-[#0F1E3D]/12"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="slug" className="text-[#0F1E3D]">
                  Slug
                </Label>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={editing?.slug ?? ""}
                  placeholder="auto-generated if left empty"
                  className="h-11 rounded-xl border-[#0F1E3D]/12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_date" className="text-[#0F1E3D]">
                  Start time
                </Label>
                <Input
                  id="event_date"
                  name="event_date"
                  type="datetime-local"
                  required
                  defaultValue={isoToLocalInput(editing?.event_date)}
                  className="h-11 rounded-xl border-[#0F1E3D]/12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date" className="text-[#0F1E3D]">
                  End time
                </Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="datetime-local"
                  defaultValue={isoToLocalInput(editing?.end_date)}
                  className="h-11 rounded-xl border-[#0F1E3D]/12"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="location" className="text-[#0F1E3D]">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={editing?.location ?? ""}
                  placeholder="Campus auditorium, online, seminar room, etc."
                  className="h-11 rounded-xl border-[#0F1E3D]/12"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="registration_url" className="text-[#0F1E3D]">
                  Registration URL
                </Label>
                <Input
                  id="registration_url"
                  name="registration_url"
                  type="url"
                  defaultValue={editing?.registration_url ?? ""}
                  placeholder="https://..."
                  className="h-11 rounded-xl border-[#0F1E3D]/12"
                />
              </div>

              <div className="space-y-3 sm:col-span-2">
                <Label className="text-[#0F1E3D]">Cover image</Label>

                <div className="rounded-[20px] border border-dashed border-[#0F1E3D]/14 bg-[#F8F8FA] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-medium text-[#0F1E3D]">
                        Upload event cover
                      </div>
                      <p className="mt-1 text-sm text-[#0F1E3D]/55">
                        PNG, JPG, or WebP up to 5MB.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <CldUploadWidget
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                        options={{
                          maxFiles: 1,
                          clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
                          maxFileSize: 5000000,
                        }}
                        onSuccess={(result) => {
                          const info = result.info
                          if (
                            info &&
                            typeof info === "object" &&
                            "secure_url" in info &&
                            typeof info.secure_url === "string"
                          ) {
                            setCoverUrl(info.secure_url)
                          }
                        }}
                      >
                        {({ open: openWidget }) => (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => openWidget?.()}
                            className="rounded-xl border-[#0F1E3D]/12 bg-white"
                          >
                            <Upload className="mr-2 size-4" />
                            {coverUrl ? "Replace image" : "Upload image"}
                          </Button>
                        )}
                      </CldUploadWidget>

                      {coverUrl && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCoverUrl(null)}
                          className="rounded-xl border-[#0F1E3D]/12 bg-white"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>

                  {coverUrl && (
                    <div className="mt-4 overflow-hidden rounded-[18px] border border-[#0F1E3D]/10 bg-white">
                      <img
                        src={coverUrl}
                        alt="Event cover preview"
                        className="h-44 w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description" className="text-[#0F1E3D]">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={6}
                  defaultValue={editing?.description ?? ""}
                  className="min-h-[132px] rounded-xl border-[#0F1E3D]/12"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-3 rounded-2xl border border-[#0F1E3D]/10 bg-[#F8F8FA] px-4 py-3">
                  <input
                    type="checkbox"
                    id="is_published"
                    name="is_published"
                    defaultChecked={editing?.is_published ?? false}
                    className="size-4"
                  />
                  <span className="text-sm text-[#0F1E3D]">
                    Publish this event on the public site
                  </span>
                </label>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={closeAll}
                className="rounded-xl border-[#0F1E3D]/12"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="rounded-xl bg-[#0F1E3D] text-white hover:bg-[#1A2E5A]"
              >
                {isPending ? "Saving..." : editing ? "Update event" : "Create event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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