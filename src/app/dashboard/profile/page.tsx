import { redirect } from "next/navigation"
import { BadgeCheck, Globe2, ShieldCheck, UserCircle2 } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { ProfileForm } from "./profile-form"

export default async function DashboardProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) {
    redirect("/login")
  }

  const completionItems = [
    Boolean(profile.full_name),
    Boolean(profile.slug),
    Boolean(profile.bio),
    Boolean(profile.avatar_url),
  ]
  const completionCount = completionItems.filter(Boolean).length
  const completionPercent = Math.round((completionCount / completionItems.length) * 100)

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[28px] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-6 shadow-[0_18px_50px_rgba(15,30,61,0.08)] sm:p-7 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Member profile
            </p>
            <h1 className="mt-3 font-display text-[2.15rem] leading-none text-[#0F1E3D] sm:text-[2.45rem]">
              Edit profile
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#0F1E3D]/65">
              Update your member details so your workspace account and public profile stay complete, accurate, and ready for admin approval.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.is_verified ? (
              <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 hover:bg-emerald-100">
                <BadgeCheck className="mr-1.5 size-3.5" />
                Verified
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="rounded-full border-amber-300 bg-amber-50 px-3 py-1 text-amber-700"
              >
                Pending approval
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#0F1E3D]/45">
              Completion
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-semibold text-[#0F1E3D]">{completionPercent}%</div>
                <p className="mt-1 text-sm text-[#0F1E3D]/58">Profile readiness</p>
              </div>
              <UserCircle2 className="size-5 text-[#C19A3D]" />
            </div>
          </div>

          <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#0F1E3D]/45">
              Public URL
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-[#0F1E3D]">
                  {profile.slug ? `/members/${profile.slug}` : "Not set yet"}
                </div>
                <p className="mt-1 text-sm text-[#0F1E3D]/58">Member profile route</p>
              </div>
              <Globe2 className="size-5 text-[#C19A3D]" />
            </div>
          </div>

          <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#0F1E3D]/45">
              Verification
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-[#0F1E3D]">
                  {profile.is_verified ? "Approved by admin" : "Awaiting admin review"}
                </div>
                <p className="mt-1 text-sm text-[#0F1E3D]/58">
                  Public visibility depends on approval
                </p>
              </div>
              <ShieldCheck className="size-5 text-[#C19A3D]" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-6 shadow-[0_16px_45px_rgba(15,30,61,0.08)] sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Checklist
            </p>
            <p className="mt-3 text-sm leading-7 text-[#0F1E3D]/62">
              Complete all four items to reach 100% readiness and make your profile approval-ready.
            </p>

            <div className="mt-5 space-y-3 text-sm text-[#0F1E3D]/68">
              <div className="flex items-center justify-between gap-4 rounded-[18px] border border-[#0F1E3D]/8 bg-white px-4 py-3">
                <span>Full name added</span>
                <span className={profile.full_name ? "font-medium text-emerald-600" : "font-medium text-amber-600"}>
                  {profile.full_name ? "Done" : "Missing"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-[18px] border border-[#0F1E3D]/8 bg-white px-4 py-3">
                <span>Profile slug set</span>
                <span className={profile.slug ? "font-medium text-emerald-600" : "font-medium text-amber-600"}>
                  {profile.slug ? "Done" : "Missing"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-[18px] border border-[#0F1E3D]/8 bg-white px-4 py-3">
                <span>Bio written</span>
                <span className={profile.bio ? "font-medium text-emerald-600" : "font-medium text-amber-600"}>
                  {profile.bio ? "Done" : "Missing"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-[18px] border border-[#0F1E3D]/8 bg-white px-4 py-3">
                <span>Profile photo uploaded</span>
                <span className={profile.avatar_url ? "font-medium text-emerald-600" : "font-medium text-amber-600"}>
                  {profile.avatar_url ? "Done" : "Missing"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-6 shadow-[0_16px_45px_rgba(15,30,61,0.08)] sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Public profile
            </p>
            <h2 className="mt-3 text-[1.25rem] font-semibold leading-tight text-[#0F1E3D]">
              Visibility and approval
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#0F1E3D]/62">
              Your public member page becomes visible once your profile is verified by an admin.
            </p>

            <div className="mt-5 rounded-[22px] border border-[#0F1E3D]/8 bg-white p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#0F1E3D]/45">
                Public URL
              </p>
              <div className="mt-2 text-sm font-medium text-[#0F1E3D]">
                {profile.slug
                  ? `/members/${profile.slug}`
                  : "Set your slug below to generate a public member URL."}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-6 shadow-[0_16px_45px_rgba(15,30,61,0.08)] sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
            Personal details
          </p>
          <h2 className="mt-3 text-[1.7rem] font-semibold leading-none text-[#0F1E3D]">
            Update your information
          </h2>
          <p className="mt-3 mb-6 max-w-2xl text-sm leading-7 text-[#0F1E3D]/65">
            Fill in your member details below. Your avatar, bio, department, social links, and contact preferences are all managed from this single form.
          </p>

          <ProfileForm profile={profile} />
        </div>
      </section>
    </div>
  )
}
