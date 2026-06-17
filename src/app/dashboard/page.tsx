import Link from "next/link"
import { redirect } from "next/navigation"
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Clock,
  FileBadge2,
  Globe,
  Shield,
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

  const [{ count: certCount }] =
    await Promise.all([
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
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F1E3D]">
          Welcome back, {profile?.full_name?.split(" ")[0] || "Member"}
        </h2>
        <p className="mt-1.5 text-sm text-[#0F1E3D]/50 font-medium">
          Here is your debate workspace overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Account Status Card */}
        <div className="rounded-2xl border border-[#0F1E3D]/8 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0F1E3D]/40">Status</p>
          <div className="mt-3 flex items-center justify-between">
            {profile?.is_verified ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                <BadgeCheck className="size-4" />
                Verified Member
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600">
                <Clock className="size-4 animate-pulse" />
                Pending Approval
              </span>
            )}
          </div>
        </div>

        {/* Profile Completion Card */}
        <div className="rounded-2xl border border-[#0F1E3D]/8 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0F1E3D]/40">Completion</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-2xl font-bold text-[#0F1E3D]">{completionPercent}%</span>
            <UserCircle2 className="size-5 text-[#C19A3D]" />
          </div>
        </div>

        {/* Certificates Card */}
        <div className="rounded-2xl border border-[#0F1E3D]/8 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0F1E3D]/40">Certificates</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-2xl font-bold text-[#0F1E3D]">{certCount ?? 0}</span>
            <FileBadge2 className="size-5 text-[#C19A3D]" />
          </div>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Details Card */}
        <Link
          href="/dashboard/profile"
          className="group flex flex-col justify-between rounded-3xl border border-[#0F1E3D]/8 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C19A3D]/40 hover:shadow-md"
        >
          <div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#C19A3D]/10 text-[#C19A3D]">
              <UserCircle2 className="size-6" />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold text-[#0F1E3D]">
              Profile Details
            </h3>
            <p className="mt-2 text-sm text-[#0F1E3D]/50 leading-relaxed">
              Update your biography, department, admission session, and profile picture.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-[#0F1E3D]/5 pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C19A3D]">
              Edit Profile
            </span>
            <ArrowRight className="size-4 text-[#0F1E3D]/40 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Certificates Card */}
        <Link
          href="/dashboard/certificates"
          className="group flex flex-col justify-between rounded-3xl border border-[#0F1E3D]/8 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C19A3D]/40 hover:shadow-md"
        >
          <div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#C19A3D]/10 text-[#C19A3D]">
              <FileBadge2 className="size-6" />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold text-[#0F1E3D]">
              My Certificates
            </h3>
            <p className="mt-2 text-sm text-[#0F1E3D]/50 leading-relaxed">
              View and copy verification links for all debate club certificates issued to you.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-[#0F1E3D]/5 pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C19A3D]">
              Open Certificates
            </span>
            <ArrowRight className="size-4 text-[#0F1E3D]/40 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Public Profile Card */}
        {profile?.is_verified && profile?.slug ? (
          <Link
            href={`/members/${profile.slug}`}
            target="_blank"
            className="group flex flex-col justify-between rounded-3xl border border-[#0F1E3D]/8 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C19A3D]/40 hover:shadow-md"
          >
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#C19A3D]/10 text-[#C19A3D]">
                <Globe className="size-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-[#0F1E3D]">
                Public Profile
              </h3>
              <p className="mt-2 text-sm text-[#0F1E3D]/50 leading-relaxed">
                View your live public-facing profile in the university member directory.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[#0F1E3D]/5 pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C19A3D]">
                View Live Page
              </span>
              <ArrowRight className="size-4 text-[#0F1E3D]/40 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ) : (
          <div className="flex flex-col justify-between rounded-3xl border border-dashed border-[#0F1E3D]/15 bg-white/50 p-6 shadow-sm">
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#0F1E3D]/5 text-[#0F1E3D]/40">
                <Globe className="size-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-[#0F1E3D]/40">
                Directory Profile
              </h3>
              <p className="mt-2 text-sm text-[#0F1E3D]/40 leading-relaxed">
                Your directory profile page will become active once your account is fully verified.
              </p>
            </div>
            <div className="mt-6 border-t border-[#0F1E3D]/5 pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F1E3D]/40">
                Awaiting Verification
              </span>
            </div>
          </div>
        )}

        {/* Admin Workspace Card (Only shown to admins) */}
        {profile?.is_admin && (
          <Link
            href="/admin"
            className="group flex flex-col justify-between rounded-3xl border border-[#C19A3D]/30 bg-[#FFFDF8] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C19A3D]/60 hover:shadow-md md:col-span-2"
          >
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#C19A3D] text-black">
                <Shield className="size-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-[#0F1E3D]">
                Admin Panel
              </h3>
              <p className="mt-2 text-sm text-[#0F1E3D]/60 leading-relaxed">
                Manage club registrations, verify member profiles, approve achievements, and issue verified certificates.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[#C19A3D]/20 pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C19A3D]">
                Open Admin Workspace
              </span>
              <ArrowRight className="size-4 text-[#C19A3D] transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
