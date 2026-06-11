"use client"

import { useMemo, useState, useTransition } from "react"
import {
  adminCreateAlbum,
  adminDeleteAlbum,
  adminUpdateAlbum,
} from "@/lib/actions/gallery"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CldUploadWidget } from "next-cloudinary"
import { toast } from "sonner"
import Link from "next/link"
import {
  CalendarDays,
  Check,
  ExternalLink,
  ImagePlus,
  Images,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react"

type Album = {
  id: string
  title: string
  slug: string
  description: string | null
  cover_image_url: string | null
  event_date: string | null
  is_published: boolean
  gallery_images: { count: number }[]
}

function formatDate(value: string | null) {
  if (!value) return "No date"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function GalleryAdminClient({ albums }: { albums: Album[] }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Album | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const sortedAlbums = useMemo(() => {
    return [...albums].sort((a, b) => {
      if (a.event_date && b.event_date) {
        return new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
      }
      if (a.event_date) return -1
      if (b.event_date) return 1
      return a.title.localeCompare(b.title)
    })
  }, [albums])

  const draftAlbums = useMemo(
    () => sortedAlbums.filter((album) => !album.is_published),
    [sortedAlbums]
  )

  const publishedAlbums = useMemo(
    () => sortedAlbums.filter((album) => album.is_published),
    [sortedAlbums]
  )

  const totalPhotos = useMemo(
    () => albums.reduce((sum, album) => sum + (album.gallery_images?.[0]?.count ?? 0), 0),
    [albums]
  )

  function openNew() {
    setEditing(null)
    setCoverUrl(null)
    setOpen(true)
  }

  function openEdit(album: Album) {
    setEditing(album)
    setCoverUrl(album.cover_image_url)
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
      event_date: (formData.get("event_date") as string) || undefined,
      cover_image_url: coverUrl || undefined,
      is_published: formData.get("is_published") === "on",
    }

    startTransition(async () => {
      const result = editing
        ? await adminUpdateAlbum(editing.id, input)
        : await adminCreateAlbum(input)

      if (result?.error) {
        toast.error(result.error)
        return
      }

      toast.success(editing ? "Album updated" : "Album created")
      closeAll()
    })
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this album and all its photos?")) return

    startTransition(async () => {
      const result = await adminDeleteAlbum(id)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success("Album deleted")
    })
  }

  function AlbumCard({
    album,
    urgent = false,
  }: {
    album: Album
    urgent?: boolean
  }) {
    const count = album.gallery_images?.[0]?.count ?? 0

    return (
      <div
        className={`overflow-hidden rounded-[24px] border transition-shadow hover:shadow-[0_18px_40px_rgba(15,30,61,0.08)] ${
          urgent
            ? "border-amber-200 bg-amber-50/40"
            : "border-[#0F1E3D]/8 bg-white"
        }`}
      >
        <div className="relative overflow-hidden border-b border-[#0F1E3D]/8">
          {album.cover_image_url ? (
            <img
              src={album.cover_image_url}
              alt={album.title}
              className="aspect-[16/10] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[16/10] items-center justify-center bg-[#F4ECDD] text-[#0F1E3D]/30">
              <Images className="size-10" />
            </div>
          )}

          <div className="absolute left-3 top-3 flex items-center gap-2">
            {album.is_published ? (
              <Badge className="rounded-full bg-[#0F1E3D]/88 text-white hover:bg-[#0F1E3D]/88">
                Published
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="rounded-full border-amber-300 bg-white/90 text-amber-700"
              >
                Draft
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Album
            </div>
            <h3 className="text-lg font-semibold leading-snug tracking-tight text-[#0F1E3D]">
              {album.title}
            </h3>

            {album.description ? (
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#0F1E3D]/64">
                {album.description}
              </p>
            ) : (
              <p className="mt-2 text-sm leading-6 text-[#0F1E3D]/46">
                No description added yet.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-[#0F1E3D]/64">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#0F1E3D]/10 bg-[#FCFAF6] px-3 py-1.5">
              <Images className="size-3.5" />
              {count} photo{count !== 1 ? "s" : ""}
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#0F1E3D]/10 bg-[#FCFAF6] px-3 py-1.5">
              <CalendarDays className="size-3.5" />
              {formatDate(album.event_date)}
            </div>
          </div>

          <div className="rounded-[18px] border border-[#0F1E3D]/10 bg-[#FCFAF6] px-3 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Slug
            </div>
            <div className="mt-1 truncate text-sm font-medium text-[#0F1E3D]">
              {album.slug}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Link href={`/admin/gallery/${album.id}`} className="flex-1 min-w-[10rem]">
              <Button className="w-full rounded-xl bg-[#0F1E3D] text-white hover:bg-[#162952]">
                <Images className="mr-2 size-4" />
                Manage photos
              </Button>
            </Link>

            {album.is_published ? (
              <Link href={`/gallery/${album.slug}`} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="rounded-xl border-[#0F1E3D]/12 text-[#0F1E3D]"
                >
                  <ExternalLink className="size-4" />
                </Button>
              </Link>
            ) : null}

            <Button
              type="button"
              variant="outline"
              onClick={() => openEdit(album)}
              className="rounded-xl border-[#0F1E3D]/12 text-[#0F1E3D]"
            >
              <Pencil className="size-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => handleDelete(album.id)}
              className="rounded-xl border-[#0F1E3D]/12 text-[#0F1E3D] hover:border-red-200 hover:text-red-600"
            >
              <Trash2 className="size-4" />
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
              Archive management
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#0F1E3D]">
                Gallery
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#0F1E3D]/62">
                Organize event albums, maintain a clean public archive, and route each
                collection into its own photo management flow.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
            <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-[#F8F8FA] px-4 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/45">
                Total albums
              </div>
              <div className="mt-2 text-2xl font-semibold text-[#0F1E3D]">
                {albums.length}
              </div>
            </div>

            <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-[#F8F8FA] px-4 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/45">
                Published
              </div>
              <div className="mt-2 text-2xl font-semibold text-[#0F1E3D]">
                {publishedAlbums.length}
              </div>
            </div>

            <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-[#F8F8FA] px-4 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/45">
                Total photos
              </div>
              <div className="mt-2 text-2xl font-semibold text-[#0F1E3D]">
                {totalPhotos}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[#0F1E3D]/8 bg-[#FCFCFD] px-4 py-4">
          <div>
            <div className="text-sm font-medium text-[#0F1E3D]">
              Create or update albums
            </div>
            <p className="mt-1 text-sm text-[#0F1E3D]/58">
              Keep album metadata concise here, then manage image collections inside each album.
            </p>
          </div>

          <Button
            type="button"
            onClick={openNew}
            className="rounded-xl bg-[#0F1E3D] px-5 text-white hover:bg-[#162952]"
          >
            <Plus className="mr-2 size-4" />
            New album
          </Button>
        </div>
      </section>

      <Dialog
        open={open}
        modal={false}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) closeAll()
          else setOpen(true)
        }}
      >
        <DialogContent
          className="max-w-2xl border-[#0F1E3D]/10 bg-[#FFFCF6] p-0 shadow-[0_24px_70px_rgba(15,30,61,0.16)]"
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="overflow-hidden rounded-[1.5rem]">
            <div className="border-b border-[#0F1E3D]/10 bg-[#0F1E3D] px-6 py-5 text-white">
              <DialogHeader>
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
                  {editing ? "Album editing" : "Album creation"}
                </div>
                <DialogTitle className="mt-2 text-left text-[1.75rem] font-semibold leading-none tracking-[-0.03em] text-white">
                  {editing ? "Refine album details" : "Create a new album"}
                </DialogTitle>
              </DialogHeader>
            </div>

            <form
              key={editing?.id ?? "new"}
              action={handleSubmit}
              className="space-y-5 px-6 py-6"
            >
              <div className="grid gap-5 md:grid-cols-[1fr_0.92fr]">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-[#0F1E3D]">
                      Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      required
                      defaultValue={editing?.title ?? ""}
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
                        defaultValue={editing?.slug ?? ""}
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
                        defaultValue={editing?.event_date ?? ""}
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
                      defaultValue={editing?.description ?? ""}
                      className="rounded-xl border-[#0F1E3D]/12 bg-white"
                      placeholder="Short editorial summary for the public album page"
                    />
                  </div>

                  <label className="flex items-center gap-3 rounded-2xl border border-[#0F1E3D]/10 bg-white px-4 py-3">
                    <input
                      type="checkbox"
                      id="is_published"
                      name="is_published"
                      defaultChecked={editing?.is_published ?? false}
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

                <div className="space-y-3">
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

              <DialogFooter className="gap-2 border-t border-[#0F1E3D]/10 pt-5">
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
                  className="rounded-xl bg-[#0F1E3D] px-5 text-white hover:bg-[#162952]"
                >
                  {isPending ? "Saving..." : editing ? "Update album" : "Create album"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {sortedAlbums.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-[#0F1E3D]/15 bg-white p-10 text-center">
          <Images className="mx-auto mb-4 size-10 text-[#0F1E3D]/20" />
          <p className="text-sm font-medium text-[#0F1E3D]/55">No albums have been added yet.</p>
          <p className="mt-2 text-sm text-[#0F1E3D]/45">
            Create the first gallery album to begin building the public archive.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {draftAlbums.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Images className="size-4 text-[#C19A3D]" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/55">
                  Draft albums
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {draftAlbums.map((album) => (
                  <AlbumCard key={album.id} album={album} urgent />
                ))}
              </div>
            </div>
          )}

          {publishedAlbums.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Check className="size-4 text-[#C19A3D]" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/55">
                  Published albums
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {publishedAlbums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}