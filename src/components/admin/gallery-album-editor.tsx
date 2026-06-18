"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { adminCreateAlbum, adminUpdateAlbum } from "@/lib/actions/gallery"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CldUploadWidget } from "next-cloudinary"
import { cloudinaryUploadWidgetStyles } from "@/lib/cloudinary"
import { toast } from "sonner"
import { ImagePlus, Upload } from "lucide-react"

export type AlbumInput = {
  id: string
  title: string
  slug: string
  description: string | null
  cover_image_url: string | null
  event_date: string | null
  is_published: boolean
}

export function GalleryAlbumEditor({
  initialData,
  basePath,
}: {
  initialData?: AlbumInput
  basePath: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [coverUrl, setCoverUrl] = useState<string | null>(initialData?.cover_image_url ?? null)

  function handleSubmit(formData: FormData) {
    const input = {
      title: formData.get("title") as string,
      slug: (formData.get("slug") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      event_date: (formData.get("event_date") as string) || undefined,
      cover_image_url: coverUrl || undefined,
      is_published: formData.get("is_published") === "on",
    }

    startTransition(async () => {
      const result = initialData
        ? await adminUpdateAlbum(initialData.id, input)
        : await adminCreateAlbum(input)

      if (result?.error) {
        toast.error(result.error)
        return
      }

      toast.success(initialData ? "Album updated successfully" : "Album created successfully")
      router.push(basePath)
      router.refresh()
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[1fr_0.92fr]">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#0F1E3D]">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={initialData?.title ?? ""}
              className="h-11 rounded-xl border-[#0F1E3D]/12 bg-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-[#0F1E3D]">
                Slug
              </Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={initialData?.slug ?? ""}
                placeholder="auto-generated"
                className="h-11 rounded-xl border-[#0F1E3D]/12 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_date" className="text-[#0F1E3D]">
                Event date
              </Label>
              <Input
                id="event_date"
                name="event_date"
                type="date"
                defaultValue={initialData?.event_date ?? ""}
                className="h-11 rounded-xl border-[#0F1E3D]/12 bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#0F1E3D]">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={initialData?.description ?? ""}
              className="rounded-xl border-[#0F1E3D]/12 bg-white"
              placeholder="Short editorial summary for the public album page"
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-[#0F1E3D]/10 bg-white px-4 py-3">
            <input
              type="checkbox"
              id="is_published"
              name="is_published"
              defaultChecked={initialData?.is_published ?? false}
              className="size-4 accent-[#0F1E3D]"
            />
            <span>
              <span className="block text-sm font-semibold text-[#0F1E3D]">
                Publish album
              </span>
              <span className="block text-xs text-[#0F1E3D]/60">
                Published albums become available on the public gallery.
              </span>
            </span>
          </label>
        </div>

        <div className="space-y-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
            Cover image
          </div>

          <div className="overflow-hidden rounded-[1.4rem] border border-[#0F1E3D]/10 bg-white">
            <div className="aspect-[4/3] bg-[#F4ECDD]">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt="Album cover preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[#0F1E3D]/35">
                  <div className="text-center">
                    <ImagePlus className="mx-auto size-8" />
                    <div className="mt-3 text-xs font-medium uppercase tracking-[0.18em]">
                      No cover selected
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-[#0F1E3D]/10 p-3">
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{
                  maxFiles: 10,
                  clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
                  maxFileSize: 10000000,
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
                {({ open }) => (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => open?.()}
                    className="rounded-xl border-[#0F1E3D]/12"
                  >
                    <Upload className="mr-2 size-4" />
                    {coverUrl ? "Replace cover" : "Upload cover"}
                  </Button>
                )}
              </CldUploadWidget>

              {coverUrl ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCoverUrl(null)}
                  className="rounded-xl border-[#0F1E3D]/12"
                >
                  Remove
                </Button>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-[#0F1E3D]/10 bg-white px-4 py-3 text-sm leading-6 text-[#0F1E3D]/64">
            Use a strong horizontal image here. The album card should feel polished and
            recognizable before someone enters the photo manager.
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-[#0F1E3D]/10">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(basePath)}
          className="rounded-xl border-[#0F1E3D]/12 px-6"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-[#0F1E3D] px-6 text-white hover:bg-[#162952]"
        >
          {isPending ? "Saving..." : initialData ? "Update Album" : "Create Album"}
        </Button>
      </div>
    </form>
  )
}
