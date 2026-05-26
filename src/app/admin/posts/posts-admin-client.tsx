"use client"

import { useState, useTransition } from "react"
import { adminCreatePost, adminUpdatePost, adminDeletePost } from "@/lib/actions/posts"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CldUploadWidget } from "next-cloudinary"
import { toast } from "sonner"
import Link from "next/link"
import { Plus, Pencil, Trash2, ExternalLink, Upload } from "lucide-react"

type Post = {
  id: string; title: string; slug: string; excerpt: string | null; content: string
  cover_image_url: string | null; type: string; is_published: boolean
  published_at: string | null; created_at: string
}

const TYPE_LABELS: Record<string, string> = {
  news: "News", blog: "Blog", tournament_writeup: "Tournament Writeup", announcement: "Announcement",
}

export function PostsAdminClient({ posts }: { posts: Post[] }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Post | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function openNew() { setEditing(null); setCoverUrl(null); setOpen(true) }
  function openEdit(p: Post) { setEditing(p); setCoverUrl(p.cover_image_url); setOpen(true) }
  function closeAll() { setOpen(false); setEditing(null); setCoverUrl(null) }

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
      const r = editing ? await adminUpdatePost(editing.id, input) : await adminCreatePost(input)
      if (r?.error) toast.error(r.error)
      else { toast.success(editing ? "Post updated" : "Post created"); closeAll() }
    })
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return
    startTransition(async () => {
      const r = await adminDeletePost(id)
      if (r?.error) toast.error(r.error); else toast.success("Deleted")
    })
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openNew}><Plus className="size-4 mr-2" />New post</Button>
      </div>

      <Dialog open={open} modal={false} onOpenChange={(o) => { if (!o) closeAll() }}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{editing ? "Edit post" : "New post"}</DialogTitle>
            <DialogDescription>Markdown supported in content.</DialogDescription>
          </DialogHeader>
          <form key={editing?.id ?? "new"} action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required defaultValue={editing?.title ?? ""} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (optional)</Label>
                <Input id="slug" name="slug" defaultValue={editing?.slug ?? ""} placeholder="auto-generated" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select name="type" defaultValue={editing?.type ?? "blog"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cover image (optional)</Label>
              <div className="flex items-center gap-3">
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  options={{ maxFiles: 1, clientAllowedFormats: ["png", "jpg", "jpeg", "webp"], maxFileSize: 5000000 }}
                  onSuccess={(result) => {
                    const info = result.info
                    if (info && typeof info === "object" && "secure_url" in info && typeof info.secure_url === "string") {
                      setCoverUrl(info.secure_url)
                    }
                  }}
                >
                  {({ open: openWidget }) => (
                    <Button type="button" variant="outline" onClick={() => openWidget?.()}>
                      <Upload className="size-4 mr-2" />{coverUrl ? "Replace" : "Upload"}
                    </Button>
                  )}
                </CldUploadWidget>
                {coverUrl && <Button type="button" variant="outline" size="sm" onClick={() => setCoverUrl(null)}>Remove</Button>}
              </div>
              {coverUrl && <img src={coverUrl} alt="cover" className="w-full max-h-40 object-cover rounded" />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt (optional)</Label>
              <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={editing?.excerpt ?? ""} placeholder="Shown on listings" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content (markdown)</Label>
              <Textarea id="content" name="content" rows={12} required defaultValue={editing?.content ?? ""} placeholder="# Heading&#10;&#10;Body text..." className="font-mono text-sm" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_published" name="is_published" defaultChecked={editing?.is_published ?? false} className="size-4" />
              <Label htmlFor="is_published" className="cursor-pointer">Publish (visible to public)</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeAll}>Cancel</Button>
              <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : (editing ? "Update" : "Create")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {posts.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No posts yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <Card key={p.id}>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-medium">{p.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">/posts/{p.slug}</div>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                      <Badge variant="secondary">{TYPE_LABELS[p.type]}</Badge>
                      {p.is_published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}
                      {p.published_at && <span className="text-muted-foreground">· {new Date(p.published_at).toLocaleDateString()}</span>}
                    </div>
                    {p.excerpt && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.excerpt}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {p.is_published && (
                      <Link href={`/posts/${p.slug}`} target="_blank">
                        <Button size="sm" variant="outline"><ExternalLink className="size-4" /></Button>
                      </Link>
                    )}
                    <Button size="sm" variant="outline" onClick={() => openEdit(p)}><Pencil className="size-4" /></Button>
                    <Button size="sm" variant="outline" disabled={isPending} onClick={() => handleDelete(p.id)}><Trash2 className="size-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
