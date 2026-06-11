import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Images, Sparkles } from "lucide-react"

import { Reveal } from "@/components/home/animations"
import { PublicAlbumViewer } from "@/components/gallery/public-album-viewer"
import { createClient } from "@/lib/supabase/server"

type Photo = {
  id: string
  image_url: string
  caption: string | null
  order_index: number | null
}

function formatAlbumDate(value: string | null | undefined) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default async function PublicAlbumPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ photo?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams
  const photoParam = sp.photo ?? ""

  const supabase = await createClient()

  const { data: album } = await supabase
    .from("gallery_albums")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle()

  if (!album) notFound()

  const { data } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("album_id", album.id)
    .order("order_index")

  const photos = (data ?? []) as Photo[]

  return (
    <main className="bg-[#FDF8EE] text-[#0F1E3D]">
      <section className="relative overflow-hidden -mt-16 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0B1731_0%,#0F1E3D_62%,#112449_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(255,255,255,0.06),transparent_18%),radial-gradient(circle_at_82%_16%,rgba(193,154,61,0.14),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(8,17,38,0.58),transparent_35%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FDF8EE] via-[#FDF8EE]/50 to-transparent" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-12 pt-28 sm:pt-32 md:pb-14 md:pt-36">
          <Reveal>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/86 transition-all duration-300 hover:border-white/22 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="size-4" />
              All albums
            </Link>
          </Reveal>

          <div className="mt-8">
            <Reveal delay={0.08}>
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/90 backdrop-blur-md md:text-xs">
                  <Sparkles className="size-3 text-[#C19A3D]" />
                  Gallery album
                </div>

                <h1 className="mt-6 font-display text-[3rem] leading-[0.9] tracking-[-0.04em] text-white sm:text-[3.8rem] md:text-[4.5rem] lg:text-[4.9rem]">
                  {album.title}
                </h1>

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/72">
                  <span>{photos.length} photo{photos.length !== 1 ? "s" : ""}</span>
                  {album.event_date ? <span className="text-white/30">•</span> : null}
                  {album.event_date ? <span>{formatAlbumDate(album.event_date)}</span> : null}
                </div>

                {album.description ? (
                  <p className="mt-5 max-w-2xl text-[0.98rem] leading-[1.8] text-white/80 md:text-[1.02rem]">
                    {album.description}
                  </p>
                ) : null}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {photos.length > 0 ? (
        <PublicAlbumViewer
          albumSlug={album.slug}
          albumTitle={album.title}
          photos={photos}
          initialPhotoId={photoParam}
        />
      ) : (
        <section className="relative overflow-hidden bg-[#FDF8EE] py-16 sm:py-20 md:py-24">
          <div className="relative mx-auto max-w-4xl px-6">
            <Reveal>
              <div className="rounded-[1.6rem] border border-[#0F1E3D]/10 bg-white p-10 text-center shadow-[0_18px_44px_rgba(15,30,61,0.06)]">
                <Images className="mx-auto size-10 text-[#C19A3D]" />
                <h2 className="mt-4 font-display text-[2rem] leading-none text-[#0F1E3D]">
                  No photos in this album yet
                </h2>
                <p className="mt-4 text-sm leading-7 text-[#0F1E3D]/66">
                  This album is published, but no gallery images are currently available inside it.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </main>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: album } = await supabase
    .from("gallery_albums")
    .select("title, description")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle()

  if (!album) return { title: "Album not found" }

  return {
    title: album.title,
    description: album.description ?? undefined,
  }
}
