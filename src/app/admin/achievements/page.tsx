import { CheckCircle2, Clock3, Trophy, Users } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { AchievementsAdminClient } from "./achievements-admin-client"

export default async function AdminAchievementsPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("achievements")
    .select("*, profiles!profile_id(full_name, slug, email)")
    .order("is_verified", { ascending: true })
    .order("created_at", { ascending: false })

  const achievements =
    (data as unknown as Parameters<typeof AchievementsAdminClient>[0]["achievements"]) ?? []

  const pendingAchievements = achievements.filter((a) => !a.is_verified)
  const verifiedAchievements = achievements.filter((a) => a.is_verified)
  const uniqueMembers = new Set(
    achievements.map((a) => a.profiles?.email).filter(Boolean)
  ).size

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[28px] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-6 shadow-[0_18px_50px_rgba(15,30,61,0.08)] sm:p-7 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Admin workspace
            </p>
            <h1 className="mt-3 font-display text-[2.15rem] leading-none text-[#0F1E3D] sm:text-[2.45rem]">
              Achievements
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#0F1E3D]/65">
              Review member-submitted achievements, approve valid records, and remove incorrect or duplicate entries before they appear on public profiles.
            </p>
          </div>

          {pendingAchievements.length > 0 && (
            <Badge
              variant="outline"
              className="rounded-full border-amber-300 bg-amber-50 px-3 py-1 text-amber-700"
            >
              <Clock3 className="mr-1.5 size-3.5" />
              {pendingAchievements.length} pending review
            </Badge>
          )}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#0F1E3D]/45">
              Total records
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-semibold text-[#0F1E3D]">{achievements.length}</div>
                <p className="mt-1 text-sm text-[#0F1E3D]/58">All submitted achievements</p>
              </div>
              <Trophy className="size-5 text-[#C19A3D]" />
            </div>
          </div>

          <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#0F1E3D]/45">
              Pending
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-semibold text-[#0F1E3D]">{pendingAchievements.length}</div>
                <p className="mt-1 text-sm text-[#0F1E3D]/58">Awaiting approval</p>
              </div>
              <Clock3 className="size-5 text-[#C19A3D]" />
            </div>
          </div>

          <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#0F1E3D]/45">
              Verified
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-semibold text-[#0F1E3D]">{verifiedAchievements.length}</div>
                <p className="mt-1 text-sm text-[#0F1E3D]/58">Approved and public</p>
              </div>
              <CheckCircle2 className="size-5 text-[#C19A3D]" />
            </div>
          </div>

          <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#0F1E3D]/45">
              Contributors
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-semibold text-[#0F1E3D]">{uniqueMembers}</div>
                <p className="mt-1 text-sm text-[#0F1E3D]/58">Members represented</p>
              </div>
              <Users className="size-5 text-[#C19A3D]" />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-6 shadow-[0_16px_45px_rgba(15,30,61,0.08)] sm:p-7">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
            Moderation queue
          </p>
          <h2 className="mt-2 text-[1.5rem] font-semibold leading-none text-[#0F1E3D]">
            {achievements.length === 0
              ? "No achievements submitted"
              : `${achievements.length} achievement${achievements.length === 1 ? "" : "s"} in queue`}
          </h2>
        </div>

        <AchievementsAdminClient achievements={achievements} />
      </section>
    </div>
  )
}
