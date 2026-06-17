"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { adminCreatePost, adminUpdatePost } from "@/lib/actions/posts"
import { Button } from "@/components/ui/button"
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
import { CldUploadWidget } from "next-cloudinary"
import { toast } from "sonner"
import { Upload } from "lucide-react"
import { cloudinaryUploadWidgetStyles } from "@/lib/cloudinary"

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image_url: string | null
  type: string
  is_published: boolean
}

const TYPE_LABELS: Record<string, string> = {
  news: "News",
  blog: "Blog",
  tournament_writeup: "Tournament Writeup",
  announcement: "Announcement",
}

interface PostEditorProps {
  post?: Post
  basePath: string
}

export function PostEditor({ post, basePath }: PostEditorProps) {
  const router = useRouter()
  const [coverUrl, setCoverUrl] = useState<string | null>(post?.cover_image_url ?? null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    const input = {
      title: formData.get("title") as string,
      slug: (formData.get("slug") as string) || undefined,
      excerpt: (formData.get("excerpt") as string) || undefined,
      content: formData.get("content") as string,
      cover_image_url: coverUrl || undefined,
      type: formData.get("type") as "news" | "blog" | "tournament_writeup" | "announcement",
      is_published: formData.get("is_published") === "on",
    }

    startTransition(async () => {
      const result = post
        ? await adminUpdatePost(post.id, input)
        : await adminCreatePost(input)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(post ? "Post updated" : "Post created")
        router.push(basePath)
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-3 sm:col-span-2">
          <Label htmlFor="title" className="text-sm font-semibold text-[#0F1E3D]">
            Title
          </Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={post?.title ?? ""}
            className="h-12 rounded-xl border-[#0F1E3D]/12 bg-[#FCFCFD] px-4 text-[15px] shadow-sm transition-colors focus:bg-white"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="slug" className="text-sm font-semibold text-[#0F1E3D]">
            Slug
          </Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={post?.slug ?? ""}
            placeholder="auto-generated if left empty"
            className="h-12 rounded-xl border-[#0F1E3D]/12 bg-[#FCFCFD] px-4 text-[15px] shadow-sm transition-colors focus:bg-white"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="type" className="text-sm font-semibold text-[#0F1E3D]">
            Type
          </Label>
          <Select name="type" defaultValue={post?.type ?? "blog"}>
            <SelectTrigger className="h-12 rounded-xl border-[#0F1E3D]/12 bg-[#FCFCFD] px-4 text-[15px] shadow-sm transition-colors focus:bg-white">
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

        <div className="space-y-4 sm:col-span-2">
          <Label className="text-sm font-semibold text-[#0F1E3D]">Cover image</Label>

          <div className="rounded-[24px] border border-dashed border-[#0F1E3D]/15 bg-[#F8F8FA] p-6 transition-colors hover:border-[#0F1E3D]/30">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-medium text-[#0F1E3D]">Upload post cover</div>
                <p className="mt-1 text-sm text-[#0F1E3D]/60">
                  PNG, JPG, or WebP up to 5MB. A high-quality cover is recommended.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  options={{
                    maxFiles: 1,
                    clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
                    maxFileSize: 5000000,
                    singleUploadAutoClose: false,
                    styles: cloudinaryUploadWidgetStyles,
                  }}
                  onSuccess={(result) => {
                    const info = result.info
                    if (
                      info &&
                      typeof info === "object" &&
                      "secure_url" in info &&
                      typeof info.secure_url === "string"
                    ) {
                      const btn = document.getElementById("post-cloudinary-upload-btn");
                      if (btn) btn.dataset.uploadedUrl = info.secure_url;
                    }
                  }}
                  onClose={() => {
                    const btn = document.getElementById("post-cloudinary-upload-btn");
                    if (btn && btn.dataset.uploadedUrl) {
                      setCoverUrl(btn.dataset.uploadedUrl);
                      btn.dataset.uploadedUrl = "";
                    }
                  }}
                >
                  {({ open: openWidget }) => (
                    <Button
                      id="post-cloudinary-upload-btn"
                      type="button"
                      variant="outline"
                      onClick={() => openWidget?.()}
                      className="h-11 rounded-xl border-[#0F1E3D]/12 bg-white px-5 shadow-sm"
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
                    className="h-11 rounded-xl border-red-200 bg-red-50 px-5 text-red-600 hover:bg-red-100 hover:text-red-700 shadow-sm"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>

            {coverUrl && (
              <div className="mt-6 overflow-hidden rounded-[20px] border border-[#0F1E3D]/10 bg-white shadow-sm">
                <img
                  src={coverUrl}
                  alt="Post cover preview"
                  className="h-64 w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 sm:col-span-2">
          <Label htmlFor="excerpt" className="text-sm font-semibold text-[#0F1E3D]">
            Excerpt
          </Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            defaultValue={post?.excerpt ?? ""}
            placeholder="A short summary to hook readers in the listings..."
            className="min-h-[100px] rounded-xl border-[#0F1E3D]/12 bg-[#FCFCFD] p-4 text-[15px] shadow-sm transition-colors focus:bg-white leading-relaxed"
          />
        </div>

        <div className="space-y-3 sm:col-span-2">
          <Label htmlFor="content" className="text-sm font-semibold text-[#0F1E3D]">
            Content (Markdown)
          </Label>
          <Textarea
            id="content"
            name="content"
            rows={18}
            required
            defaultValue={post?.content ?? ""}
            placeholder="# Your Heading&#10;&#10;Write your post content here..."
            className="min-h-[400px] rounded-xl border-[#0F1E3D]/12 bg-[#FCFCFD] p-5 font-mono text-[14px] shadow-sm transition-colors focus:bg-white leading-relaxed"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-[#0F1E3D]/12 bg-[#F8F8FA] p-5 transition-colors hover:border-[#0F1E3D]/30">
            <div className="flex h-6 items-center">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                defaultChecked={post?.is_published ?? false}
                className="size-5 rounded border-[#0F1E3D]/20 bg-white text-[#0F1E3D] focus:ring-[#0F1E3D]"
              />
            </div>
            <div>
              <div className="font-semibold text-[#0F1E3D]">Publish this post</div>
              <p className="mt-1 text-sm text-[#0F1E3D]/60">
                Make this content visible to everyone on the public website immediately.
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end border-t border-[#0F1E3D]/8 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(basePath)}
          className="h-12 rounded-xl border-[#0F1E3D]/12 px-8 text-[15px] font-medium"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 rounded-xl bg-[#0F1E3D] px-8 text-[15px] font-medium text-white shadow-md transition-transform hover:-translate-y-0.5 hover:bg-[#1A2E5A] hover:shadow-lg"
        >
          {isPending ? "Saving..." : post ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  )
}
