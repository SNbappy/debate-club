import Link from "next/link"
import { ArrowRight, Award, Calendar, CheckCircle2, FileText, Images, Mail, Shield, Trophy, Users } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  const [
    { count: totalMembers },
    { count: pendingMembers },
    { count: pendingAchievements },
    { count: totalCertificates },
    { count: totalPosts },
    { count: totalEvents },
    { count: totalGalleryAlbums },
    { count: totalMessages },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_verified", false),
    supabase.from("achievements").select("*", { count: "exact", head: true }).eq("is_verified", false),
    supabase.from("certificates").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("gallery_albums").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
  ])

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F1E3D]">
          Admin Panel
        </h2>
        <p className="mt-1.5 text-sm text-[#0F1E3D]/50 font-medium">
          Review registrations, verify achievements, and manage club content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pending Members Card */}
        <div className="rounded-2xl border border-[#0F1E3D]/8 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0F1E3D]/40">Pending Members</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-2xl font-bold text-[#0F1E3D]">{pendingMembers ?? 0}</span>
            <Users className="size-5 text-[#C19A3D]" />
          </div>
        </div>

        {/* Pending Achievements Card */}
        <div className="rounded-2xl border border-[#0F1E3D]/8 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0F1E3D]/40">Pending Achievements</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-2xl font-bold text-[#0F1E3D]">{pendingAchievements ?? 0}</span>
            <Trophy className="size-5 text-[#C19A3D]" />
          </div>
        </div>

        {/* Total Members Card */}
        <div className="rounded-2xl border border-[#0F1E3D]/8 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0F1E3D]/40">Total Members</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-2xl font-bold text-[#0F1E3D]">{totalMembers ?? 0}</span>
            <Shield className="size-5 text-[#C19A3D]" />
          </div>
        </div>

        {/* Total Certificates Card */}
        <div className="rounded-2xl border border-[#0F1E3D]/8 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0F1E3D]/40">Total Certificates</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-2xl font-bold text-[#0F1E3D]">{totalCertificates ?? 0}</span>
            <Award className="size-5 text-[#C19A3D]" />
          </div>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Manage Members */}
        <Link
          href="/admin/members"
          className="group flex flex-col justify-between rounded-3xl border border-[#0F1E3D]/8 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C19A3D]/40 hover:shadow-md"
        >
          <div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#C19A3D]/10 text-[#C19A3D]">
              <Users className="size-6" />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold text-[#0F1E3D]">
              Manage Members
            </h3>
            <p className="mt-2 text-sm text-[#0F1E3D]/50 leading-relaxed">
              Approve pending registration requests, edit profiles, or adjust roles.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-[#0F1E3D]/5 pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C19A3D]">
              {pendingMembers && pendingMembers > 0 ? `${pendingMembers} pending approvals` : "All approvals done"}
            </span>
            <ArrowRight className="size-4 text-[#0F1E3D]/40 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Review Achievements */}
        <Link
          href="/admin/achievements"
          className="group flex flex-col justify-between rounded-3xl border border-[#0F1E3D]/8 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C19A3D]/40 hover:shadow-md"
        >
          <div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#C19A3D]/10 text-[#C19A3D]">
              <Trophy className="size-6" />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold text-[#0F1E3D]">
              Review Achievements
            </h3>
            <p className="mt-2 text-sm text-[#0F1E3D]/50 leading-relaxed">
              Verify tournament wins, speaker rankings, or certifications submitted by club members.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-[#0F1E3D]/5 pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C19A3D]">
              {pendingAchievements && pendingAchievements > 0 ? `${pendingAchievements} pending approvals` : "All approvals done"}
            </span>
            <ArrowRight className="size-4 text-[#0F1E3D]/40 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Issue Certificates */}
        <Link
          href="/admin/certificates"
          className="group flex flex-col justify-between rounded-3xl border border-[#0F1E3D]/8 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C19A3D]/40 hover:shadow-md"
        >
          <div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#C19A3D]/10 text-[#C19A3D]">
              <Award className="size-6" />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold text-[#0F1E3D]">
              Issue Certificates
            </h3>
            <p className="mt-2 text-sm text-[#0F1E3D]/50 leading-relaxed">
              Distribute digital credentials and maintain club certification records.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-[#0F1E3D]/5 pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C19A3D]">
              Open certificates workspace
            </span>
            <ArrowRight className="size-4 text-[#0F1E3D]/40 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Open Inbox */}
        <Link
          href="/admin/contact"
          className="group flex flex-col justify-between rounded-3xl border border-[#0F1E3D]/8 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C19A3D]/40 hover:shadow-md"
        >
          <div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#C19A3D]/10 text-[#C19A3D]">
              <Mail className="size-6" />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold text-[#0F1E3D]">
              Inbox Messages
            </h3>
            <p className="mt-2 text-sm text-[#0F1E3D]/50 leading-relaxed">
              View and respond to inquiries submitted through the contact page.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-[#0F1E3D]/5 pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C19A3D]">
              {totalMessages ?? 0} messages total
            </span>
            <ArrowRight className="size-4 text-[#0F1E3D]/40 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Content Management Card */}
        <div className="rounded-3xl border border-[#0F1E3D]/8 bg-white p-6 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-[#0F1E3D]">
              Content Management
            </h3>
          </div>
          <p className="mt-2 text-sm text-[#0F1E3D]/50">
            Select a category shortcut below to manage site posts, schedule upcoming events, or add gallery media albums.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Link
              href="/admin/posts"
              className="group flex flex-col justify-between rounded-2xl border border-[#0F1E3D]/8 bg-white/50 p-4 transition-all hover:border-[#C19A3D]/40 hover:shadow-sm"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F1E3D]/40">Posts</span>
                <p className="mt-2 text-2xl font-bold text-[#0F1E3D]">{totalPosts ?? 0}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#C19A3D] group-hover:translate-x-0.5 transition-transform">
                Manage Posts →
              </span>
            </Link>

            <Link
              href="/admin/events"
              className="group flex flex-col justify-between rounded-2xl border border-[#0F1E3D]/8 bg-white/50 p-4 transition-all hover:border-[#C19A3D]/40 hover:shadow-sm"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F1E3D]/40">Events</span>
                <p className="mt-2 text-2xl font-bold text-[#0F1E3D]">{totalEvents ?? 0}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#C19A3D] group-hover:translate-x-0.5 transition-transform">
                Manage Events →
              </span>
            </Link>

            <Link
              href="/admin/gallery"
              className="group flex flex-col justify-between rounded-2xl border border-[#0F1E3D]/8 bg-white/50 p-4 transition-all hover:border-[#C19A3D]/40 hover:shadow-sm"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F1E3D]/40">Albums</span>
                <p className="mt-2 text-2xl font-bold text-[#0F1E3D]">{totalGalleryAlbums ?? 0}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#C19A3D] group-hover:translate-x-0.5 transition-transform">
                Manage Gallery →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickActionCard({
  href,
  icon: Icon,
  title,
  description,
  meta,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  meta: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-[22px] border border-[#0F1E3D]/8 bg-white px-4 py-4 transition-all hover:border-[#C19A3D]/35 hover:shadow-[0_14px_35px_rgba(15,30,61,0.08)]"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-[#F7E9BF] text-[#0F1E3D]">
          <Icon className="size-5" />
        </div>
        <div>
          <div className="text-sm font-medium text-[#0F1E3D]">{title}</div>
          <div className="text-sm text-[#0F1E3D]/58">{description}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="hidden text-xs font-medium text-[#0F1E3D]/45 sm:inline">
          {meta}
        </span>
        <ArrowRight className="size-5 text-[#0F1E3D]/34 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

function StatusRow({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="flex items-center justify-between rounded-[18px] border border-[#0F1E3D]/8 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-[#F7E9BF] text-[#0F1E3D]">
          <Icon className="size-4" />
        </div>
        <span className="text-sm font-medium text-[#0F1E3D]">{label}</span>
      </div>

      <span className="text-sm font-semibold text-[#0F1E3D]/65">{value}</span>
    </div>
  )
}
