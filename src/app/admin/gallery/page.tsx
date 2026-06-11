import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { GalleryAdminClient } from "./gallery-admin-client"
import { Sparkles, ArrowUpRight } from "lucide-react"

export default async function AdminGalleryPage() {
  const supabase = await createClient()
  const { data: albums } = await supabase
    .from("gallery_albums")
    .select("*, gallery_images(count)")
    .order("event_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })

  const totalAlbums = albums?.length ?? 0
  const publishedAlbums = (albums ?? []).filter((album: any) => album.is_published).length
  const totalPhotos = (albums ?? []).reduce((sum: number, album: any) => {
    const count = album.gallery_images?.[0]?.count ?? 0
    return sum + count
  }, 0)

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-[#0F1E3D]/10 bg-white shadow-[0_20px_60px_rgba(15,30,61,0.08)]">
        <div className="relative overflow-hidden bg-[#0F1E3D] px-6 py-8 text-white sm:px-8 sm:py-9">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,30,61,0.98),rgba(15,30,61,0.92))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(193,154,61,0.16),transparent_20%),radial-gradient(circle_at_82%_12%,rgba(255,255,255,0.08),transparent_18%)]" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/86 backdrop-blur-md">
                <Sparkles className="size-3.5 text-[#C19A3D]" />
                Gallery administration
              </div>

              <h1 className="mt-5 font-display text-[2.6rem] leading-[0.92] tracking-[-0.04em] text-white sm:text-[3.4rem] lg:text-[4rem]">
                Albums, covers, and event archives
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/74 sm:text-[0.98rem]">
                Manage the public photo archive with a compact editorial workflow. Album creation and curation stay focused here, while the public gallery carries the richer presentation.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/gallery"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md transition-colors hover:bg-white/12"
              >
                <ArrowUpRight className="size-3.5" />
                View public gallery
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-b border-[#0F1E3D]/10 bg-[#FCFAF6] px-6 py-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#0F1E3D]/10 bg-white px-4 py-4 shadow-sm">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Total albums
            </div>
            <div className="mt-2 text-sm font-semibold text-[#0F1E3D]">
              {totalAlbums}
            </div>
          </div>

          <div className="rounded-2xl border border-[#0F1E3D]/10 bg-white px-4 py-4 shadow-sm">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Published
            </div>
            <div className="mt-2 text-sm font-semibold text-[#0F1E3D]">
              {publishedAlbums}
            </div>
          </div>

          <div className="rounded-2xl border border-[#0F1E3D]/10 bg-white px-4 py-4 shadow-sm">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Photos
            </div>
            <div className="mt-2 text-sm font-semibold text-[#0F1E3D]">
              {totalPhotos}
            </div>
          </div>

          <div className="rounded-2xl border border-[#0F1E3D]/10 bg-white px-4 py-4 shadow-sm">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Workflow
            </div>
            <div className="mt-2 text-sm font-semibold text-[#0F1E3D]">
              Create → curate → publish
            </div>
          </div>
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          <GalleryAdminClient albums={(albums as any) ?? []} />
        </div>
      </section>
    </main>
  )
}
