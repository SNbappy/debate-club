import { redirect } from "next/navigation"
import { Award, CheckCircle2, Clock } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { AchievementsClient } from "./achievements-client"

export default async function AchievementsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .eq("profile_id", user.id)
    .order("achievement_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })

  const all = achievements ?? []
  const verified = all.filter((a) => a.is_verified)
  const pending = all.filter((a) => !a.is_verified)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#0F1E3D]">
            Debate Achievements
          </h2>
          <p className="mt-1.5 text-sm text-[#0F1E3D]/50 font-medium">
            Manage your tournament wins, speaker awards, and adjudications.
          </p>
        </div>

        {all.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {verified.length > 0 && (
              <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 hover:bg-emerald-100">
                <CheckCircle2 className="mr-1.5 size-3.5" />
                {verified.length} Verified
              </Badge>
            )}
            {pending.length > 0 && (
              <Badge
                variant="outline"
                className="rounded-full border-amber-300 bg-amber-50 px-3 py-1 text-amber-700"
              >
                <Clock className="mr-1.5 size-3.5" />
                {pending.length} Pending
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-3 max-w-xl">
        <div className="rounded-2xl border border-[#0F1E3D]/8 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0F1E3D]/40">Total</p>
          <p className="mt-1 text-2xl font-bold text-[#0F1E3D]">{all.length}</p>
        </div>
        <div className="rounded-2xl border border-[#0F1E3D]/8 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0F1E3D]/40">Verified</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{verified.length}</p>
        </div>
        <div className="rounded-2xl border border-[#0F1E3D]/8 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0F1E3D]/40">Pending</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{pending.length}</p>
        </div>
      </div>

      <div className="max-w-4xl pt-2">
        <AchievementsClient achievements={all} />
      </div>
    </div>
  )
}
