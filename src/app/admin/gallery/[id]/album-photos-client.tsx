"use client"

import { useTransition, useState, useRef } from "react"
import { adminAddPhotos, adminDeletePhoto, adminUpdatePhotoCaption } from "@/lib/actions/gallery"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Plus, Trash2, Save, Loader2 } from "lucide-react"

type Photo = { id: string; album_id: string; image_url: string; caption: string | null; order_index: number }

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

async function uploadOne(file: File): Promise<string> {
  const fd = new FormData()
  fd.append("file", file)
  fd.append("upload_preset", PRESET!)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: "POST", body: fd })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return data.secure_url as string
}

export function AlbumPhotosClient({ albumId, photos }: { albumId: string; photos: Photo[] }) {
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [editingCaption, setEditingCaption] = useState<string | null>(null)
  const [captionValue, setCaptionValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const arr = Array.from(files)
    setUploading(true)
    setProgress({ done: 0, total: arr.length })
    const urls: string[] = []
    for (let i = 0; i < arr.length; i++) {
      try { urls.push(await uploadOne(arr[i])) } catch { toast.error(`Failed: ${arr[i].name}`) }
      setProgress({ done: i + 1, total: arr.length })
    }
    setUploading(false)
    if (urls.length === 0) return
    const r = await adminAddPhotos(albumId, urls)
    if (r?.error) toast.error(r.error); else toast.success(`Added ${r.added} photo${r.added !== 1 ? "s" : ""}`)
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this photo?")) return
    startTransition(async () => {
      const r = await adminDeletePhoto(id)
      if (r?.error) toast.error(r.error); else toast.success("Deleted")
    })
  }

  function handleSaveCaption(id: string) {
    startTransition(async () => {
      const r = await adminUpdatePhotoCaption(id, captionValue)
      if (r?.error) toast.error(r.error); else { toast.success("Caption saved"); setEditingCaption(null) }
    })
  }

  function startEditCaption(p: Photo) { setEditingCaption(p.id); setCaptionValue(p.caption ?? "") }

  return (
    <>
      <div className="flex justify-end mb-4 items-center gap-3">
        {uploading && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />Uploading {progress.done}/{progress.total}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = "" }}
          disabled={uploading}
        />
        <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
          <Plus className="size-4 mr-2" />Add photos
        </Button>
      </div>

      {photos.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No photos yet. Click &quot;Add photos&quot; to upload.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((p) => (
            <Card key={p.id} className="overflow-hidden pt-0 group">
              <div className="aspect-square relative">
                <img src={p.image_url} alt={p.caption ?? ""} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)} disabled={isPending}><Trash2 className="size-4" /></Button>
                </div>
              </div>
              <CardContent className="pt-3 pb-3">
                {editingCaption === p.id ? (
                  <div className="flex gap-1">
                    <Input value={captionValue} onChange={(e) => setCaptionValue(e.target.value)} placeholder="Caption" className="text-xs h-8" />
                    <Button size="sm" onClick={() => handleSaveCaption(p.id)} disabled={isPending}><Save className="size-4" /></Button>
                  </div>
                ) : (
                  <button onClick={() => startEditCaption(p)} className="text-xs text-left text-muted-foreground hover:text-foreground w-full truncate">
                    {p.caption || "+ Add caption"}
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
