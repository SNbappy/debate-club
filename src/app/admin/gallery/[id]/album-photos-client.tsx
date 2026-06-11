"use client"

import { useMemo, useRef, useState, useTransition } from "react"
import {
  adminAddPhotos,
  adminDeletePhoto,
  adminMovePhoto,
  adminUpdatePhotoCaption,
} from "@/lib/actions/gallery"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Loader2,
  PencilLine,
  Save,
  Trash2,
  X,
} from "lucide-react"

type Photo = {
  id: string
  album_id: string
  image_url: string
  caption: string | null
  order_index: number
}

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

async function uploadOne(file: File): Promise<string> {
  const fd = new FormData()
  fd.append("file", file)
  fd.append("upload_preset", PRESET!)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: "POST",
    body: fd,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return data.secure_url as string
}

export function AlbumPhotosClient({
  albumId,
  photos,
}: {
  albumId: string
  photos: Photo[]
}) {
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [editingCaption, setEditingCaption] = useState<string | null>(null)
  const [captionValue, setCaptionValue] = useState("")
  const [failedUploads, setFailedUploads] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const orderedPhotos = useMemo(
    () => [...photos].sort((a, b) => a.order_index - b.order_index),
    [photos]
  )

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return

    const arr = Array.from(files)
    const urls: string[] = []
    const failed: string[] = []

    setUploading(true)
    setFailedUploads([])
    setProgress({ done: 0, total: arr.length })

    for (let i = 0; i < arr.length; i++) {
      try {
        urls.push(await uploadOne(arr[i]))
      } catch {
        failed.push(arr[i].name)
      } finally {
        setProgress({ done: i + 1, total: arr.length })
      }
    }

    setUploading(false)
    setFailedUploads(failed)

    if (failed.length > 0) {
      toast.error(
        failed.length === 1
          ? `1 upload failed: ${failed[0]}`
          : `${failed.length} uploads failed`
      )
    }

    if (urls.length === 0) return

    const result = await adminAddPhotos(albumId, urls)
    if (result?.error) {
      toast.error(result.error)
      return
    }

    toast.success(
      `Added ${result.added} photo${result.added !== 1 ? "s" : ""}`
    )
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this photo? This will also shift the remaining order.")) return

    startTransition(async () => {
      const result = await adminDeletePhoto(id)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success("Photo deleted")
    })
  }

  function handleSaveCaption(id: string) {
    startTransition(async () => {
      const result = await adminUpdatePhotoCaption(id, captionValue)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success("Caption saved")
      setEditingCaption(null)
      setCaptionValue("")
    })
  }

  function handleMove(id: string, direction: "up" | "down") {
    startTransition(async () => {
      const result = await adminMovePhoto(id, direction)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success(direction === "up" ? "Moved up" : "Moved down")
    })
  }

  function startEditCaption(photo: Photo) {
    setEditingCaption(photo.id)
    setCaptionValue(photo.caption ?? "")
  }

  function cancelEditCaption() {
    setEditingCaption(null)
    setCaptionValue("")
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#0F1E3D]/10 bg-white/90 p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Album photo management
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-[#0F1E3D]">
              Curate sequence, captions, and uploads
            </h2>
            <p className="text-sm text-[#0F1E3D]/64">
              Keep cards concise here. The public gallery carries the richer presentation.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            {uploading ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C19A3D]/25 bg-[#FFF9EC] px-3 py-2 text-xs font-medium text-[#0F1E3D]/78">
                <Loader2 className="size-4 animate-spin text-[#C19A3D]" />
                Uploading {progress.done}/{progress.total}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0F1E3D]/10 bg-[#F7F3EB] px-3 py-2 text-xs font-medium text-[#0F1E3D]/70">
                {orderedPhotos.length} photo{orderedPhotos.length !== 1 ? "s" : ""} in album
              </div>
            )}

            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                handleFiles(e.target.files)
                e.target.value = ""
              }}
              disabled={uploading || isPending}
            />

            <Button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading || isPending}
              className="h-10 rounded-full bg-[#0F1E3D] px-5 text-white hover:bg-[#162952]"
            >
              <ImagePlus className="mr-2 size-4" />
              Add photos
            </Button>
          </div>
        </div>

        {failedUploads.length > 0 ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <div className="font-medium">
              Some uploads failed
            </div>
            <div className="mt-1 line-clamp-2 text-amber-800/90">
              {failedUploads.join(", ")}
            </div>
          </div>
        ) : null}
      </div>

      {orderedPhotos.length === 0 ? (
        <Card className="border-[#0F1E3D]/10 bg-white">
          <CardContent className="py-14 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#F7F1E6] text-[#C19A3D]">
              <ImagePlus className="size-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[#0F1E3D]">
              No photos yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#0F1E3D]/62">
              Upload a first set of images to begin curating this album. You can reorder them and add concise captions afterward.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {orderedPhotos.map((photo, index) => {
            const isEditing = editingCaption === photo.id
            const isFirst = index === 0
            const isLast = index === orderedPhotos.length - 1

            return (
              <Card
                key={photo.id}
                className="overflow-hidden border-[#0F1E3D]/10 bg-white pt-0 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[1/1] overflow-hidden bg-[#F7F1E6]">
                  <img
                    src={photo.image_url}
                    alt={photo.caption ?? `Photo ${index + 1}`}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute left-3 top-3 inline-flex items-center rounded-full border border-white/45 bg-[#0F1E3D]/72 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                    #{index + 1}
                  </div>
                </div>

                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
                        Order position
                      </div>
                      <div className="mt-1 text-sm font-semibold text-[#0F1E3D]">
                        {index + 1} of {orderedPhotos.length}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="size-8 rounded-full border-[#0F1E3D]/12 text-[#0F1E3D] hover:bg-[#F7F1E6]"
                        onClick={() => handleMove(photo.id, "up")}
                        disabled={isPending || uploading || isFirst}
                      >
                        <ArrowUp className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="size-8 rounded-full border-[#0F1E3D]/12 text-[#0F1E3D] hover:bg-[#F7F1E6]"
                        onClick={() => handleMove(photo.id, "down")}
                        disabled={isPending || uploading || isLast}
                      >
                        <ArrowDown className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={captionValue}
                        onChange={(e) => setCaptionValue(e.target.value)}
                        placeholder="Write a short caption"
                        className="h-9 border-[#0F1E3D]/12 text-sm"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleSaveCaption(photo.id)}
                          disabled={isPending || uploading}
                          className="h-8 rounded-full bg-[#0F1E3D] px-3 text-white hover:bg-[#162952]"
                        >
                          <Save className="mr-1.5 size-3.5" />
                          Save
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={cancelEditCaption}
                          disabled={isPending || uploading}
                          className="h-8 rounded-full border-[#0F1E3D]/12 px-3 text-[#0F1E3D]"
                        >
                          <X className="mr-1.5 size-3.5" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEditCaption(photo)}
                      className="block w-full rounded-xl border border-[#0F1E3D]/10 bg-[#FCFAF6] px-3 py-2 text-left transition-colors hover:border-[#C19A3D]/40 hover:bg-[#FFF9EE]"
                    >
                      <div className="mb-1 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C19A3D]">
                        <PencilLine className="size-3" />
                        Caption
                      </div>
                      <div className="line-clamp-2 text-sm leading-6 text-[#0F1E3D]/70">
                        {photo.caption?.trim() || "Add a short caption for this image"}
                      </div>
                    </button>
                  )}

                  <div className="flex items-center justify-end pt-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(photo.id)}
                      disabled={isPending || uploading}
                      className="h-8 rounded-full px-3"
                    >
                      <Trash2 className="mr-1.5 size-3.5" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}