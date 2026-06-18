"use client"

import { useMemo, useState, useTransition } from "react"
import { adminDeleteCertificate } from "@/lib/actions/certificates"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Award,
  Check,
  Copy,
  ExternalLink,
  FileBadge2,
  Link2,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react"
import Link from "next/link"
import { FilePreviewModal } from "@/components/file-preview-modal"

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

type Member = {
  id: string
  full_name: string
  email: string
}

function formatIssuedDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function CertificatesAdminClient({
  certificates,
  memberCount,
}: {
  certificates: CertRow[]
  memberCount: number
}) {
  const [isPending, startTransition] = useTransition()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const issuedCount = certificates.length

  const recentCertificates = useMemo(
    () =>
      [...certificates].sort(
        (a, b) =>
          new Date(b.issued_date).getTime() - new Date(a.issued_date).getTime()
      ),
    [certificates]
  )

  function handleDelete(id: string) {
    if (!confirm("Delete this certificate? The verification link will stop working.")) {
      return
    }

    startTransition(async () => {
      const result = await adminDeleteCertificate(id)

      if (result?.error) toast.error(result.error)
      else toast.success("Certificate deleted")
    })
  }

  async function copyVerifyLink(certId: string) {
    const url = `${window.location.origin}/verify/${certId}`

    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(certId)
      toast.success("Verification link copied")
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      toast.error("Could not copy the verification link")
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#0F1E3D]/8 bg-white p-5 shadow-[0_20px_60px_rgba(15,30,61,0.06)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C19A3D]/20 bg-[#FBF6E8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A17C27]">
              Certificate management
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#0F1E3D]">
                Certificates
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#0F1E3D]/62">
                Issue verifiable certificates for members, keep event records tidy,
                and maintain a clean public verification trail.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
            <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-[#F8F8FA] px-4 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/45">
                Certificates issued
              </div>
              <div className="mt-2 text-2xl font-semibold text-[#0F1E3D]">
                {issuedCount}
              </div>
            </div>

            <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-[#F8F8FA] px-4 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/45">
                Eligible members
              </div>
              <div className="mt-2 text-2xl font-semibold text-[#0F1E3D]">
                {memberCount}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[#0F1E3D]/8 bg-[#FCFCFD] px-4 py-4">
          <div>
            <div className="text-sm font-medium text-[#0F1E3D]">
              Issue a new certificate
            </div>
            <p className="mt-1 text-sm text-[#0F1E3D]/58">
              Upload the final certificate file and generate a public verification ID.
            </p>
          </div>

          <Button asChild className="rounded-xl bg-[#0F1E3D] text-white hover:bg-[#1A2E5A]">
            <Link href="/admin/certificates/new">
              <Plus className="mr-2 size-4" />
              Issue certificate
            </Link>
          </Button>
        </div>
      </section>

      {recentCertificates.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-[#0F1E3D]/15 bg-white p-10 text-center">
          <FileBadge2 className="mx-auto mb-4 size-10 text-[#0F1E3D]/20" />
          <p className="text-sm font-medium text-[#0F1E3D]/55">
            No certificates have been issued yet.
          </p>
          <p className="mt-2 text-sm text-[#0F1E3D]/45">
            Start by issuing a certificate for a verified member.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Award className="size-4 text-[#C19A3D]" />
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/55">
              Issued records
            </h3>
          </div>

          <div className="space-y-3">
            {recentCertificates.map((certificate) => (
              <div
                key={certificate.id}
                className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5 transition-shadow hover:shadow-[0_14px_35px_rgba(15,30,61,0.08)]"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[1rem] font-semibold text-[#0F1E3D]">
                        {certificate.event_name}
                      </h3>

                      <Badge
                        variant="outline"
                        className="rounded-full border-[#0F1E3D]/12 bg-[#F8F8FA] text-[#0F1E3D]"
                      >
                        <span className="font-mono">{certificate.certificate_id}</span>
                      </Badge>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#0F1E3D]/58">
                      <span className="inline-flex items-center gap-1.5">
                        <UserRound className="size-3.5" />
                        {certificate.recipient_name}
                      </span>
                      <span>· {formatIssuedDate(certificate.issued_date)}</span>
                      <span>· Issued by {certificate.issued_by}</span>
                    </div>

                    {certificate.achievement_description && (
                      <p className="mt-3 text-sm leading-6 text-[#0F1E3D]/65">
                        {certificate.achievement_description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#0F1E3D]/48">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0F1E3D]/10 bg-[#F8F8FA] px-3 py-1.5">
                        <Link2 className="size-3.5" />
                        Public verification enabled
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 xl:justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyVerifyLink(certificate.certificate_id)}
                      className="rounded-xl border-[#0F1E3D]/12"
                    >
                      {copiedId === certificate.certificate_id ? (
                        <Check className="mr-1.5 size-4" />
                      ) : (
                        <Copy className="mr-1.5 size-4" />
                      )}
                      {copiedId === certificate.certificate_id ? "Copied" : "Copy link"}
                    </Button>

                    <FilePreviewModal url={certificate.file_url}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl border-[#0F1E3D]/12"
                      >
                        <ExternalLink className="mr-1.5 size-4" />
                        View file preview
                      </Button>
                    </FilePreviewModal>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => handleDelete(certificate.id)}
                      className="rounded-xl border-[#0F1E3D]/12"
                    >
                      <Trash2 className="mr-1.5 size-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}