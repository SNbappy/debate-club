"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { adminCreateEvent, adminUpdateEvent } from "@/lib/actions/events"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CldUploadWidget } from "next-cloudinary"
import { toast } from "sonner"
import { Upload } from "lucide-react"
import { cloudinaryUploadWidgetStyles } from "@/lib/cloudinary"

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

export function EventEditor({
  event,
  basePath,
}: {
  event?: Evt
  basePath: string
}) {
  const router = useRouter()
  const [coverUrl, setCoverUrl] = useState<string | null>(event?.cover_image_url ?? null)
  const [isPending, startTransition] = useTransition()

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
      const result = event
        ? await adminUpdateEvent(event.id, input)
        : await adminCreateEvent(input)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(event ? "Event updated" : "Event created")
        router.push(basePath)
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-3 sm:col-span-2">
          <Label htmlFor="title" className="text-sm font-semibold text-[#0F1E3D]">
            Event Title
          </Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={event?.title ?? ""}
            className="h-12 rounded-xl border-[#0F1E3D]/12 bg-[#FCFCFD] px-4 text-[15px] shadow-sm transition-colors focus:bg-white"
          />
        </div>

        <div className="space-y-3 sm:col-span-2">
          <Label htmlFor="slug" className="text-sm font-semibold text-[#0F1E3D]">
            Slug
          </Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={event?.slug ?? ""}
            placeholder="auto-generated if left empty"
            className="h-12 rounded-xl border-[#0F1E3D]/12 bg-[#FCFCFD] px-4 text-[15px] shadow-sm transition-colors focus:bg-white"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="event_date" className="text-sm font-semibold text-[#0F1E3D]">
            Start time
          </Label>
          <Input
            id="event_date"
            name="event_date"
            type="datetime-local"
            required
            defaultValue={isoToLocalInput(event?.event_date)}
            className="h-12 rounded-xl border-[#0F1E3D]/12 bg-[#FCFCFD] px-4 text-[15px] shadow-sm transition-colors focus:bg-white"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="end_date" className="text-sm font-semibold text-[#0F1E3D]">
            End time
          </Label>
          <Input
            id="end_date"
            name="end_date"
            type="datetime-local"
            defaultValue={isoToLocalInput(event?.end_date)}
            className="h-12 rounded-xl border-[#0F1E3D]/12 bg-[#FCFCFD] px-4 text-[15px] shadow-sm transition-colors focus:bg-white"
          />
        </div>

        <div className="space-y-3 sm:col-span-2">
          <Label htmlFor="location" className="text-sm font-semibold text-[#0F1E3D]">
            Location
          </Label>
          <Input
            id="location"
            name="location"
            defaultValue={event?.location ?? ""}
            placeholder="Campus auditorium, online, seminar room, etc."
            className="h-12 rounded-xl border-[#0F1E3D]/12 bg-[#FCFCFD] px-4 text-[15px] shadow-sm transition-colors focus:bg-white"
          />
        </div>

        <div className="space-y-3 sm:col-span-2">
          <Label htmlFor="registration_url" className="text-sm font-semibold text-[#0F1E3D]">
            Registration URL
          </Label>
          <Input
            id="registration_url"
            name="registration_url"
            type="url"
            defaultValue={event?.registration_url ?? ""}
            placeholder="https://..."
            className="h-12 rounded-xl border-[#0F1E3D]/12 bg-[#FCFCFD] px-4 text-[15px] shadow-sm transition-colors focus:bg-white"
          />
        </div>

        <div className="space-y-4 sm:col-span-2">
          <Label className="text-sm font-semibold text-[#0F1E3D]">Cover image</Label>

          <div className="rounded-[24px] border border-dashed border-[#0F1E3D]/15 bg-[#F8F8FA] p-6 transition-colors hover:border-[#0F1E3D]/30">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-medium text-[#0F1E3D]">Upload event cover</div>
                <p className="mt-1 text-sm text-[#0F1E3D]/60">
                  PNG, JPG, or WebP up to 5MB.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  options={{
                    maxFiles: 1,
                    clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
                    maxFileSize: 5000000,
                    singleUploadAutoClose: false,
                    styles: cloudinaryUploadWidgetStyles,
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
                      className="h-11 rounded-xl border-[#0F1E3D]/12 bg-white px-5 shadow-sm"
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
                    className="h-11 rounded-xl border-red-200 bg-red-50 px-5 text-red-600 hover:bg-red-100 hover:text-red-700 shadow-sm"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>

            {coverUrl && (
              <div className="mt-6 overflow-hidden rounded-[20px] border border-[#0F1E3D]/10 bg-white shadow-sm">
                <img
                  src={coverUrl}
                  alt="Event cover preview"
                  className="h-64 w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 sm:col-span-2">
          <Label htmlFor="description" className="text-sm font-semibold text-[#0F1E3D]">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            rows={6}
            defaultValue={event?.description ?? ""}
            className="min-h-[160px] rounded-xl border-[#0F1E3D]/12 bg-[#FCFCFD] p-4 text-[15px] shadow-sm transition-colors focus:bg-white leading-relaxed"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-[#0F1E3D]/12 bg-[#F8F8FA] p-5 transition-colors hover:border-[#0F1E3D]/30">
            <div className="flex h-6 items-center">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                defaultChecked={event?.is_published ?? false}
                className="size-5 rounded border-[#0F1E3D]/20 bg-white text-[#0F1E3D] focus:ring-[#0F1E3D]"
              />
            </div>
            <div>
              <div className="font-semibold text-[#0F1E3D]">Publish this event</div>
              <p className="mt-1 text-sm text-[#0F1E3D]/60">
                Make this event visible on the public calendar immediately.
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end border-t border-[#0F1E3D]/8 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(basePath)}
          className="h-12 rounded-xl border-[#0F1E3D]/12 px-8 text-[15px] font-medium"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 rounded-xl bg-[#0F1E3D] px-8 text-[15px] font-medium text-white shadow-md transition-transform hover:-translate-y-0.5 hover:bg-[#1A2E5A] hover:shadow-lg"
        >
          {isPending ? "Saving..." : event ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  )
}
