import { createClient } from "@/lib/supabase/server"
import { AchievementsAdminClient } from "./achievements-admin-client"

export default async function AdminAchievementsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("achievements")
    .select("*, profiles!profile_id(full_name, slug, email)")
    .order("is_verified", { ascending: true })
    .order("created_at", { ascending: false })

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">Achievements</h1>
      <p className="text-muted-foreground mb-6">Verify member-submitted achievements. Pending appear first.</p>
      <AchievementsAdminClient achievements={(data as unknown as Parameters<typeof AchievementsAdminClient>[0]["achievements"]) ?? []} />
    </div>
  )
}
