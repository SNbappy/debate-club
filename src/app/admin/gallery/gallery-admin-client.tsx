"use client"

import { useState, useTransition } from "react"
import { adminCreateAlbum, adminUpdateAlbum, adminDeleteAlbum } from "@/lib/actions/gallery"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CldUploadWidget } from "next-cloudinary"
import { toast } from "sonner"
import Link from "next/link"
import { Plus, Pencil, Trash2, Images, ExternalLink, Upload } from "lucide-react"

type Album = {
  id: string; title: string; slug: string; description: string | null
  cover_image_url: string | null; event_date: string | null; is_published: boolean
  gallery_images: { count: number }[]
}

export function GalleryAdminClient({ albums }: { albums: Album[] }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Album | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function openNew() { setEditing(null); setCoverUrl(null); setOpen(true) }
  function openEdit(a: Album) { setEditing(a); setCoverUrl(a.cover_image_url); setOpen(true) }
  function closeAll() { setOpen(false); setEditing(null); setCoverUrl(null) }

  function handleSubmit(formData: FormData) {
    const input = {
      title: formData.get("title") as string,
      slug: (formData.get("slug") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      event_date: (formData.get("event_date") as string) || undefined,
      cover_image_url: coverUrl || undefined,
      is_published: formData.get("is_published") === "on",
    }
    startTransition(async () => {
      const r = editing ? await adminUpdateAlbum(editing.id, input) : await adminCreateAlbum(input)
      if (r?.error) toast.error(r.error)
      else { toast.success(editing ? "Album updated" : "Album created"); closeAll() }
    })
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this album and all its photos?")) return
    startTransition(async () => {
      const r = await adminDeleteAlbum(id)
      if (r?.error) toast.error(r.error); else toast.success("Deleted")
    })
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openNew}><Plus className="size-4 mr-2" />New album</Button>
      </div>

      <Dialog open={open} modal={false} onOpenChange={(o) => { if (!o) closeAll() }}>
        <DialogContent
          className="max-w-lg"
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{editing ? "Edit album" : "New album"}</DialogTitle>
          </DialogHeader>
          <form key={editing?.id ?? "new"} action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required defaultValue={editing?.title ?? ""} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (optional)</Label>
                <Input id="slug" name="slug" defaultValue={editing?.slug ?? ""} placeholder="auto" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_date">Event date (optional)</Label>
                <Input id="event_date" name="event_date" type="date" defaultValue={editing?.event_date ?? ""} />
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
                    if (info && typeof info === "object" && "secure_url" in info && typeof info.secure_url === "string") setCoverUrl(info.secure_url)
                  }}
                >
                  {({ open: o }) => (
                    <Button type="button" variant="outline" onClick={() => o?.()}>
                      <Upload className="size-4 mr-2" />{coverUrl ? "Replace" : "Upload"}
                    </Button>
                  )}
                </CldUploadWidget>
                {coverUrl && <Button type="button" variant="outline" size="sm" onClick={() => setCoverUrl(null)}>Remove</Button>}
              </div>
              {coverUrl && <img src={coverUrl} alt="cover" className="w-full max-h-32 object-cover rounded" />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea id="description" name="description" rows={3} defaultValue={editing?.description ?? ""} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_published" name="is_published" defaultChecked={editing?.is_published ?? false} className="size-4" />
              <Label htmlFor="is_published" className="cursor-pointer">Publish</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeAll}>Cancel</Button>
              <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : (editing ? "Update" : "Create")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {albums.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No albums yet.</CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((a) => {
            const count = a.gallery_images?.[0]?.count ?? 0
            return (
              <Card key={a.id} className="overflow-hidden pt-0">
                {a.cover_image_url ? (
                  <img src={a.cover_image_url} alt={a.title} className="aspect-video w-full object-cover" />
                ) : (
                  <div className="aspect-video bg-muted flex items-center justify-center"><Images className="size-12 text-muted-foreground" /></div>
                )}
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium">{a.title}</h3>
                    {a.is_published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    {count} photo{count !== 1 ? "s" : ""}{a.event_date && <> · {a.event_date}</>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/gallery/${a.id}`}>
                      <Button size="sm"><Images className="size-4 mr-1" />Photos</Button>
                    </Link>
                    {a.is_published && (
                      <Link href={`/gallery/${a.slug}`} target="_blank">
                        <Button size="sm" variant="outline"><ExternalLink className="size-4" /></Button>
                      </Link>
                    )}
                    <Button size="sm" variant="outline" onClick={() => openEdit(a)}><Pencil className="size-4" /></Button>
                    <Button size="sm" variant="outline" disabled={isPending} onClick={() => handleDelete(a.id)}><Trash2 className="size-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </>
  )
}
