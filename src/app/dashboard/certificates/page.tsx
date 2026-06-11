import { redirect } from "next/navigation"
import { Download, ExternalLink, FileBadge2, Link2 } from "lucide-react"
import Link from "next/link"

import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CertCopyButton } from "./cert-copy-button"

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
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[28px] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-6 shadow-[0_18px_50px_rgba(15,30,61,0.08)] sm:p-7 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Member workspace
            </p>
            <h1 className="mt-3 font-display text-[2.15rem] leading-none text-[#0F1E3D] sm:text-[2.45rem]">
              Certificates
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#0F1E3D]/65">
              Certificates issued to your account by the club. Each one carries a unique verification ID and a public verification link you can share freely.
            </p>
          </div>

          {certs.length > 0 && (
            <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 hover:bg-emerald-100">
              <FileBadge2 className="mr-1.5 size-3.5" />
              {certs.length} issued
            </Badge>
          )}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#0F1E3D]/45">
              Total issued
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-semibold text-[#0F1E3D]">{certs.length}</div>
                <p className="mt-1 text-sm text-[#0F1E3D]/58">Certificates on record</p>
              </div>
              <FileBadge2 className="size-5 text-[#C19A3D]" />
            </div>
          </div>

          <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#0F1E3D]/45">
              Latest issued
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-[#0F1E3D]">
                  {certs[0]?.issued_date ?? "—"}
                </div>
                <p className="mt-1 text-sm text-[#0F1E3D]/58">Most recent certificate date</p>
              </div>
              <Link2 className="size-5 text-[#C19A3D]" />
            </div>
          </div>

          <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#0F1E3D]/45">
              Verification
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-[#0F1E3D]">Public links active</div>
                <p className="mt-1 text-sm text-[#0F1E3D]/58">Each certificate is publicly verifiable</p>
              </div>
              <ExternalLink className="size-5 text-[#C19A3D]" />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-6 shadow-[0_16px_45px_rgba(15,30,61,0.08)] sm:p-7">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
            Issued certificates
          </p>
          <h2 className="mt-2 text-[1.5rem] font-semibold leading-none text-[#0F1E3D]">
            {certs.length === 0
              ? "No certificates yet"
              : `${certs.length} certificate${certs.length === 1 ? "" : "s"} issued to your account`}
          </h2>
        </div>

        {certs.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-[#0F1E3D]/15 bg-white p-10 text-center">
            <FileBadge2 className="mx-auto mb-4 size-10 text-[#0F1E3D]/20" />
            <p className="text-sm font-medium text-[#0F1E3D]/50">No certificates have been issued to your account yet.</p>
            <p className="mt-2 text-sm text-[#0F1E3D]/38">
              Certificates are issued by club admins after events, tournaments, or training sessions.
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
                      <a href={c.file_url} target="_blank" rel="noopener noreferrer">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl border-[#0F1E3D]/12 text-[#0F1E3D] hover:border-[#0F1E3D]/25"
                        >
                          <Download className="size-4" />
                        </Button>
                      </a>
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
      </section>
    </div>
  )
}
