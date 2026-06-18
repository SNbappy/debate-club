import { CheckCircle2, Shield, UserPlus, Users } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { MembersClient } from "./members-client"

export default async function AdminMembersPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("is_verified", { ascending: true })
    .order("created_at", { ascending: false })

  const allProfiles = profiles ?? []
  const pendingProfiles = allProfiles.filter((p) => !p.is_verified)
  const verifiedProfiles = allProfiles.filter((p) => p.is_verified)
  const adminProfiles = allProfiles.filter((p) => p.is_admin)

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[28px] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-6 shadow-[0_18px_50px_rgba(15,30,61,0.08)] sm:p-7 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Admin workspace
            </p>
            <h1 className="mt-3 font-display text-[2.15rem] leading-none text-[#0F1E3D] sm:text-[2.45rem]">
              Members
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#0F1E3D]/65">
              Review new registrations, verify member accounts, assign roles, and control admin access. Pending accounts appear first so approvals can be handled quickly.
            </p>
          </div>

          {pendingProfiles.length > 0 && (
            <Badge
              variant="outline"
              className="rounded-full border-amber-300 bg-amber-50 px-3 py-1 text-amber-700"
            >
              <UserPlus className="mr-1.5 size-3.5" />
              {pendingProfiles.length} pending review
            </Badge>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#0F1E3D]/45">
              Total members
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-semibold text-[#0F1E3D]">{allProfiles.length}</div>
                <p className="mt-1 text-sm text-[#0F1E3D]/58">All registered accounts</p>
              </div>
              <Users className="size-5 text-[#C19A3D]" />
            </div>
          </div>

          <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#0F1E3D]/45">
              Pending
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-semibold text-[#0F1E3D]">{pendingProfiles.length}</div>
                <p className="mt-1 text-sm text-[#0F1E3D]/58">Waiting for approval</p>
              </div>
              <UserPlus className="size-5 text-[#C19A3D]" />
            </div>
          </div>

          <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#0F1E3D]/45">
              Verified
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-semibold text-[#0F1E3D]">{verifiedProfiles.length}</div>
                <p className="mt-1 text-sm text-[#0F1E3D]/58">Approved member accounts</p>
              </div>
              <CheckCircle2 className="size-5 text-[#C19A3D]" />
            </div>
          </div>

          <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#0F1E3D]/45">
              Admins
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-semibold text-[#0F1E3D]">{adminProfiles.length}</div>
                <p className="mt-1 text-sm text-[#0F1E3D]/58">Current admin accounts</p>
              </div>
              <Shield className="size-5 text-[#C19A3D]" />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-6 shadow-[0_16px_45px_rgba(15,30,61,0.08)] sm:p-7">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
            Review queue
          </p>
          <h2 className="mt-2 text-[1.5rem] font-semibold leading-none text-[#0F1E3D]">
            {allProfiles.length === 0
              ? "No members found"
              : `${allProfiles.length} member${allProfiles.length === 1 ? "" : "s"} in directory`}
          </h2>
        </div>

        <MembersClient profiles={allProfiles} />
      </section>
    </div>
  )
}
