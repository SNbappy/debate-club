import { createClient } from "@/lib/supabase/server"
import { CertificateForm } from "./certificate-form"
import { redirect } from "next/navigation"

export default async function NewCertificatePage() {
  const supabase = await createClient()

  // Fetch verified members
  const { data: members, error } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("is_verified", true)
    .order("full_name")

  if (error) {
    console.error("Failed to fetch members:", error)
    redirect("/admin/certificates")
  }

  return (
    <div className="max-w-6xl">
      <CertificateForm members={members || []} />
    </div>
  )
}
