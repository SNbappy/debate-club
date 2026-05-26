import { createClient } from "@/lib/supabase/server"
import { CertificatesAdminClient } from "./certificates-admin-client"

export default async function AdminCertificatesPage() {
  const supabase = await createClient()
  const [{ data: certificates }, { data: members }] = await Promise.all([
    supabase.from("certificates").select("*, profiles!profile_id(full_name, slug)").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name, email").eq("is_verified", true).order("full_name"),
  ])

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">Certificates</h1>
      <p className="text-muted-foreground mb-6">Issue certificates to verified members. Each gets a unique ID for public verification.</p>
      <CertificatesAdminClient certificates={(certificates as unknown as Parameters<typeof CertificatesAdminClient>[0]["certificates"]) ?? []} members={members ?? []} />
    </div>
  )
}
