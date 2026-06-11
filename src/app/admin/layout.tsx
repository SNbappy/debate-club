import Link from "next/link"
import { redirect } from "next/navigation"
import { Shield } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AdminSidebar } from "./admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url, is_admin")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="border-b border-[#0F1E3D]/8 bg-[linear-gradient(180deg,#081731_0%,#0D2244_55%,#14305B_100%)] text-white lg:min-h-screen lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col p-5 sm:p-6">
            <Link
              href="/admin"
              className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-4 backdrop-blur-md transition hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#F7E9BF] text-[#0F1E3D] shadow-[0_10px_30px_rgba(193,154,61,0.2)]">
                  <Shield className="size-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C19A3D]">
                    JUST Debate Club
                  </div>
                  <div className="mt-1 text-base font-semibold text-white">
                    Admin workspace
                  </div>
                </div>
              </div>
            </Link>

            <div className="mt-5 rounded-[24px] border border-white/10 bg-white/7 p-4 backdrop-blur-md">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                Signed in as
              </div>

              <div className="mt-4 flex items-center gap-3">
                <Avatar className="size-12 border border-white/10">
                  <AvatarImage
                    src={profile.avatar_url ?? undefined}
                    alt={profile.full_name ?? "Admin"}
                  />
                  <AvatarFallback className="bg-[#F7E9BF] font-semibold text-[#0F1E3D]">
                    {profile.full_name
                      ?.split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase() || "AD"}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-white">
                    {profile.full_name || "Administrator"}
                  </div>
                  <div className="truncate text-xs text-white/58">
                    {profile.email || user.email}
                  </div>
                </div>
              </div>
            </div>

            <AdminSidebar />

            <div className="mt-auto pt-6">
              <Link
                href="/dashboard"
                className="flex items-center justify-center rounded-[18px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/76 transition hover:bg-white/10 hover:text-white"
              >
                Back to member workspace
              </Link>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
