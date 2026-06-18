"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { adminCreateCertificate } from "@/lib/actions/certificates"
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
import { cloudinaryUploadWidgetStyles } from "@/lib/cloudinary"
import { toast } from "sonner"
import { Check, Upload } from "lucide-react"
import Link from "next/link"

type Member = {
  id: string
  full_name: string
  email: string
}

export function CertificateForm({ members }: { members: Member[] }) {
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(formData: FormData) {
    if (!fileUrl) {
      toast.error("Please upload the certificate file first")
      return
    }

    const input = {
      profile_id: formData.get("profile_id") as string,
      event_name: formData.get("event_name") as string,
      achievement_description:
        (formData.get("achievement_description") as string) || undefined,
      issued_date: formData.get("issued_date") as string,
      issued_by: (formData.get("issued_by") as string) || undefined,
      file_url: fileUrl,
    }

    startTransition(async () => {
      const result = await adminCreateCertificate(input)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(`Issued: ${result.certificateId}`)
        router.push("/admin/certificates")
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-[#0F1E3D]/8 bg-[linear-gradient(180deg,rgba(8,23,49,0.98)_0%,rgba(13,34,68,0.98)_100%)] px-6 py-8 text-white rounded-[28px] shadow-[0_20px_60px_rgba(15,30,61,0.06)]">
        <div className="space-y-2 text-left">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F7E9BF]">
            New certificate
          </div>
          <h2 className="text-2xl font-semibold text-white">
            Issue certificate
          </h2>
          <p className="max-w-xl text-sm leading-6 text-white/72">
            Create a certificate record, attach the final file, and generate a
            verification code for public lookup.
          </p>
        </div>
      </div>

      <div className="rounded-[28px] border border-[#0F1E3D]/8 bg-white p-6 shadow-[0_20px_60px_rgba(15,30,61,0.06)]">
        <form action={handleSubmit} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="profile_id" className="text-[#0F1E3D]">
                Recipient
              </Label>
              <Select name="profile_id" required>
                <SelectTrigger className="h-11 rounded-xl border-[#0F1E3D]/12 bg-white">
                  <SelectValue placeholder="Select a verified member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.full_name} ({member.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="event_name" className="text-[#0F1E3D]">
                Event or tournament
              </Label>
              <Input
                id="event_name"
                name="event_name"
                required
                placeholder="British Parliamentary Workshop 2026"
                className="h-11 rounded-xl border-[#0F1E3D]/12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issued_date" className="text-[#0F1E3D]">
                Issued date
              </Label>
              <Input
                id="issued_date"
                name="issued_date"
                type="date"
                required
                defaultValue={new Date().toISOString().slice(0, 10)}
                className="h-11 rounded-xl border-[#0F1E3D]/12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issued_by" className="text-[#0F1E3D]">
                Issued by
              </Label>
              <Input
                id="issued_by"
                name="issued_by"
                defaultValue="JUST Debate Club"
                className="h-11 rounded-xl border-[#0F1E3D]/12"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label
                htmlFor="achievement_description"
                className="text-[#0F1E3D]"
              >
                Achievement note
              </Label>
              <Textarea
                id="achievement_description"
                name="achievement_description"
                rows={3}
                placeholder="Best Speaker, Champion, Finalist, Organizing Team, etc."
                className="min-h-[96px] rounded-xl border-[#0F1E3D]/12"
              />
            </div>

            <div className="space-y-3 sm:col-span-2">
              <Label className="text-[#0F1E3D]">Certificate file</Label>

              <div className="rounded-[20px] border border-dashed border-[#0F1E3D]/14 bg-[#F8F8FA] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-medium text-[#0F1E3D]">
                      Upload PDF or image
                    </div>
                    <p className="mt-1 text-sm text-[#0F1E3D]/55">
                      One final certificate file, up to 10MB.
                    </p>
                  </div>

                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    options={{
                      maxFiles: 1,
                      clientAllowedFormats: ["pdf", "png", "jpg", "jpeg"],
                      maxFileSize: 10000000,
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
                        setFileUrl(info.secure_url)
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
                        {fileUrl ? "Replace file" : "Upload file"}
                      </Button>
                    )}
                  </CldUploadWidget>
                </div>

                {fileUrl ? (
                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                        <Check className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-emerald-800">
                          File ready
                        </div>
                        <p className="mt-1 break-all text-xs leading-5 text-emerald-700">
                          {fileUrl}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-800">
                    Upload is required before issuing the certificate.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-4 border-t border-[#0F1E3D]/8">
            <Button
              type="button"
              variant="ghost"
              asChild
              className="rounded-xl text-[#0F1E3D]/70 hover:text-[#0F1E3D] hover:bg-[#0F1E3D]/5"
            >
              <Link href="/admin/certificates">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={isPending || !fileUrl}
              className="rounded-xl bg-[#0F1E3D] text-white hover:bg-[#1A2E5A]"
            >
              {isPending ? "Issuing..." : "Issue certificate"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
