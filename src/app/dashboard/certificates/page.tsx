import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CertCopyButton } from "./cert-copy-button"

export default async function MyCertificatesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .eq("profile_id", user.id)
    .order("issued_date", { ascending: false })

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-4 mr-1" /> Back to dashboard
      </Link>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My certificates</h1>
        <p className="text-muted-foreground">Certificates issued to you. Each has a public verification link.</p>
      </div>

      {(!certificates || certificates.length === 0) ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No certificates yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {certificates.map((c) => (
            <Card key={c.id}>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-medium">{c.event_name}</div>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                      <Badge variant="secondary" className="font-mono">{c.certificate_id}</Badge>
                      <span>· {c.issued_date}</span>
                      <span>· by {c.issued_by}</span>
                    </div>
                    {c.achievement_description && <p className="text-sm text-muted-foreground mt-2">{c.achievement_description}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <CertCopyButton certificateId={c.certificate_id} />
                    <a href={c.file_url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline"><Download className="size-4" /></Button>
                    </a>
                    <Link href={`/verify/${c.certificate_id}`} target="_blank">
                      <Button size="sm" variant="outline"><ExternalLink className="size-4" /></Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
