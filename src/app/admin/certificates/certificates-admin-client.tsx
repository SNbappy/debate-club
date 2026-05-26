"use client"

import { useState, useTransition } from "react"
import { adminCreateCertificate, adminDeleteCertificate } from "@/lib/actions/certificates"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CldUploadWidget } from "next-cloudinary"
import { toast } from "sonner"
import { Plus, Trash2, Upload, ExternalLink, Copy, Check } from "lucide-react"

type CertRow = {
  id: string
  certificate_id: string
  recipient_name: string
  event_name: string
  achievement_description: string | null
  issued_date: string
  issued_by: string
  file_url: string
  thumbnail_url: string | null
  profiles: { full_name: string; slug: string | null } | null
}
type Member = { id: string; full_name: string; email: string }

export function CertificatesAdminClient({ certificates, members }: { certificates: CertRow[]; members: Member[] }) {
  const [open, setOpen] = useState(false)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    if (!fileUrl) { toast.error("Please upload the certificate file first"); return }
    const input = {
      profile_id: formData.get("profile_id") as string,
      event_name: formData.get("event_name") as string,
      achievement_description: (formData.get("achievement_description") as string) || undefined,
      issued_date: formData.get("issued_date") as string,
      issued_by: (formData.get("issued_by") as string) || undefined,
      file_url: fileUrl,
    }
    startTransition(async () => {
      const r = await adminCreateCertificate(input)
      if (r?.error) toast.error(r.error)
      else { toast.success(`Issued: ${r.certificateId}`); setOpen(false); setFileUrl(null) }
    })
  }

  function handleDelete(id: string) {
    if (!confirm("Delete? Verification link will stop working.")) return
    startTransition(async () => {
      const r = await adminDeleteCertificate(id)
      if (r?.error) toast.error(r.error); else toast.success("Deleted")
    })
  }

  function copyVerifyLink(certId: string) {
    const url = `${window.location.origin}/verify/${certId}`
    navigator.clipboard.writeText(url)
    setCopiedId(certId)
    toast.success("Verify link copied")
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog modal={false} open={open} onOpenChange={(o) => { setOpen(o); if (!o) setFileUrl(null) }}>
          <DialogTrigger asChild>
            <Button><Plus className="size-4 mr-2" />Issue certificate</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg" onInteractOutside={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Issue certificate</DialogTitle>
              <DialogDescription>Generates a unique ID for public verification.</DialogDescription>
            </DialogHeader>
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile_id">Recipient</Label>
                <Select name="profile_id" required>
                  <SelectTrigger><SelectValue placeholder="Select a verified member" /></SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.full_name} ({m.email})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_name">Event / Tournament</Label>
                <Input id="event_name" name="event_name" required placeholder="XYZ Open 2024" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issued_date">Issued date</Label>
                  <Input id="issued_date" name="issued_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issued_by">Issued by</Label>
                  <Input id="issued_by" name="issued_by" defaultValue="Debate Club" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="achievement_description">Achievement (optional)</Label>
                <Textarea id="achievement_description" name="achievement_description" rows={2} placeholder="e.g. Best Speaker, 1st Place, Finalist" />
              </div>
              <div className="space-y-2">
                <Label>Certificate file (PDF or image)</Label>
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  options={{ maxFiles: 1, clientAllowedFormats: ["pdf", "png", "jpg", "jpeg"], maxFileSize: 10000000 }}
                  onSuccess={(result) => {
                    const info = result.info
                    if (info && typeof info === "object" && "secure_url" in info && typeof info.secure_url === "string") {
                      setFileUrl(info.secure_url)
                    }
                  }}
                >
                  {({ open: openWidget }) => (
                    <Button type="button" variant="outline" onClick={() => openWidget?.()}>
                      <Upload className="size-4 mr-2" />{fileUrl ? "Replace file" : "Upload file"}
                    </Button>
                  )}
                </CldUploadWidget>
                {fileUrl && <p className="text-xs text-muted-foreground break-all">{fileUrl}</p>}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setOpen(false); setFileUrl(null) }}>Cancel</Button>
                <Button type="submit" disabled={isPending || !fileUrl}>{isPending ? "Issuing..." : "Issue"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {certificates.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No certificates issued yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {certificates.map((c) => (
            <Card key={c.id}>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-medium">{c.event_name}</div>
                    <div className="text-sm text-muted-foreground">To: <strong>{c.recipient_name}</strong></div>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                      <Badge variant="secondary" className="font-mono">{c.certificate_id}</Badge>
                      <span>· {c.issued_date}</span>
                      <span>· by {c.issued_by}</span>
                    </div>
                    {c.achievement_description && <p className="text-sm text-muted-foreground mt-2">{c.achievement_description}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyVerifyLink(c.certificate_id)}>
                      {copiedId === c.certificate_id ? <Check className="size-4" /> : <Copy className="size-4" />}
                    </Button>
                    <a href={c.file_url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline"><ExternalLink className="size-4" /></Button>
                    </a>
                    <Button size="sm" variant="outline" disabled={isPending} onClick={() => handleDelete(c.id)}>
                      <Trash2 className="size-4" />
                    </Button>
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



