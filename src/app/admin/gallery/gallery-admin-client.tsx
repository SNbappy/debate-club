"use client"

import { useMemo, useTransition } from "react"
import { adminDeleteAlbum } from "@/lib/actions/gallery"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"
import {
  CalendarDays,
  Check,
  ExternalLink,
  Images,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react"

export type Album = {
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

            <Link href={`/admin/gallery/${album.id}/edit`}>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-[#0F1E3D]/12 text-[#0F1E3D]"
              >
                <Pencil className="size-4" />
              </Button>
            </Link>

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

          <Link href="/admin/gallery/new">
            <Button
              type="button"
              className="rounded-xl bg-[#0F1E3D] px-5 text-white hover:bg-[#162952]"
            >
              <Plus className="mr-2 size-4" />
              New album
            </Button>
          </Link>
        </div>
      </section>

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