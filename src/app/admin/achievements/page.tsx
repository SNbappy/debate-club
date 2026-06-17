import { createClient } from "@/lib/supabase/server"
import { AchievementsAdminClient } from "./achievements-admin-client"
import type { Achievement } from "@/types/supabase"

export default async function AdminAchievementsPage() {
  const supabase = await createClient()

  const { data: rawAchievements } = await supabase
    .from("achievements")
    .select("*")
    .order("created_at", { ascending: false })

  const achievements = (rawAchievements ?? []) as unknown as Achievement[]

  return (
    <div className="max-w-6xl">
      <AchievementsAdminClient achievements={achievements} basePath="/admin/achievements" />
    </div>
  )
}
