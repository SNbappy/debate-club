import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AchievementsClient } from "./achievements-client"

export default async function AchievementsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .eq("profile_id", user.id)
    .order("achievement_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-4 mr-1" /> Back to dashboard
      </Link>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My achievements</h1>
        <p className="text-muted-foreground">Add your debate accomplishments. Admin verifies them before they appear on your public profile.</p>
      </div>
      <AchievementsClient achievements={achievements ?? []} />
    </div>
  )
}
