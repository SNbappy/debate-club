"use client"

import { useMemo, useTransition } from "react"
import { adminDeletePost } from "@/lib/actions/posts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"
import {
  Check,
  ExternalLink,
  FileText,
  Newspaper,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react"

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image_url: string | null
  type: string
  is_published: boolean
  published_at: string | null
  created_at: string
}

const TYPE_LABELS: Record<string, string> = {
  news: "News",
  blog: "Blog",
  tournament_writeup: "Tournament Writeup",
  announcement: "Announcement",
}

function formatPostDate(value: string | null) {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function PostsAdminClient({
  posts,
  basePath,
}: {
  posts: Post[]
  basePath: string
}) {
  const [isPending, startTransition] = useTransition()

  const sortedPosts = useMemo(
    () =>
      [...posts].sort((a, b) => {
        const aTime = new Date(a.published_at ?? a.created_at).getTime()
        const bTime = new Date(b.published_at ?? b.created_at).getTime()
        return bTime - aTime
      }),
    [posts]
  )

  const publishedPosts = useMemo(
    () => sortedPosts.filter((post) => post.is_published),
    [sortedPosts]
  )

  const draftPosts = useMemo(
    () => sortedPosts.filter((post) => !post.is_published),
    [sortedPosts]
  )

  function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return

    startTransition(async () => {
      const result = await adminDeletePost(id)
      if (result?.error) toast.error(result.error)
      else toast.success("Post deleted")
    })
  }

  function PostCard({
    post,
    urgent = false,
  }: {
    post: Post
    urgent?: boolean
  }) {
    const dateLabel = formatPostDate(post.published_at ?? post.created_at)

    return (
      <div
        className={`rounded-[22px] border p-5 transition-shadow hover:shadow-[0_14px_35px_rgba(15,30,61,0.08)] ${
          urgent
            ? "border-amber-200 bg-amber-50/50"
            : "border-[#0F1E3D]/8 bg-white"
        }`}
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[1rem] font-semibold text-[#0F1E3D]">
                {post.title}
              </h3>

              <Badge
                variant="outline"
                className="rounded-full border-[#0F1E3D]/12 bg-[#F8F8FA] text-[#0F1E3D]"
              >
                {TYPE_LABELS[post.type] ?? post.type}
              </Badge>

              {post.is_published ? (
                <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  Published
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="rounded-full border-amber-300 bg-amber-50 text-amber-700"
                >
                  Draft
                </Badge>
              )}
            </div>

            <div className="mt-2 text-sm text-[#0F1E3D]/45">/posts/{post.slug}</div>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#0F1E3D]/60">
              {dateLabel && <span>{dateLabel}</span>}
              {post.cover_image_url && <span>· Cover uploaded</span>}
            </div>

            {post.excerpt && (
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#0F1E3D]/65">
                {post.excerpt}
              </p>
            )}

            {!post.excerpt && (
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#0F1E3D]/50">
                {post.content}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 xl:justify-end">
            {post.is_published && (
              <Link href={`/posts/${post.slug}`} target="_blank">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-[#0F1E3D]/12"
                >
                  <ExternalLink className="mr-1.5 size-4" />
                  View
                </Button>
              </Link>
            )}

            <Link href={`${basePath}/${post.id}/edit`}>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl border-[#0F1E3D]/12"
              >
                <Pencil className="mr-1.5 size-4" />
                Edit
              </Button>
            </Link>

            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => handleDelete(post.id)}
              className="rounded-xl border-[#0F1E3D]/12"
            >
              <Trash2 className="mr-1.5 size-4" />
              Delete
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
              Editorial management
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#0F1E3D]">
                Posts
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#0F1E3D]/62">
                Manage announcements, news, blog content, and tournament writeups in one
                consistent editorial workspace.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
            <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-[#F8F8FA] px-4 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/45">
                Total posts
              </div>
              <div className="mt-2 text-2xl font-semibold text-[#0F1E3D]">
                {posts.length}
              </div>
            </div>

            <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-[#F8F8FA] px-4 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/45">
                Published
              </div>
              <div className="mt-2 text-2xl font-semibold text-[#0F1E3D]">
                {publishedPosts.length}
              </div>
            </div>

            <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-[#F8F8FA] px-4 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/45">
                Drafts
              </div>
              <div className="mt-2 text-2xl font-semibold text-[#0F1E3D]">
                {draftPosts.length}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[#0F1E3D]/8 bg-[#FCFCFD] px-4 py-4">
          <div>
            <div className="text-sm font-medium text-[#0F1E3D]">
              Create or update content
            </div>
            <p className="mt-1 text-sm text-[#0F1E3D]/58">
              Draft editorial content, attach cover images, and publish when ready.
            </p>
          </div>

          <Link href={`${basePath}/new`}>
            <Button className="rounded-xl bg-[#0F1E3D] text-white hover:bg-[#1A2E5A]">
              <Plus className="mr-2 size-4" />
              New post
            </Button>
          </Link>
        </div>
      </section>

      {posts.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-[#0F1E3D]/15 bg-white p-10 text-center">
          <FileText className="mx-auto mb-4 size-10 text-[#0F1E3D]/20" />
          <p className="text-sm font-medium text-[#0F1E3D]/55">
            No posts have been added yet.
          </p>
          <p className="mt-2 text-sm text-[#0F1E3D]/45">
            Create the first post to start publishing club updates and stories.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {draftPosts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Newspaper className="size-4 text-[#C19A3D]" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/55">
                  Draft posts
                </h3>
              </div>

              <div className="space-y-3">
                {draftPosts.map((post) => (
                  <PostCard key={post.id} post={post} urgent />
                ))}
              </div>
            </div>
          )}

          {publishedPosts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Check className="size-4 text-[#C19A3D]" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/55">
                  Published posts
                </h3>
              </div>

              <div className="space-y-3">
                {publishedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}