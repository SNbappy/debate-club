import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink, ImageIcon, PencilLine, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { AlbumPhotosClient } from "./album-photos-client"

function formatDate(value: string | null | undefined) {
  if (!value) return "Not set"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default async function AdminAlbumPhotosPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: album }, { data: photos }] = await Promise.all([
    supabase.from("gallery_albums").select("*").eq("id", id).maybeSingle(),
    supabase.from("gallery_images").select("*").eq("album_id", id).order("order_index"),
  ])

  if (!album) notFound()

  const photoCount = photos?.length ?? 0
  const isPublished = Boolean(album.is_published)
  const albumLink = album.slug ? `/gallery/${album.slug}` : "/gallery"

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/admin/gallery"
          className="inline-flex items-center gap-2 rounded-full border border-[#0F1E3D]/10 bg-white px-4 py-2 text-sm text-[#0F1E3D]/72 shadow-sm transition-colors hover:border-[#C19A3D]/40 hover:text-[#0F1E3D]"
        >
          <ArrowLeft className="size-4" />
          All albums
        </Link>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-[#0F1E3D]/10 bg-white shadow-[0_20px_60px_rgba(15,30,61,0.08)]">
        <div className="relative overflow-hidden bg-[#0F1E3D] px-6 py-8 text-white sm:px-8 sm:py-9">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,30,61,0.98),rgba(15,30,61,0.92))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(193,154,61,0.16),transparent_20%),radial-gradient(circle_at_82%_12%,rgba(255,255,255,0.08),transparent_18%)]" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/86 backdrop-blur-md">
                <Sparkles className="size-3.5 text-[#C19A3D]" />
                Album editor
              </div>

              <h1 className="mt-5 font-display text-[2.6rem] leading-[0.92] tracking-[-0.04em] text-white sm:text-[3.4rem] lg:text-[4rem]">
                {album.title}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/74 sm:text-[0.98rem]">
                Curate the photo order, captions, and upload flow here. Keep the interface compact; the public album carries the richer viewing experience.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={albumLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md transition-colors hover:bg-white/12"
              >
                <ExternalLink className="size-3.5" />
                View public album
              </Link>
              <Link
                href={`/admin/gallery/${album.id}/edit`}
                className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0F1E3D] transition-colors hover:bg-[#FFF9EE]"
              >
                <PencilLine className="size-3.5" />
                Edit album
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-b border-[#0F1E3D]/10 bg-[#FCFAF6] px-6 py-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#0F1E3D]/10 bg-white px-4 py-4 shadow-sm">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Status
            </div>
            <div className="mt-2 text-sm font-semibold text-[#0F1E3D]">
              {isPublished ? "Published" : "Draft"}
            </div>
          </div>

          <div className="rounded-2xl border border-[#0F1E3D]/10 bg-white px-4 py-4 shadow-sm">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Photos
            </div>
            <div className="mt-2 text-sm font-semibold text-[#0F1E3D]">
              {photoCount} total
            </div>
          </div>

          <div className="rounded-2xl border border-[#0F1E3D]/10 bg-white px-4 py-4 shadow-sm">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Event date
            </div>
            <div className="mt-2 text-sm font-semibold text-[#0F1E3D]">
              {formatDate(album.event_date)}
            </div>
          </div>

          <div className="rounded-2xl border border-[#0F1E3D]/10 bg-white px-4 py-4 shadow-sm">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Slug
            </div>
            <div className="mt-2 truncate text-sm font-semibold text-[#0F1E3D]">
              {album.slug}
            </div>
          </div>
        </div>

        <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
          {album.description ? (
            <div className="max-w-3xl rounded-2xl border border-[#0F1E3D]/10 bg-[#FCFAF6] px-5 py-4 text-sm leading-7 text-[#0F1E3D]/72">
              {album.description}
            </div>
          ) : null}

          <div className="rounded-[1.75rem] border border-[#0F1E3D]/10 bg-[#FDFBF6] p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              <ImageIcon className="size-3.5" />
              Photo manager
            </div>
            <AlbumPhotosClient albumId={album.id} photos={photos ?? []} />
          </div>
        </div>
      </section>
    </main>
  )
}
