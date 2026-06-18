import { redirect } from "next/navigation"
import { Download, ExternalLink, FileBadge2, Link2 } from "lucide-react"
import Link from "next/link"

import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CertCopyButton } from "./cert-copy-button"
import { FilePreviewModal } from "@/components/file-preview-modal"

export default async function MyCertificatesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .eq("profile_id", user.id)
    .order("issued_date", { ascending: false })

  const certs = certificates ?? []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#0F1E3D]">
            My Certificates
          </h2>
          <p className="mt-1.5 text-sm text-[#0F1E3D]/50 font-medium">
            View and verify certificates issued to you by the club.
          </p>
        </div>

        {certs.length > 0 && (
          <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 hover:bg-emerald-100">
            <FileBadge2 className="mr-1.5 size-3.5" />
            {certs.length} Issued
          </Badge>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 max-w-xl">
        <div className="rounded-2xl border border-[#0F1E3D]/8 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0F1E3D]/40">Total Issued</p>
          <p className="mt-1 text-2xl font-bold text-[#0F1E3D]">{certs.length}</p>
        </div>
        <div className="rounded-2xl border border-[#0F1E3D]/8 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0F1E3D]/40">Latest Issued</p>
          <p className="mt-1 text-lg font-bold text-[#0F1E3D] truncate">
            {certs[0]?.issued_date ?? "—"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl pt-2">
        {certs.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-[#0F1E3D]/15 bg-white p-10 text-center">
            <FileBadge2 className="mx-auto mb-4 size-10 text-[#0F1E3D]/20" />
            <p className="text-sm font-medium text-[#0F1E3D]/50">No certificates issued yet.</p>
            <p className="mt-2 text-xs text-[#0F1E3D]/38">
              Certificates are automatically added here after tournaments or club events.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {certs.map((c) => (
              <div
                key={c.id}
                className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5 transition-shadow hover:shadow-[0_12px_32px_rgba(15,30,61,0.08)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[0.97rem] font-semibold text-[#0F1E3D]">{c.event_name}</h3>
                      <Badge
                        variant="outline"
                        className="rounded-full border-[#C19A3D]/40 bg-[#FFF8E8] px-2.5 py-0.5 font-mono text-[10px] text-[#8A6424]"
                      >
                        {c.certificate_id}
                      </Badge>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#0F1E3D]/55">
                      {c.issued_date && <span>Issued {c.issued_date}</span>}
                      {c.issued_by && <span>· by {c.issued_by}</span>}
                    </div>

                    {c.achievement_description && (
                      <p className="mt-3 text-sm leading-6 text-[#0F1E3D]/65">
                        {c.achievement_description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <CertCopyButton certificateId={c.certificate_id} />

                    {c.file_url && (
                      <FilePreviewModal url={c.file_url}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl border-[#0F1E3D]/12 text-[#0F1E3D] hover:border-[#0F1E3D]/25"
                        >
                          <Download className="size-4" />
                        </Button>
                      </FilePreviewModal>
                    )}

                    <Link href={`/verify/${c.certificate_id}`} target="_blank">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl border-[#0F1E3D]/12 text-[#0F1E3D] hover:border-[#0F1E3D]/25"
                      >
                        <ExternalLink className="size-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
