import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ContactInboxClient from "./contact-inbox-client"

export default async function AdminContactPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()
  if (!profile?.is_admin) redirect("/dashboard")

  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })

  return <ContactInboxClient messages={messages ?? []} />
}
