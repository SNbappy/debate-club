"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, Menu, Shield, X } from "lucide-react"

import type { User } from "@supabase/supabase-js"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/app/admin/admin-sidebar"

type AdminShellProps = {
  children: React.ReactNode
  user: User | null
  profile: {
    id: string
    full_name: string | null
    email: string | null
    avatar_url: string | null
    is_admin: boolean
  } | null
}

export function AdminShell({ children, user, profile }: AdminShellProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Force scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
    setOpen(false)
  }, [pathname])

  const initials =
    profile?.full_name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "AD"

  const renderUserCard = () => (
    <div className="rounded-[24px] border border-white/10 bg-white/7 p-4 backdrop-blur-md">
      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
        Signed in as
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Avatar className="size-11 border border-white/10">
          <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? "Admin"} className="object-cover" />
          <AvatarFallback className="bg-[#F7E9BF] font-semibold text-[#0F1E3D]">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-white">
            {profile?.full_name || "Administrator"}
          </div>
          <div className="truncate text-xs text-white/58">
            {profile?.email || user?.email}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-[#0F1E3D]">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[290px] border-r border-[#0F1E3D]/8 bg-[linear-gradient(180deg,#081731_0%,#0D2244_55%,#14305B_100%)] text-white lg:flex lg:flex-col lg:overflow-y-auto no-scrollbar">
          <div className="flex h-full flex-col p-5 sm:p-6">
            <Link
              href="/admin"
              className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-4 backdrop-blur-md transition hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-[#F7E9BF] text-[#0F1E3D] shadow-[0_10px_30px_rgba(193,154,61,0.2)]">
                  <Shield className="size-5" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#C19A3D] leading-none">
                    JUST Debate Club
                  </div>
                  <div className="mt-1 text-sm font-bold text-white">
                    Admin Workspace
                  </div>
                </div>
              </div>
            </Link>

            <div className="mt-6">{renderUserCard()}</div>

            <div className="mt-6 flex-1">
              <AdminSidebar />
            </div>

            <div className="mt-auto pt-6">
              <Link
                href="/dashboard"
                className="flex items-center justify-center rounded-[18px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/76 transition hover:bg-white/10 hover:text-white"
              >
                Back to workspace
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex min-h-screen flex-1 flex-col lg:pl-[290px]">
          {/* Mobile Header */}
          <header className="sticky top-0 z-30 border-b border-[#0F1E3D]/8 bg-[#F6F7FB]/88 backdrop-blur-xl lg:hidden">
            <div className="flex h-[72px] items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex size-11 items-center justify-center rounded-2xl border border-[#0F1E3D]/10 bg-white text-[#0F1E3D] shadow-sm"
                  aria-label="Open admin menu"
                >
                  <Menu className="size-5" />
                </button>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
                    Admin Panel
                  </p>
                  <h1 className="font-display text-[1.45rem] leading-none tracking-tight text-[#0F1E3D]">
                    Workspace
                  </h1>
                </div>
              </div>

              <Avatar className="size-10 border border-[#0F1E3D]/10 shadow-sm">
                <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? "Admin"} className="object-cover" />
                <AvatarFallback className="bg-white font-semibold text-[#0F1E3D]">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="w-full max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#0B1630]/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close admin menu"
          />
          <div className="absolute inset-y-0 left-0 flex w-[88vw] max-w-[320px] flex-col bg-[linear-gradient(180deg,#081731_0%,#0D2244_55%,#14305B_100%)] p-5 text-white shadow-[18px_0_50px_rgba(8,17,38,0.32)]">
            <div className="flex items-center justify-between">
              <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl border border-white/12 bg-white/8">
                  <Shield className="size-5 text-[#C19A3D]" />
                </div>
                <div>
                  <div className="font-display text-[1rem] font-semibold text-white">
                    Admin Panel
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-white/58">
                    JUST Debate Club
                  </div>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-white"
                aria-label="Close admin menu"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-6">{renderUserCard()}</div>

            <div className="mt-6 flex-1 overflow-y-auto">
              <AdminSidebar />
            </div>

            <div className="mt-auto pt-6">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-[18px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/76 transition hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="mr-2 size-4" />
                Back to workspace
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
