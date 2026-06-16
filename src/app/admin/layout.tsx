import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { AdminShell } from "@/components/admin-shell"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url, is_admin")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) redirect("/dashboard")

  return (
    <AdminShell user={user} profile={profile}>
      {children}
    </AdminShell>
  )
}
