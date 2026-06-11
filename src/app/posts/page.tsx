import Link from "next/link"
import { Sparkles, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Reveal } from "@/components/home/animations"

const TYPE_LABELS: Record<string, string> = {
  news: "News",
  blog: "Blog",
  tournament_writeup: "Tournament Writeup",
  announcement: "Announcement",
}

const TYPE_FILTERS = [
  { value: "", label: "All posts" },
  { value: "news", label: "News" },
  { value: "blog", label: "Blog" },
  { value: "tournament_writeup", label: "Tournaments" },
  { value: "announcement", label: "Announcements" },
]

function normalizeText(value: string | null | undefined) {
  return value?.trim() || ""
}

function formatDate(value: string | null | undefined) {
  if (!value) return ""
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image_url: string | null
  type: string
  published_at: string | null
  profiles: { full_name: string | null; slug: string | null } | null
}

function PostCard({
  post,
  featured = false,
  delay = 0,
}: {
  post: Post
  featured?: boolean
  delay?: number
}) {
  const image = normalizeText(post.cover_image_url)
  const title = normalizeText(post.title) || "Untitled Post"
  const excerpt = normalizeText(post.excerpt)
  const author = (post as any).profiles
  const typeLabel = TYPE_LABELS[post.type] ?? post.type

  return (
    <Reveal delay={delay}>
      <Link href={`/posts/${post.slug}`} className="group block h-full">
        <article
          className={[
            "h-full overflow-hidden border transition-all duration-300",
            featured
              ? "rounded-[1.9rem] border-white/10 bg-[#132750] text-white shadow-[0_32px_80px_rgba(0,0,0,0.28)]"
              : "rounded-[1.55rem] border-[#0F1E3D]/10 bg-white shadow-[0_14px_38px_rgba(15,30,61,0.06)] hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(15,30,61,0.10)]",
          ].join(" ")}
        >
          <div className={featured ? "grid h-full lg:grid-cols-[1.05fr_0.95fr]" : ""}>
            <div className="relative overflow-hidden bg-[#0F1E3D]">
              <div className={featured ? "aspect-[4/3.4] h-full lg:aspect-auto" : "aspect-[4/2.6]"}>
                {image ? (
                  <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_24%_20%,rgba(193,154,61,0.22),transparent_18%),linear-gradient(180deg,#132750_0%,#0F1E3D_100%)]">
                    <div className="rounded-full border border-[#C19A3D]/35 bg-white/8 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F5E7BF] backdrop-blur-sm">
                      JUSTDC Post
                    </div>
                  </div>
                )}
              </div>
              <div className={[
                "absolute inset-0",
                featured
                  ? "bg-[linear-gradient(180deg,rgba(15,30,61,0.12)_0%,rgba(15,30,61,0.14)_38%,rgba(15,30,61,0.72)_100%)]"
                  : "bg-gradient-to-t from-[#0F1E3D]/18 via-transparent to-transparent",
              ].join(" ")} />
              <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-[#0F1E3D]/72 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C19A3D] backdrop-blur-md">
                {typeLabel}
              </div>
            </div>

            <div className={featured ? "flex flex-col justify-between p-6 md:p-8" : "p-5"}>
              <div>
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
                  {featured ? "Featured post" : typeLabel}
                </div>
                <h3 className={[
                  "tracking-tight",
                  featured
                    ? "font-display text-[2.2rem] leading-[0.94] text-white md:text-[2.7rem]"
                    : "font-display text-[1.75rem] leading-[0.95] text-[#0F1E3D]",
                ].join(" ")}>
                  {title}
                </h3>
                {excerpt ? (
                  <p className={[
                    "mt-4 line-clamp-3 text-[15px] leading-7",
                    featured ? "text-white/80" : "text-[#0F1E3D]/70",
                  ].join(" ")}>
                    {excerpt}
                  </p>
                ) : null}
                <div className={[
                  "mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs",
                  featured ? "text-white/58" : "text-[#0F1E3D]/50",
                ].join(" ")}>
                  {author?.full_name ? (
                    <span>By {author.full_name}</span>
                  ) : null}
                  {author?.full_name && post.published_at ? (
                    <span className="opacity-40">·</span>
                  ) : null}
                  {post.published_at ? (
                    <span>{formatDate(post.published_at)}</span>
                  ) : null}
                </div>
              </div>
              <div className={[
                "mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3",
                featured ? "text-white" : "text-[#0F1E3D]",
              ].join(" ")}>
                Read post
                <ArrowRight className="size-4 text-[#C19A3D]" />
              </div>
            </div>
          </div>
        </article>
      </Link>
    </Reveal>
  )
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const sp = await searchParams
  const type = sp.type ?? ""

  const supabase = await createClient()
  let query = supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image_url, type, published_at, profiles!author_id(full_name, slug)")
    .eq("is_published", true)
  if (type) query = query.eq("type", type as "news" | "blog" | "tournament_writeup" | "announcement")
  const { data: posts } = await query.order("published_at", { ascending: false })

  const allPosts = posts ?? []
  const featuredPost = type === "" ? (allPosts[0] ?? null) : null
  const remainingPosts = featuredPost ? allPosts.slice(1) : allPosts

  const typeCounts = {
    total: allPosts.length,
  }

  return (
    <main className="bg-white text-[#0F1E3D]">
      <section className="relative overflow-hidden -mt-16 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0B1731_0%,#0F1E3D_58%,#112449_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(255,255,255,0.07),transparent_18%),radial-gradient(circle_at_82%_16%,rgba(193,154,61,0.16),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(8,17,38,0.62),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,30,61,0.94)_0%,rgba(15,30,61,0.78)_34%,rgba(15,30,61,0.44)_60%,rgba(15,30,61,0.76)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#081126]/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FDF8EE] via-[#FDF8EE]/42 to-transparent" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-28 pb-14 sm:pt-32 md:pt-36 md:pb-16">
          <div className="grid gap-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-end">
            <div className="max-w-4xl">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/90 backdrop-blur-md md:text-xs">
                  {/* <Sparkles className="size-3 text-[#C19A3D]" /> */}
                  JUSTDC posts
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <h1 className="mt-6 font-display text-[3.15rem] leading-[0.84] tracking-[-0.045em] text-white sm:text-[4rem] md:text-[4.9rem] lg:text-[5.2rem]">
                  News, stories,
                  <br />
                  and the voice of
                  <br />
                  the <span className="italic text-[#C19A3D]">club</span>.
                </h1>
              </Reveal>
              <Reveal delay={0.24}>
                <p className="mt-6 max-w-2xl text-[1rem] leading-[1.8] text-white/82 md:text-[1.05rem]">
                  Tournament writeups, announcements, club news, and editorial pieces written by members of JUST Debate Club.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.4}>
              <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end xl:flex-row xl:items-start">
                {TYPE_FILTERS.map((f) => {
                  const href = f.value ? `/posts?type=${f.value}` : "/posts"
                  const active = type === f.value
                  return (
                    <Link key={f.value} href={href} scroll={false}>
                      <span className={[
                        "inline-flex items-center rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-200",
                        active
                          ? "bg-[#C19A3D] text-black shadow-lg"
                          : "border border-white/14 bg-white/8 text-white/80 hover:border-white/28 hover:bg-white/14 hover:text-white",
                      ].join(" ")}>
                        {f.label}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {featuredPost ? (
        <section className="relative overflow-hidden bg-[#FDF8EE] py-16 sm:py-20 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(193,154,61,0.10),transparent_24%),radial-gradient(circle_at_86%_20%,rgba(15,30,61,0.06),transparent_20%)]" />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="mb-10 max-w-2xl">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                  Latest post
                </div>
                <h2 className="font-display text-[1.9rem] leading-[0.96] tracking-tight text-[#0F1E3D] sm:text-4xl md:text-5xl">
                  Most recent from the club.
                </h2>
              </div>
            </Reveal>
            <PostCard post={featuredPost} featured />
          </div>
        </section>
      ) : null}

      {remainingPosts.length > 0 ? (
        <section className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(193,154,61,0.07),transparent_20%),radial-gradient(circle_at_84%_80%,rgba(15,30,61,0.05),transparent_22%)]" />
          <div className="relative mx-auto max-w-6xl px-6">
            {remainingPosts.length > 0 && (
              <Reveal>
                <div className="mb-10 grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
                  <div className="max-w-xl">
                    <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                      {type ? TYPE_LABELS[type] ?? "Posts" : "All posts"}
                    </div>
                    <h2 className="font-display text-[1.9rem] leading-[0.96] tracking-tight text-[#0F1E3D] sm:text-4xl md:text-5xl">
                      {type ? `${TYPE_LABELS[type] ?? "Posts"} from the club.` : "More from the club."}
                    </h2>
                  </div>
                  <p className="max-w-2xl text-base leading-8 text-[#0F1E3D]/68 lg:justify-self-end">
                    {type
                      ? `Browsing ${(TYPE_LABELS[type] ?? "").toLowerCase()} posts published by JUST Debate Club members.`
                      : "Browse news, blogs, tournament writeups, and announcements from the JUSTDC community."}
                  </p>
                </div>
              </Reveal>
            )}
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {remainingPosts.map((post, index) => (
                <PostCard key={post.id} post={post as Post} delay={0.04 + index * 0.03} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {type !== "" && allPosts.length > 0 ? (
        <section className="relative overflow-hidden bg-[#FDF8EE] py-16 sm:py-20 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(193,154,61,0.10),transparent_24%)]" />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="mb-10 max-w-2xl">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                  {TYPE_LABELS[type] ?? "Posts"}
                </div>
                <h2 className="font-display text-[1.9rem] leading-[0.96] tracking-tight text-[#0F1E3D] sm:text-4xl md:text-5xl">
                  {TYPE_LABELS[type] ?? "Posts"} from the club.
                </h2>
              </div>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {allPosts.map((post, index) => (
                <PostCard key={post.id} post={post as Post} delay={0.03 + index * 0.02} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {allPosts.length === 0 ? (
        <section className="relative overflow-hidden bg-[#FDF8EE] py-16 sm:py-20 md:py-24">
          <div className="relative mx-auto max-w-4xl px-6">
            <Reveal>
              <div className="rounded-[1.6rem] border border-[#0F1E3D]/10 bg-white p-10 text-center shadow-[0_18px_44px_rgba(15,30,61,0.06)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">Posts</div>
                <h2 className="mt-3 font-display text-[2rem] leading-none text-[#0F1E3D]">No posts yet</h2>
                <p className="mt-4 text-sm leading-7 text-[#0F1E3D]/66">
                  News, blogs, tournament writeups, and announcements will appear here once published.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}
    </main>
  )
}