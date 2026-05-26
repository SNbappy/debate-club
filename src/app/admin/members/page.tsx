import { createClient } from "@/lib/supabase/server"
import { MembersClient } from "./members-client"

export default async function AdminMembersPage() {
  const supabase = await createClient()
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("is_verified", { ascending: true })
    .order("created_at", { ascending: false })

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">Members</h1>
      <p className="text-muted-foreground mb-6">Approve sign-ups, set roles. Pending appear first.</p>
      <MembersClient profiles={profiles ?? []} />
    </div>
  )
}
