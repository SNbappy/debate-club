import Link from "next/link"
import { Images, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Reveal } from "@/components/home/animations"

type Album = {
  id: string
  title: string
  slug: string
  description: string | null
  cover_image_url: string | null
  event_date: string | null
  created_at: string
  gallery_images?: Array<{ count: number }>
}

function normalizeText(value: string | null | undefined) {
  return value?.trim() || ""
}

function formatAlbumDate(value: string | null | undefined) {
  if (!value) return "Undated"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatAlbumYear(value: string | null | undefined, fallback: string) {
  const candidate = value || fallback
  const date = new Date(candidate)
  if (Number.isNaN(date.getTime())) return ""
  return date.getFullYear().toString()
}

function AlbumCard({
  album,
  count,
  featured = false,
  tilt = "",
  delay = 0,
}: {
  album: Album
  count: number
  featured?: boolean
  tilt?: string
  delay?: number
}) {
  const image = normalizeText(album.cover_image_url)
  const title = normalizeText(album.title) || "Untitled Album"
  const description = normalizeText(album.description)
  const year = formatAlbumYear(album.event_date, album.created_at)

  return (
    <Reveal delay={delay}>
      <Link href={`/gallery/${album.slug}`} className="group block h-full">
        <article
          className={[
            "relative h-full transition-all duration-300",
            featured
              ? "rounded-[1.9rem] border border-[#0F1E3D]/10 bg-white p-4 shadow-[0_24px_64px_rgba(15,30,61,0.10)] md:p-5"
              : `rounded-[1.5rem] border border-[#0F1E3D]/10 bg-[#FFFCF5] p-4 shadow-[0_14px_34px_rgba(15,30,61,0.05)] hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(15,30,61,0.10)] ${tilt}`,
          ].join(" ")}
        >
          <div className={featured ? "grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-end" : ""}>
            <div className="rounded-[1.25rem] bg-[#F7F1E6] p-3 shadow-[inset_0_0_0_1px_rgba(15,30,61,0.06)]">
              <div className="relative overflow-hidden rounded-[0.9rem] bg-[#0F1E3D]">
                <div className={featured ? "aspect-[4/3.2]" : "aspect-[4/5]"}>
                  {image ? (
                    <img
                      src={image}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_25%,rgba(193,154,61,0.16),transparent_18%),linear-gradient(180deg,#132750_0%,#0F1E3D_100%)]">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <Images className="size-10 text-[#C19A3D]" />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/72">
                          JUSTDC Gallery
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,30,61,0.04)_0%,rgba(15,30,61,0.04)_40%,rgba(15,30,61,0.20)_100%)]" />
              </div>
            </div>

            <div className={featured ? "px-1 pb-1 pt-2 lg:pt-0" : "px-1 pt-4"}>
              <div className="mb-3 flex items-center gap-2 text-[#C19A3D]">
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em]">
                  {featured ? "Featured album" : "Album"}
                </span>
                {year ? (
                  <>
                    <span className="h-px w-6 bg-[#C19A3D]/40" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0F1E3D]/44">
                      {year}
                    </span>
                  </>
                ) : null}
              </div>

              <h2 className={[
                "tracking-tight text-[#0F1E3D]",
                featured
                  ? "font-display text-[2.2rem] leading-[0.94] md:text-[2.8rem]"
                  : "font-display text-[1.6rem] leading-[0.95]",
              ].join(" ")}>
                {title}
              </h2>

              <div className="mt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#0F1E3D]/46">
                {count} photo{count !== 1 ? "s" : ""} {album.event_date ? `• ${formatAlbumDate(album.event_date)}` : ""}
              </div>

              {description ? (
                <p className={[
                  "mt-4 text-[#0F1E3D]/68",
                  featured ? "max-w-xl text-[15px] leading-7" : "line-clamp-3 text-sm leading-6",
                ].join(" ")}>
                  {description}
                </p>
              ) : null}

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0F1E3D] transition-all group-hover:gap-3">
                Open album
                <ArrowRight className="size-4 text-[#C19A3D]" />
              </div>
            </div>
          </div>
        </article>
      </Link>
    </Reveal>
  )
}

export default async function GalleryPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("gallery_albums")
    .select("*, gallery_images(count)")
    .eq("is_published", true)
    .order("event_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })

  const albums = (data ?? []) as Album[]
  const featuredAlbum = albums[0] ?? null
  const archiveAlbums = featuredAlbum ? albums.slice(1) : []

  const tilts = [
    "md:rotate-[-1.4deg]",
    "md:translate-y-5 md:rotate-[1.1deg]",
    "md:rotate-[-0.6deg]",
    "md:translate-y-4 md:rotate-[1.6deg]",
    "md:rotate-[0.8deg]",
    "md:translate-y-6 md:rotate-[-1.2deg]",
  ]

  return (
    <main className="bg-white text-[#0F1E3D]">
      <section className="relative overflow-hidden -mt-16 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0B1731_0%,#0F1E3D_58%,#112449_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(255,255,255,0.07),transparent_18%),radial-gradient(circle_at_82%_16%,rgba(193,154,61,0.16),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(8,17,38,0.62),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,30,61,0.94)_0%,rgba(15,30,61,0.78)_34%,rgba(15,30,61,0.44)_60%,rgba(15,30,61,0.76)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#081126]/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FDF8EE] via-[#FDF8EE]/42 to-transparent" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-28 pb-14 sm:pt-32 md:pt-36 md:pb-16">
          <div>
            <div className="max-w-4xl">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/90 backdrop-blur-md md:text-xs">
                  {/* <Sparkles className="size-3 text-[#C19A3D]" /> */}
                  JUSTDC gallery
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <h1 className="mt-6 font-display text-[3.15rem] leading-[0.84] tracking-[-0.045em] text-white sm:text-[4rem] md:text-[4.9rem] lg:text-[5.2rem]">
                  Moments,
                  <br />
                  memories, and the
                  <br />
                  visual archive of the <span className="italic text-[#C19A3D]">club</span>.
                </h1>
              </Reveal>
              <Reveal delay={0.24}>
                <p className="mt-6 max-w-2xl text-[1rem] leading-[1.8] text-white/82 md:text-[1.05rem]">
                  A curated record of tournaments, workshops, ceremonies, and everyday scenes from the public life of JUST Debate Club.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {featuredAlbum ? (
        <section className="relative overflow-hidden bg-[#FDF8EE] py-16 sm:py-20 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(193,154,61,0.10),transparent_24%),radial-gradient(circle_at_86%_20%,rgba(15,30,61,0.06),transparent_20%)]" />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="mb-10 max-w-2xl">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                  Featured album
                </div>
                <h2 className="font-display text-[1.9rem] leading-[0.96] tracking-tight text-[#0F1E3D] sm:text-4xl md:text-5xl">
                  A highlighted memory from the archive.
                </h2>
              </div>
            </Reveal>

            <AlbumCard
              album={featuredAlbum}
              count={featuredAlbum.gallery_images?.[0]?.count ?? 0}
              featured
            />
          </div>
        </section>
      ) : null}

      {archiveAlbums.length > 0 ? (
        <section className="relative overflow-hidden bg-[#F7F1E6] py-16 sm:py-20 md:py-24">
          <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(15,30,61,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,30,61,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="mb-12 grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
                <div className="max-w-xl">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                    Archive wall
                  </div>
                  <h2 className="font-display text-[1.9rem] leading-[0.96] tracking-tight text-[#0F1E3D] sm:text-4xl md:text-5xl">
                    Albums arranged like printed memory cards.
                  </h2>
                </div>
                <p className="max-w-2xl text-base leading-8 text-[#0F1E3D]/68 lg:justify-self-end">
                  Inspired by archival gallery layouts, but translated into the JUSTDC visual language with cream surfaces, serif titling, and restrained editorial structure.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {archiveAlbums.map((album, index) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  count={album.gallery_images?.[0]?.count ?? 0}
                  tilt={tilts[index % tilts.length]}
                  delay={0.04 + index * 0.03}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {albums.length === 0 ? (
        <section className="relative overflow-hidden bg-[#FDF8EE] py-16 sm:py-20 md:py-24">
          <div className="relative mx-auto max-w-4xl px-6">
            <Reveal>
              <div className="rounded-[1.6rem] border border-[#0F1E3D]/10 bg-white p-10 text-center shadow-[0_18px_44px_rgba(15,30,61,0.06)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
                  Gallery
                </div>
                <h2 className="mt-3 font-display text-[2rem] leading-none text-[#0F1E3D]">
                  No albums yet
                </h2>
                <p className="mt-4 text-sm leading-7 text-[#0F1E3D]/66">
                  Published albums from debates, workshops, and club activities will appear here once available.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}
    </main>
  )
}