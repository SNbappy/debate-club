"use client"

import { useMemo, useState, useTransition } from "react"
import {
  adminCreatePost,
  adminDeletePost,
  adminUpdatePost,
} from "@/lib/actions/posts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CldUploadWidget } from "next-cloudinary"
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
  Upload,
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

export function PostsAdminClient({ posts }: { posts: Post[] }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Post | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
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

  function openNew() {
    setEditing(null)
    setCoverUrl(null)
    setOpen(true)
  }

  function openEdit(post: Post) {
    setEditing(post)
    setCoverUrl(post.cover_image_url)
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
      excerpt: (formData.get("excerpt") as string) || undefined,
      content: formData.get("content") as string,
      cover_image_url: coverUrl || undefined,
      type: formData.get("type") as string,
      is_published: formData.get("is_published") === "on",
    }

    startTransition(async () => {
      const result = editing
        ? await adminUpdatePost(editing.id, input)
        : await adminCreatePost(input)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(editing ? "Post updated" : "Post created")
        closeAll()
      }
    })
  }

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

            <Button
              size="sm"
              variant="outline"
              onClick={() => openEdit(post)}
              className="rounded-xl border-[#0F1E3D]/12"
            >
              <Pencil className="mr-1.5 size-4" />
              Edit
            </Button>

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

          <Button
            onClick={openNew}
            className="rounded-xl bg-[#0F1E3D] text-white hover:bg-[#1A2E5A]"
          >
            <Plus className="mr-2 size-4" />
            New post
          </Button>
        </div>
      </section>

      <Dialog
        open={open}
        modal={false}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) closeAll()
        }}
      >
        <DialogContent
          className="max-h-[90vh] max-w-3xl overflow-y-auto border-[#0F1E3D]/10 bg-[#FFFEFC] p-0 shadow-[0_24px_80px_rgba(15,30,61,0.16)]"
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="border-b border-[#0F1E3D]/8 bg-[linear-gradient(180deg,rgba(8,23,49,0.98)_0%,rgba(13,34,68,0.98)_100%)] px-6 py-5 text-white">
            <DialogHeader className="space-y-2 text-left">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F7E9BF]">
                {editing ? "Edit post" : "New post"}
              </div>
              <DialogTitle className="text-xl font-semibold text-white">
                {editing ? "Update post details" : "Create post"}
              </DialogTitle>
              <DialogDescription className="max-w-xl text-sm leading-6 text-white/72">
                Write and organize editorial content for the public website. Markdown is
                supported in the content field.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form
            key={editing?.id ?? "new"}
            action={handleSubmit}
            className="space-y-5 p-6"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="title" className="text-[#0F1E3D]">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  required
                  defaultValue={editing?.title ?? ""}
                  className="h-11 rounded-xl border-[#0F1E3D]/12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-[#0F1E3D]">
                  Slug
                </Label>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={editing?.slug ?? ""}
                  placeholder="auto-generated if left empty"
                  className="h-11 rounded-xl border-[#0F1E3D]/12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-[#0F1E3D]">
                  Type
                </Label>
                <Select name="type" defaultValue={editing?.type ?? "blog"}>
                  <SelectTrigger className="h-11 rounded-xl border-[#0F1E3D]/12 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPE_LABELS).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 sm:col-span-2">
                <Label className="text-[#0F1E3D]">Cover image</Label>

                <div className="rounded-[20px] border border-dashed border-[#0F1E3D]/14 bg-[#F8F8FA] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-medium text-[#0F1E3D]">
                        Upload post cover
                      </div>
                      <p className="mt-1 text-sm text-[#0F1E3D]/55">
                        PNG, JPG, or WebP up to 5MB.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
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
                        {({ open: openWidget }) => (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => openWidget?.()}
                            className="rounded-xl border-[#0F1E3D]/12 bg-white"
                          >
                            <Upload className="mr-2 size-4" />
                            {coverUrl ? "Replace image" : "Upload image"}
                          </Button>
                        )}
                      </CldUploadWidget>

                      {coverUrl && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCoverUrl(null)}
                          className="rounded-xl border-[#0F1E3D]/12 bg-white"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>

                  {coverUrl && (
                    <div className="mt-4 overflow-hidden rounded-[18px] border border-[#0F1E3D]/10 bg-white">
                      <img
                        src={coverUrl}
                        alt="Post cover preview"
                        className="h-44 w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="excerpt" className="text-[#0F1E3D]">
                  Excerpt
                </Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  rows={3}
                  defaultValue={editing?.excerpt ?? ""}
                  placeholder="Short summary shown in listings"
                  className="min-h-[96px] rounded-xl border-[#0F1E3D]/12"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="content" className="text-[#0F1E3D]">
                  Content
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  rows={14}
                  required
                  defaultValue={editing?.content ?? ""}
                  placeholder="# Heading&#10;&#10;Body text..."
                  className="min-h-[260px] rounded-xl border-[#0F1E3D]/12 font-mono text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-3 rounded-2xl border border-[#0F1E3D]/10 bg-[#F8F8FA] px-4 py-3">
                  <input
                    type="checkbox"
                    id="is_published"
                    name="is_published"
                    defaultChecked={editing?.is_published ?? false}
                    className="size-4"
                  />
                  <span className="text-sm text-[#0F1E3D]">
                    Publish this post on the public site
                  </span>
                </label>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:justify-end">
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
                className="rounded-xl bg-[#0F1E3D] text-white hover:bg-[#1A2E5A]"
              >
                {isPending ? "Saving..." : editing ? "Update post" : "Create post"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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