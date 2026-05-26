"use client"

import { useState, useTransition } from "react"
import { adminCreateEvent, adminUpdateEvent, adminDeleteEvent } from "@/lib/actions/events"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CldUploadWidget } from "next-cloudinary"
import { toast } from "sonner"
import Link from "next/link"
import { Plus, Pencil, Trash2, ExternalLink, Upload } from "lucide-react"

type Evt = {
  id: string; title: string; slug: string; description: string | null
  event_date: string; end_date: string | null; location: string | null
  registration_url: string | null; cover_image_url: string | null; is_published: boolean
}

function isoToLocalInput(iso: string | null | undefined): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function EventsAdminClient({ events }: { events: Evt[] }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Evt | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function openNew() { setEditing(null); setCoverUrl(null); setOpen(true) }
  function openEdit(e: Evt) { setEditing(e); setCoverUrl(e.cover_image_url); setOpen(true) }
  function closeAll() { setOpen(false); setEditing(null); setCoverUrl(null) }

  function handleSubmit(formData: FormData) {
    const input = {
      title: formData.get("title") as string,
      slug: (formData.get("slug") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      event_date: formData.get("event_date") as string,
      end_date: (formData.get("end_date") as string) || undefined,
      location: (formData.get("location") as string) || undefined,
      registration_url: (formData.get("registration_url") as string) || undefined,
      cover_image_url: coverUrl || undefined,
      is_published: formData.get("is_published") === "on",
    }
    startTransition(async () => {
      const r = editing ? await adminUpdateEvent(editing.id, input) : await adminCreateEvent(input)
      if (r?.error) toast.error(r.error)
      else { toast.success(editing ? "Event updated" : "Event created"); closeAll() }
    })
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return
    startTransition(async () => {
      const r = await adminDeleteEvent(id)
      if (r?.error) toast.error(r.error); else toast.success("Deleted")
    })
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openNew}><Plus className="size-4 mr-2" />New event</Button>
      </div>

      <Dialog open={open} modal={false} onOpenChange={(o) => { if (!o) closeAll() }}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{editing ? "Edit event" : "New event"}</DialogTitle>
            <DialogDescription>Date/time is in your local timezone.</DialogDescription>
          </DialogHeader>
          <form key={editing?.id ?? "new"} action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required defaultValue={editing?.title ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (optional)</Label>
              <Input id="slug" name="slug" defaultValue={editing?.slug ?? ""} placeholder="auto-generated" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event_date">Start</Label>
                <Input id="event_date" name="event_date" type="datetime-local" required defaultValue={isoToLocalInput(editing?.event_date)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End (optional)</Label>
                <Input id="end_date" name="end_date" type="datetime-local" defaultValue={isoToLocalInput(editing?.end_date)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" defaultValue={editing?.location ?? ""} placeholder="Online / Campus auditorium" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registration_url">Registration URL (optional)</Label>
              <Input id="registration_url" name="registration_url" type="url" defaultValue={editing?.registration_url ?? ""} />
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
              {coverUrl && <img src={coverUrl} alt="cover" className="w-full max-h-40 object-cover rounded" />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={5} defaultValue={editing?.description ?? ""} />
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

      {events.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No events yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <Card key={e.id}>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-medium">{e.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">/events/{e.slug}</div>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                      {e.is_published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}
                      <span>· {new Date(e.event_date).toLocaleString()}</span>
                      {e.location && <span>· {e.location}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {e.is_published && (
                      <Link href={`/events/${e.slug}`} target="_blank">
                        <Button size="sm" variant="outline"><ExternalLink className="size-4" /></Button>
                      </Link>
                    )}
                    <Button size="sm" variant="outline" onClick={() => openEdit(e)}><Pencil className="size-4" /></Button>
                    <Button size="sm" variant="outline" disabled={isPending} onClick={() => handleDelete(e.id)}><Trash2 className="size-4" /></Button>
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
