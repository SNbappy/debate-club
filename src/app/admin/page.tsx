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
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[28px] border border-[#0F1E3D]/10 bg-[linear-gradient(135deg,#081731_0%,#0D2244_50%,#14305B_100%)] p-6 text-white shadow-[0_24px_70px_rgba(8,17,38,0.18)] sm:p-7 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Admin workspace
            </p>
            <h1 className="mt-3 font-display text-[2.2rem] leading-none text-white sm:text-[2.55rem]">
              Overview
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">
              Review members, approve achievements, manage club content, issue certificates, and keep the debate club workspace organized from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(pendingMembers ?? 0) > 0 && (
              <Badge className="rounded-full bg-amber-100 px-3 py-1 text-amber-800 hover:bg-amber-100">
                {pendingMembers} pending members
              </Badge>
            )}
            {(pendingAchievements ?? 0) > 0 && (
              <Badge className="rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/10">
                {pendingAchievements} pending achievements
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-[22px] border border-white/10 bg-white/8 p-5 backdrop-blur-md">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/46">
              Members
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-semibold text-white">{totalMembers ?? 0}</div>
                <p className="mt-1 text-sm text-white/68">Registered accounts</p>
              </div>
              <Users className="size-5 text-[#C19A3D]" />
            </div>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-white/8 p-5 backdrop-blur-md">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/46">
              Review queue
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-semibold text-white">{pendingMembers ?? 0}</div>
                <p className="mt-1 text-sm text-white/68">Pending member approval</p>
              </div>
              <Shield className="size-5 text-[#C19A3D]" />
            </div>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-white/8 p-5 backdrop-blur-md">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/46">
              Achievement queue
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-semibold text-white">{pendingAchievements ?? 0}</div>
                <p className="mt-1 text-sm text-white/68">Awaiting review</p>
              </div>
              <Trophy className="size-5 text-[#C19A3D]" />
            </div>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-white/8 p-5 backdrop-blur-md">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/46">
              Certificates
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-semibold text-white">{totalCertificates ?? 0}</div>
                <p className="mt-1 text-sm text-white/68">Issued so far</p>
              </div>
              <Award className="size-5 text-[#C19A3D]" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[28px] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-6 shadow-[0_16px_45px_rgba(15,30,61,0.08)] sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
                Priority actions
              </p>
              <h2 className="mt-3 text-[1.7rem] font-semibold leading-none text-[#0F1E3D]">
                Review and publish
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#0F1E3D]/65">
                Keep member records accurate, review submitted achievements, and maintain the public-facing content library of the club.
              </p>
            </div>

            {((pendingMembers ?? 0) + (pendingAchievements ?? 0)) > 0 && (
              <Badge
                variant="outline"
                className="rounded-full border-amber-300 bg-amber-50 px-3 py-1 text-amber-700"
              >
                {(pendingMembers ?? 0) + (pendingAchievements ?? 0)} items need attention
              </Badge>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <QuickActionCard
              href="/admin/members"
              icon={Users}
              title="Manage members"
              description="Approve new signups, review account status, and grant admin access where needed."
              meta={`${pendingMembers ?? 0} pending`}
            />
            <QuickActionCard
              href="/admin/achievements"
              icon={Trophy}
              title="Review achievements"
              description="Approve or reject member-submitted results before they become visible publicly."
              meta={`${pendingAchievements ?? 0} pending`}
            />
            <QuickActionCard
              href="/admin/certificates"
              icon={Award}
              title="Issue certificates"
              description="Create certificate records, distribute links, and maintain verification-ready records."
              meta={`${totalCertificates ?? 0} issued`}
            />
            <QuickActionCard
              href="/admin/contact"
              icon={Mail}
              title="Open inbox"
              description="Review incoming contact messages and respond to public or member enquiries."
              meta={`${totalMessages ?? 0} messages`}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-6 shadow-[0_16px_45px_rgba(15,30,61,0.08)] sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Content status
            </p>
            <div className="mt-5 space-y-3">
              <StatusRow label="Posts" value={totalPosts ?? 0} icon={FileText} />
              <StatusRow label="Events" value={totalEvents ?? 0} icon={Calendar} />
              <StatusRow label="Gallery albums" value={totalGalleryAlbums ?? 0} icon={Images} />
              <StatusRow label="Certificates" value={totalCertificates ?? 0} icon={Award} />
            </div>
          </div>

          <div className="rounded-[28px] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-6 shadow-[0_16px_45px_rgba(15,30,61,0.08)] sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
              Shortcuts
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/admin/posts">
                <Button variant="outline" className="border-[#0F1E3D]/12">
                  Manage posts
                </Button>
              </Link>
              <Link href="/admin/events">
                <Button variant="outline" className="border-[#0F1E3D]/12">
                  Manage events
                </Button>
              </Link>
              <Link href="/admin/gallery">
                <Button variant="outline" className="border-[#0F1E3D]/12">
                  Manage gallery
                </Button>
              </Link>
            </div>

            <div className="mt-5 rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 text-[#C19A3D]" />
                <p className="text-sm leading-7 text-[#0F1E3D]/66">
                  The admin overview now acts as the central operations page for member review, achievement approval, content management, and certificate administration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
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
