import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Reveal } from "@/components/home/animations"
import ReactMarkdown from "react-markdown"
import type { Post as DbPost, Profile } from "@/types/supabase"

type PostWithProfile = DbPost & {
  profiles: Pick<Profile, "full_name" | "slug"> | null
}

const TYPE_LABELS: Record<string, string> = {
  news: "News",
  blog: "Blog",
  tournament_writeup: "Tournament Writeup",
  announcement: "Announcement",
}

function normalizeText(value: string | null | undefined) {
  return value?.trim() || ""
}

function formatFullDate(value: string | null | undefined) {
  if (!value) return ""
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from("posts")
    .select("*, profiles!author_id(full_name, slug)")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle()

  if (!post) notFound()

  const postData = post as PostWithProfile
  const author = postData.profiles
  const image = normalizeText(post.cover_image_url)
  const title = normalizeText(post.title) || "Untitled Post"
  const typeLabel = TYPE_LABELS[post.type] ?? post.type

  return (
    <main className="bg-white text-[#0F1E3D]">
      <section className="relative overflow-hidden -mt-16 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0B1731_0%,#0F1E3D_58%,#112449_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(255,255,255,0.07),transparent_18%),radial-gradient(circle_at_82%_16%,rgba(193,154,61,0.16),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(8,17,38,0.62),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,30,61,0.94)_0%,rgba(15,30,61,0.78)_34%,rgba(15,30,61,0.44)_60%,rgba(15,30,61,0.76)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#081126]/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FDF8EE] via-[#FDF8EE]/42 to-transparent" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-28 pb-14 sm:pt-32 md:pt-36 md:pb-16">
          <Reveal>
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/86 transition-all duration-300 hover:border-white/22 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="size-4" />
              All posts
            </Link>
          </Reveal>

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-end lg:gap-14">
            {image ? (
              <Reveal delay={0.08}>
                <div className="relative max-w-[30rem]">
                  <div className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[#132750] shadow-[0_32px_80px_rgba(0,0,0,0.28)]">
                    <div className="aspect-[4/3.6]">
                      <img
                        src={image}
                        alt={title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,30,61,0.02)_0%,rgba(15,30,61,0.10)_42%,rgba(15,30,61,0.42)_100%)]" />
                  </div>
                  <div className="absolute -bottom-5 left-5 rounded-[1.35rem] bg-[#C19A3D] px-5 py-4 text-black shadow-2xl">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                      {typeLabel}
                    </div>
                  </div>
                </div>
              </Reveal>
            ) : null}

            <div className={image ? "max-w-3xl" : "max-w-4xl lg:col-span-2"}>
              <Reveal delay={0.12}>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/90 backdrop-blur-md md:text-xs">
                  <Sparkles className="size-3 text-[#C19A3D]" />
                  {typeLabel}
                </div>
              </Reveal>

              <Reveal delay={0.18}>
                <h1 className="mt-6 font-display text-[3.2rem] leading-[0.88] tracking-[-0.04em] text-white sm:text-[4rem] md:text-[4.8rem] lg:text-[5.05rem]">
                  {title}
                </h1>
              </Reveal>

              <Reveal delay={0.26}>
                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/72">
                  {author?.full_name ? (
                    author.slug ? (
                      <Link
                        href={`/members/${author.slug}`}
                        className="font-semibold text-white/90 transition-colors hover:text-[#C19A3D]"
                      >
                        By {author.full_name}
                      </Link>
                    ) : (
                      <span className="font-semibold text-white/90">By {author.full_name}</span>
                    )
                  ) : null}
                  {author?.full_name && post.published_at ? (
                    <span className="text-white/30">·</span>
                  ) : null}
                  {post.published_at ? (
                    <span>{formatFullDate(post.published_at)}</span>
                  ) : null}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#FDF8EE] py-16 sm:py-20 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(193,154,61,0.08),transparent_24%),radial-gradient(circle_at_86%_20%,rgba(15,30,61,0.05),transparent_20%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-[0.28fr_0.72fr] lg:gap-16 xl:grid-cols-[0.24fr_0.76fr]">
            <Reveal>
              <aside className="space-y-6">
                <div>
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">Type</div>
                  <div className="text-sm font-medium text-[#0F1E3D]">{typeLabel}</div>
                </div>
                {author?.full_name ? (
                  <div>
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">Author</div>
                    {author.slug ? (
                      <Link
                        href={`/members/${author.slug}`}
                        className="text-sm font-medium text-[#0F1E3D] transition-colors hover:text-[#C19A3D]"
                      >
                        {author.full_name}
                      </Link>
                    ) : (
                      <div className="text-sm font-medium text-[#0F1E3D]">{author.full_name}</div>
                    )}
                  </div>
                ) : null}
                {post.published_at ? (
                  <div>
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">Published</div>
                    <div className="text-sm font-medium text-[#0F1E3D]">{formatFullDate(post.published_at)}</div>
                  </div>
                ) : null}
                <div className="pt-2">
                  <Link
                    href="/posts"
                    className="inline-flex items-center gap-2 rounded-full border border-[#C19A3D]/40 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0F1E3D] transition-all hover:border-[#C19A3D] hover:bg-[#fffaf0]"
                  >
                    <ArrowLeft className="size-3" />
                    All posts
                  </Link>
                </div>
              </aside>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-[1.6rem] border border-[#0F1E3D]/10 bg-white p-6 shadow-[0_16px_40px_rgba(15,30,61,0.06)] sm:p-8 md:p-10">
                <div className="prose prose-lg max-w-none
                  prose-headings:font-display prose-headings:text-[#0F1E3D] prose-headings:tracking-tight
                  prose-h1:text-[2.2rem] prose-h1:leading-[0.96]
                  prose-h2:text-[1.8rem] prose-h2:leading-[1.0]
                  prose-h3:text-[1.4rem] prose-h3:leading-[1.1]
                  prose-p:text-[#0F1E3D]/82 prose-p:leading-[1.9] prose-p:text-[1rem]
                  prose-a:text-[#C19A3D] prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-[#0F1E3D] prose-strong:font-semibold
                  prose-blockquote:border-l-[#C19A3D] prose-blockquote:text-[#0F1E3D]/68
                  prose-ul:text-[#0F1E3D]/82 prose-ol:text-[#0F1E3D]/82
                  prose-code:text-[#0F1E3D] prose-code:bg-[#0F1E3D]/6 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5
                  prose-img:rounded-[1rem] prose-img:shadow-[0_12px_32px_rgba(15,30,61,0.10)]">
                  <ReactMarkdown
                    components={{
                      img: ({ src, alt }) => (
                        <img
                          src={src as string}
                          alt={alt}
                          className="max-w-full rounded-[1rem] shadow-[0_12px_32px_rgba(15,30,61,0.10)]"
                        />
                      ),
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
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
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle()
  if (!post) return { title: "Post not found" }
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  }
}