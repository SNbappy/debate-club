"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@supabase/supabase-js"
import { signOut } from "@/lib/actions/auth"
import { Menu, X, LogOut, User as UserIcon, LayoutDashboard, ChevronRight } from "lucide-react"

const HIDDEN = ["/login", "/signup", "/forgot-password", "/reset-password", "/dashboard", "/admin", "/verify"]
const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/members", label: "Members" },
  { href: "/achievements", label: "Achievements" },
  { href: "/posts", label: "Posts" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
]

export function SiteNav({
  user,
  profile,
}: {
  user: User | null
  profile: {
    id: string
    full_name: string | null
    slug: string | null
    avatar_url: string | null
    is_admin: boolean
  } | null
}) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false)
    }, 0)
    return () => clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (HIDDEN.some((p) => pathname === p || pathname.startsWith(p + "/"))) return null

  const transparent = pathname === "/" && !scrolled

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          transparent
            ? "bg-transparent"
            : "bg-white/94 border-b border-[#0F1E3D]/8 backdrop-blur-xl shadow-[0_4px_24px_rgba(15,30,61,0.07)]"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 sm:px-6 ${
            transparent ? "h-20 sm:h-[88px]" : "h-[60px] sm:h-16"
          }`}
        >
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3">
            <img
              src="/logo.png"
              alt="JUSTDC"
              className={`shrink-0 rounded-full transition-all duration-500 ${
                transparent ? "size-11 sm:size-12" : "size-8 sm:size-9"
              }`}
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.display = "none"
              }}
            />
            <div
              className={`min-w-0 leading-tight transition-all duration-500 ${
                transparent ? "text-white" : "text-[#0F1E3D]"
              }`}
            >
              <div
                className={`font-display truncate font-bold tracking-tight transition-all duration-500 ${
                  transparent 
                    ? "text-[1.15rem] min-[375px]:text-[1.35rem] leading-none sm:text-[1.9rem]" 
                    : "text-[0.9rem] min-[375px]:text-[0.95rem] sm:text-[1.15rem]"
                }`}
              >
                JUST Debate Club
              </div>
              <div
                className={`uppercase tracking-[0.28em] transition-all duration-500 ${
                  transparent ? "mt-0.5 text-[10px] opacity-70 sm:text-[11px]" : "text-[8px] opacity-55 sm:text-[9px]"
                }`}
              >
                JUSTDC
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full transition-all duration-300 ${
                    transparent ? "px-5 py-2.5 text-[1rem] font-semibold" : "px-4 py-2 text-sm font-medium"
                  } ${
                    active
                      ? transparent
                        ? "border border-white/15 bg-white/18 text-white"
                        : "bg-[#0F1E3D] text-white"
                      : transparent
                        ? "text-white/90 hover:bg-white/10 hover:text-white"
                        : "text-[#0F1E3D]/75 hover:bg-[#FDF8EE] hover:text-[#0F1E3D]"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={`inline-flex shrink-0 items-center justify-center rounded-full outline-none transition-all duration-500 focus-visible:ring-2 focus-visible:ring-[#C19A3D]/50 focus-visible:ring-offset-2 ${
                      transparent ? "size-10 ring-offset-transparent" : "size-9 ring-offset-white"
                    }`}
                  >
                    <Avatar
                      className={`size-full border-2 transition-all duration-500 ${
                        transparent ? "border-white/35" : "border-[#0F1E3D]/10"
                      }`}
                    >
                      <AvatarImage src={profile?.avatar_url ?? undefined} />
                      <AvatarFallback className="bg-[#C19A3D] text-sm font-bold text-black">
                        {profile?.full_name?.slice(0, 2)?.toUpperCase() ?? "??"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  side="bottom"
                  sideOffset={10}
                  className="w-64 rounded-[22px] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-1.5 shadow-[0_18px_48px_rgba(15,30,61,0.18)]"
                >
                  <div className="px-4 py-3 text-sm">
                    <div className="font-semibold text-[#0F1E3D]">{profile?.full_name ?? "Member"}</div>
                    <div className="truncate text-xs text-[#0F1E3D]/55">{user.email}</div>
                  </div>

                  <DropdownMenuSeparator className="bg-[#0F1E3D]/10" />

                  <DropdownMenuItem asChild className="rounded-2xl px-4 py-3 text-[#0F1E3D]">
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 size-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  {profile?.slug && (
                    <DropdownMenuItem asChild className="rounded-2xl px-4 py-3 text-[#0F1E3D]">
                      <Link href={`/members/${profile.slug}`} className="cursor-pointer">
                        <UserIcon className="mr-2 size-4" />
                        My profile
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="bg-[#0F1E3D]/10" />

                  <form action={signOut}>
                    <button type="submit" className="w-full text-left">
                      <DropdownMenuItem className="rounded-2xl px-4 py-3 text-red-600 focus:bg-red-50 focus:text-red-700">
                        <LogOut className="mr-2 size-4" />
                        Sign out
                      </DropdownMenuItem>
                    </button>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className={`transition-all duration-500 ${
                      transparent
                        ? "h-10 px-4 text-[1rem] font-medium text-white hover:bg-white/10 hover:text-white"
                        : "h-9 px-4 text-sm"
                    }`}
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    className={`bg-[#C19A3D] text-black font-semibold transition-all duration-500 hover:bg-[#A88330] ${
                      transparent ? "h-10 px-6 text-[1rem]" : "h-9 px-5 text-sm"
                    }`}
                  >
                    Join us
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close menu" : "Open menu"}
            className={`relative z-[60] flex size-11 items-center justify-center rounded-full transition-colors duration-200 lg:hidden ${
              open
                ? "bg-[#0F1E3D] text-white"
                : transparent
                  ? "text-white hover:bg-white/10"
                  : "text-[#0F1E3D] hover:bg-[#FDF8EE]"
            }`}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence initial={false}>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-[#0F1E3D]/55 lg:hidden"
              onClick={() => setOpen(false)}
            />

            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 bottom-0 z-50 flex w-[84vw] max-w-[360px] flex-col bg-white shadow-[-12px_0_44px_rgba(15,30,61,0.18)] lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-[#0F1E3D]/8 px-5 py-5">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/logo.png"
                    alt="JUSTDC"
                    className="size-9 rounded-full"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).style.display = "none"
                    }}
                  />
                  <div>
                    <div className="font-display text-[0.95rem] font-bold text-[#0F1E3D]">JUST Debate Club</div>
                    <div className="text-[9px] uppercase tracking-[0.24em] text-[#0F1E3D]/50">JUSTDC</div>
                  </div>
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-4">
                <div className="space-y-1">
                  {NAV.map((item) => {
                    const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-[1rem] font-semibold transition-colors ${
                          active
                            ? "bg-[#0F1E3D] text-white"
                            : "text-[#0F1E3D] hover:bg-[#FDF8EE]"
                        }`}
                      >
                        {item.label}
                        {active && <ChevronRight className="size-4 opacity-60" />}
                      </Link>
                    )
                  })}
                </div>
              </nav>

              <div className="space-y-2 border-t border-[#0F1E3D]/8 px-3 pb-8 pt-3">
                {user ? (
                  <>
                    <div className="mb-1 flex items-center gap-3 rounded-xl bg-[#FDF8EE] px-4 py-3">
                      <Avatar className="size-9 shrink-0 border-2 border-[#C19A3D]/30">
                        <AvatarImage src={profile?.avatar_url ?? undefined} />
                        <AvatarFallback className="bg-[#C19A3D] text-xs font-bold text-black">
                          {profile?.full_name?.slice(0, 2)?.toUpperCase() ?? "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-[#0F1E3D]">
                          {profile?.full_name ?? "Member"}
                        </div>
                        <div className="truncate text-xs text-[#0F1E3D]/50">{user.email}</div>
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-[#0F1E3D] transition-colors hover:bg-[#FDF8EE]"
                    >
                      <LayoutDashboard className="size-4 shrink-0" />
                      Dashboard
                    </Link>

                    {profile?.slug && (
                      <Link
                        href={`/members/${profile.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-[#0F1E3D] transition-colors hover:bg-[#FDF8EE]"
                      >
                        <UserIcon className="size-4 shrink-0" />
                        My profile
                      </Link>
                    )}

                    <form action={signOut}>
                      <button
                        type="submit"
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="size-4 shrink-0" />
                        Sign out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center rounded-xl border border-[#0F1E3D]/12 px-4 py-3.5 text-[1rem] font-semibold text-[#0F1E3D] transition-colors hover:bg-[#FDF8EE]"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center rounded-xl bg-[#C19A3D] px-4 py-3.5 text-[1rem] font-bold text-black transition-colors hover:bg-[#A88330]"
                    >
                      Join us →
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
