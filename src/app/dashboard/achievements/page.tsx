import { redirect } from "next/navigation"
import { Award, CheckCircle2, Clock, Plus } from "lucide-react"

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
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[28px] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-6 shadow-[0_18px_50px_rgba(15,30,61,0.08)] sm:p-7 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Member workspace
            </p>
            <h1 className="mt-3 font-display text-[2.15rem] leading-none text-[#0F1E3D] sm:text-[2.45rem]">
              Achievements
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#0F1E3D]/65">
              Record your debate accomplishments — tournament wins, speaker awards, adjudication results, and more. Admin reviews each entry before it appears on your public profile.
            </p>
          </div>

          {all.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {verified.length > 0 && (
                <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 hover:bg-emerald-100">
                  <CheckCircle2 className="mr-1.5 size-3.5" />
                  {verified.length} verified
                </Badge>
              )}
              {pending.length > 0 && (
                <Badge
                  variant="outline"
                  className="rounded-full border-amber-300 bg-amber-50 px-3 py-1 text-amber-700"
                >
                  <Clock className="mr-1.5 size-3.5" />
                  {pending.length} pending
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#0F1E3D]/45">
              Total
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-semibold text-[#0F1E3D]">{all.length}</div>
                <p className="mt-1 text-sm text-[#0F1E3D]/58">Achievements recorded</p>
              </div>
              <Award className="size-5 text-[#C19A3D]" />
            </div>
          </div>

          <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#0F1E3D]/45">
              Verified
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-semibold text-[#0F1E3D]">{verified.length}</div>
                <p className="mt-1 text-sm text-[#0F1E3D]/58">Approved and public</p>
              </div>
              <CheckCircle2 className="size-5 text-[#C19A3D]" />
            </div>
          </div>

          <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#0F1E3D]/45">
              Pending
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-semibold text-[#0F1E3D]">{pending.length}</div>
                <p className="mt-1 text-sm text-[#0F1E3D]/58">Awaiting admin review</p>
              </div>
              <Clock className="size-5 text-[#C19A3D]" />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-6 shadow-[0_16px_45px_rgba(15,30,61,0.08)] sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Your record
            </p>
            <h2 className="mt-2 text-[1.5rem] font-semibold leading-none text-[#0F1E3D]">
              {all.length === 0 ? "No achievements yet" : `${all.length} achievement${all.length === 1 ? "" : "s"} on record`}
            </h2>
          </div>
        </div>

        <AchievementsClient achievements={all} />
      </section>
    </div>
  )
}
