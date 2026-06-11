import Link from "next/link"
import { redirect } from "next/navigation"
import {
  ArrowRight,
  Award,
  BadgeCheck,
  FileBadge2,
  PencilLine,
  Shield,
  Sparkles,
  Trophy,
  UserCircle2,
} from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const [{ count: achCount }, { count: pendingAch }, { count: certCount }] =
    await Promise.all([
      supabase
        .from("achievements")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", user.id),
      supabase
        .from("achievements")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", user.id)
        .eq("is_verified", false),
      supabase
        .from("certificates")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", user.id),
    ])

  const completionItems = [
    Boolean(profile?.full_name),
    Boolean(profile?.slug),
    Boolean(profile?.bio),
    Boolean(profile?.avatar_url),
  ]

  const completionCount = completionItems.filter(Boolean).length
  const completionPercent = Math.round((completionCount / completionItems.length) * 100)

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-[#0F1E3D]/10 bg-[linear-gradient(135deg,#081731_0%,#0D2244_50%,#14305B_100%)] text-white shadow-[0_24px_70px_rgba(8,17,38,0.18)]">
        <div className="relative px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(193,154,61,0.16),transparent_20%),radial-gradient(circle_at_84%_18%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(8,17,38,0.48),transparent_44%)]" />

          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/82 backdrop-blur-md">
                <Sparkles className="size-3.5 text-[#C19A3D]" />
                Member workspace
              </div>

              <h2 className="mt-5 max-w-[12ch] font-display text-[2.7rem] leading-[0.93] tracking-[-0.04em] sm:text-[3.2rem] lg:text-[4rem]">
                Welcome back, {profile?.full_name?.split(" ")[0] || "member"}.
              </h2>

              <p className="mt-4 max-w-2xl text-[0.98rem] leading-8 text-white/74 sm:text-[1.02rem]">
                Manage your public member profile, track achievements, review issued certificates, and keep your club presence ready for verification and publication.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/dashboard/profile">
                  <Button className="bg-[#C19A3D] text-black hover:bg-[#A88330]">
                    <PencilLine className="mr-2 size-4" />
                    Update profile
                  </Button>
                </Link>

                <Link href="/dashboard/achievements">
                  <Button
                    variant="outline"
                    className="border-white/12 bg-white/8 text-white hover:bg-white/12 hover:text-white"
                  >
                    <Trophy className="mr-2 size-4" />
                    Manage achievements
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur-md">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/52">
                  Profile
                </p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-3xl font-semibold text-white">{completionPercent}%</div>
                    <p className="mt-1 text-sm text-white/68">Completion status</p>
                  </div>
                  <UserCircle2 className="size-5 text-[#C19A3D]" />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur-md">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/52">
                  Achievements
                </p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-3xl font-semibold text-white">{achCount ?? 0}</div>
                    <p className="mt-1 text-sm text-white/68">{pendingAch ?? 0} pending review</p>
                  </div>
                  <Award className="size-5 text-[#C19A3D]" />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur-md">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/52">
                  Certificates
                </p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-3xl font-semibold text-white">{certCount ?? 0}</div>
                    <p className="mt-1 text-sm text-white/68">Issued to your account</p>
                  </div>
                  <FileBadge2 className="size-5 text-[#C19A3D]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-6 shadow-[0_16px_45px_rgba(15,30,61,0.08)] sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
                Profile status
              </p>
              <h3 className="mt-3 font-display text-[2rem] leading-none text-[#0F1E3D]">
                {profile?.is_verified ? "Public profile active" : "Verification pending"}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#0F1E3D]/65">
                {profile?.is_verified
                  ? "Your member profile is verified and visible publicly. Keep your information updated so achievements and credentials stay current."
                  : "Your profile is waiting for admin approval. Make sure your profile details and avatar are complete so the verification process stays smooth."}
              </p>
            </div>

            <div>
              {profile?.is_verified ? (
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

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.25rem] border border-[#0F1E3D]/8 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#0F1E3D]">Public profile</p>
                  <p className="mt-1 text-sm leading-6 text-[#0F1E3D]/58">
                    {profile?.slug
                      ? `/members/${profile.slug}`
                      : "Set your profile slug to create a public member URL."}
                  </p>
                </div>
                <UserCircle2 className="size-5 text-[#C19A3D]" />
              </div>

              <div className="mt-4">
                {profile?.is_verified && profile?.slug ? (
                  <Link href={`/members/${profile.slug}`} target="_blank">
                    <Button variant="outline" className="border-[#0F1E3D]/12">
                      View public profile
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard/profile">
                    <Button variant="outline" className="border-[#0F1E3D]/12">
                      Complete profile
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-[#0F1E3D]/8 bg-white p-5">
              <p className="text-sm font-medium text-[#0F1E3D]">Completion checklist</p>
              <div className="mt-4 space-y-3 text-sm text-[#0F1E3D]/68">
                <div className="flex items-center justify-between gap-4">
                  <span>Full name added</span>
                  <span className={profile?.full_name ? "text-emerald-600" : "text-amber-600"}>
                    {profile?.full_name ? "Done" : "Missing"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Public slug set</span>
                  <span className={profile?.slug ? "text-emerald-600" : "text-amber-600"}>
                    {profile?.slug ? "Done" : "Missing"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Bio written</span>
                  <span className={profile?.bio ? "text-emerald-600" : "text-amber-600"}>
                    {profile?.bio ? "Done" : "Missing"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Profile photo uploaded</span>
                  <span className={profile?.avatar_url ? "text-emerald-600" : "text-amber-600"}>
                    {profile?.avatar_url ? "Done" : "Missing"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-6 shadow-[0_16px_45px_rgba(15,30,61,0.08)] sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
            Workspace actions
          </p>
          <h3 className="mt-3 font-display text-[2rem] leading-none text-[#0F1E3D]">
            Keep your member presence current.
          </h3>
          <p className="mt-3 text-sm leading-7 text-[#0F1E3D]/65">
            Use the workspace below to keep your profile polished, your debate record updated, and your issued credentials easy to access.
          </p>

          <div className="mt-6 space-y-4">
            <Link
              href="/dashboard/profile"
              className="group flex items-center justify-between rounded-[1.25rem] border border-[#0F1E3D]/8 bg-white px-4 py-4 transition-all hover:border-[#C19A3D]/40 hover:shadow-[0_14px_35px_rgba(15,30,61,0.08)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-[#F7E9BF] text-[#0F1E3D]">
                  <PencilLine className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0F1E3D]">Edit profile</div>
                  <div className="text-sm text-[#0F1E3D]/58">
                    Update personal details, slug, bio, and avatar.
                  </div>
                </div>
              </div>
              <ArrowRight className="size-5 text-[#0F1E3D]/38 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/dashboard/achievements"
              className="group flex items-center justify-between rounded-[1.25rem] border border-[#0F1E3D]/8 bg-white px-4 py-4 transition-all hover:border-[#C19A3D]/40 hover:shadow-[0_14px_35px_rgba(15,30,61,0.08)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-[#F7E9BF] text-[#0F1E3D]">
                  <Trophy className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0F1E3D]">Manage achievements</div>
                  <div className="text-sm text-[#0F1E3D]/58">
                    Add tournament wins, participation, and verified results.
                  </div>
                </div>
              </div>
              <ArrowRight className="size-5 text-[#0F1E3D]/38 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/dashboard/certificates"
              className="group flex items-center justify-between rounded-[1.25rem] border border-[#0F1E3D]/8 bg-white px-4 py-4 transition-all hover:border-[#C19A3D]/40 hover:shadow-[0_14px_35px_rgba(15,30,61,0.08)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-[#F7E9BF] text-[#0F1E3D]">
                  <FileBadge2 className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0F1E3D]">Open certificates</div>
                  <div className="text-sm text-[#0F1E3D]/58">
                    Review issued certificates and verification links.
                  </div>
                </div>
              </div>
              <ArrowRight className="size-5 text-[#0F1E3D]/38 transition-transform group-hover:translate-x-1" />
            </Link>

            {profile?.is_admin ? (
              <Link
                href="/admin"
                className="group flex items-center justify-between rounded-[1.25rem] border border-[#C19A3D]/30 bg-[#FFF8E8] px-4 py-4 transition-all hover:shadow-[0_14px_35px_rgba(15,30,61,0.08)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-[#C19A3D] text-black">
                    <Shield className="size-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0F1E3D]">Open admin workspace</div>
                    <div className="text-sm text-[#0F1E3D]/58">
                      Verify members, review submissions, and issue certificates.
                    </div>
                  </div>
                </div>
                <ArrowRight className="size-5 text-[#0F1E3D]/38 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}
