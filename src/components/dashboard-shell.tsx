"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowRight,
  Award,
  FileBadge2,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  UserCircle2,
  X,
} from "lucide-react"

import type { User } from "@supabase/supabase-js"
import { signOut } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type DashboardShellProps = {
  children: React.ReactNode
  user: User | null
  profile: {
    id: string
    full_name: string | null
    slug: string | null
    avatar_url: string | null
    is_admin: boolean
  } | null
}

export function DashboardShell({
  children,
  user,
  profile,
}: DashboardShellProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Force scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
    setOpen(false)
  }, [pathname])

  const navItems = useMemo(() => {
    const items = [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/profile", label: "Profile", icon: UserCircle2 },
      { href: "/dashboard/achievements", label: "Achievements", icon: Award },
      { href: "/dashboard/certificates", label: "Certificates", icon: FileBadge2 },
    ]
    if (profile?.is_admin) {
      items.push({ href: "/admin", label: "Admin", icon: Shield })
    }
    return items
  }, [profile?.is_admin])

  const currentLabel =
    navItems.find((item) =>
      item.href === "/dashboard"
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(item.href + "/")
    )?.label ?? "Workspace"

  const initials =
    profile?.full_name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0]?.toUpperCase())
      .join("") || "JD"

  const renderUserCard = () => {
    return (
      <div className="rounded-[1.5rem] border border-white/10 bg-white/7 p-4 backdrop-blur-md">
        <p className="text-[10px] uppercase tracking-[0.24em] text-white/52">
          Signed in as
        </p>
        <div className="mt-3 flex items-center gap-3">
          <Avatar className="size-11 rounded-2xl border-2 border-[#C19A3D]/40">
            <AvatarImage
              src={profile?.avatar_url ?? undefined}
              alt={profile?.full_name ?? "Avatar"}
              className="rounded-2xl object-cover"
            />
            <AvatarFallback className="rounded-2xl bg-[#F6E7B8] text-sm font-semibold text-[#0F1E3D]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-white">
              {profile?.full_name || "Club member"}
            </div>
            <div className="truncate text-xs text-white/58">
              {user?.email}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTopBarAvatar = () => {
    return (
      <Avatar className="size-11 rounded-2xl border border-[#0F1E3D]/10 shadow-sm">
        <AvatarImage
          src={profile?.avatar_url ?? undefined}
          alt={profile?.full_name ?? "Avatar"}
          className="rounded-2xl object-cover"
        />
        <AvatarFallback className="rounded-2xl bg-white text-sm font-semibold text-[#0F1E3D]">
          {initials}
        </AvatarFallback>
      </Avatar>
    )
  }

  const renderNavLinks = (mobile = false) => {
    return (
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`group flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm transition-all ${
                active
                  ? "bg-[#F6E7B8] text-[#0F1E3D] shadow-[0_10px_30px_rgba(193,154,61,0.18)]"
                  : "text-white/74 hover:bg-white/8 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex size-9 items-center justify-center rounded-xl border transition-all ${
                    active
                      ? "border-[#C19A3D]/35 bg-white/70"
                      : "border-white/10 bg-white/5 group-hover:border-white/16 group-hover:bg-white/10"
                  }`}
                >
                  <Icon className="size-4" />
                </span>
                <span className="font-medium">{item.label}</span>
              </span>
              <ArrowRight
                className={`size-4 transition-all ${
                  active
                    ? "opacity-100"
                    : "translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                }`}
              />
            </Link>
          )
        })}

        {mobile ? (
          <form action={signOut} className="pt-3">
            <Button
              type="submit"
              variant="outline"
              className="w-full justify-center border-white/12 bg-white/6 text-white hover:bg-white/10 hover:text-white"
            >
              <LogOut className="mr-2 size-4" />
              Sign out
            </Button>
          </form>
        ) : null}
      </nav>
    )
  }

  return (
    <div className="min-h-screen bg-[#EEF2F6] text-[#0F1E3D]">
      <div className="flex min-h-screen">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[290px] border-r border-white/8 bg-[linear-gradient(180deg,#081731_0%,#0D2244_55%,#10284E_100%)] text-white lg:flex lg:flex-col lg:overflow-y-auto">
          <div className="flex h-full flex-col px-5 py-5">
            <Link href="/" className="flex items-center gap-3 rounded-2xl px-2 py-2">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-white/12 bg-white/8 shadow-[0_10px_30px_rgba(8,17,38,0.22)] backdrop-blur-md">
                <img
                  src="/logo.png"
                  alt="JUST Debate Club"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="truncate font-display text-[1.1rem] font-semibold tracking-tight text-white">
                  JUST Debate Club
                </div>
                <div className="truncate text-[10px] uppercase tracking-[0.24em] text-white/56">
                  Member workspace
                </div>
              </div>
            </Link>

            <div className="mt-8">
              {renderUserCard()}
            </div>

            <div className="mt-8 flex-1">
              {renderNavLinks()}
            </div>

            <div className="mt-6 space-y-3">
              {profile?.slug ? (
                <Link href={`/members/${profile.slug}`} target="_blank">
                  <Button className="w-full justify-center bg-[#C19A3D] text-black hover:bg-[#A88330]">
                    View public profile
                  </Button>
                </Link>
              ) : null}
              <form action={signOut}>
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full justify-center border-white/12 bg-white/6 text-white hover:bg-white/10 hover:text-white"
                >
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </Button>
              </form>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col lg:pl-[290px]">
          <header className="sticky top-0 z-30 border-b border-[#0F1E3D]/8 bg-[#EEF2F6]/88 backdrop-blur-xl">
            <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex size-11 items-center justify-center rounded-2xl border border-[#0F1E3D]/10 bg-white text-[#0F1E3D] shadow-sm lg:hidden"
                  aria-label="Open workspace menu"
                >
                  <Menu className="size-5" />
                </button>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
                    Dashboard
                  </p>
                  <h1 className="font-display text-[1.75rem] leading-none tracking-tight text-[#0F1E3D]">
                    {currentLabel}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <div className="text-sm font-medium text-[#0F1E3D]">
                    {profile?.full_name || "Club member"}
                  </div>
                  <div className="text-xs text-[#0F1E3D]/55">
                    {profile?.is_admin ? "Administrator" : "Member workspace"}
                  </div>
                </div>
                {renderTopBarAvatar()}
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-7xl">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </motion.div>
            </div>
          </main>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#0B1630]/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close workspace menu"
          />
          <div className="absolute inset-y-0 left-0 flex w-[88vw] max-w-[320px] flex-col bg-[linear-gradient(180deg,#081731_0%,#0D2244_55%,#10284E_100%)] p-5 text-white shadow-[18px_0_50px_rgba(8,17,38,0.32)]">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-2xl"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl border border-white/12 bg-white/8">
                  <img
                    src="/logo.png"
                    alt="JUST Debate Club"
                    className="h-7 w-7 object-contain"
                  />
                </div>
                <div>
                  <div className="font-display text-[1rem] font-semibold text-white">
                    JUST Debate Club
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-white/58">
                    Member workspace
                  </div>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-white"
                aria-label="Close workspace menu"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-8">
              {renderUserCard()}
            </div>

            <div className="mt-8 flex-1 overflow-y-auto">
              {renderNavLinks(true)}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
