"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "@/lib/actions/auth"
import { Menu, X, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react"

const HIDDEN = ["/login", "/signup", "/forgot-password", "/reset-password", "/dashboard", "/admin", "/verify"]
const NAV = [
  { href: "/", label: "Home" },
  { href: "/members", label: "Members" },
  { href: "/posts", label: "Posts" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
]

export function SiteNav({ user, profile }: { user: any; profile: any }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (HIDDEN.some((p) => pathname === p || pathname.startsWith(p + "/"))) return null
  const transparent = pathname === "/" && !scrolled

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${transparent ? "bg-transparent" : "bg-white/95 backdrop-blur-md border-b shadow-sm"}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="JUSTDC" className="size-9 rounded-full"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
          <div className={`leading-tight ${transparent ? "text-white" : "text-[#0F1E3D]"}`}>
            <div className="font-bold text-sm">JUST Debate Club</div>
            <div className="text-[10px] uppercase tracking-[0.18em] opacity-70">JUSTDC</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? (transparent ? "bg-white/20 text-white" : "bg-[#0F1E3D] text-white")
                    : (transparent ? "text-white/90 hover:bg-white/10" : "text-[#0F1E3D]/80 hover:bg-[#FDF8EE]")
                }`}>{item.label}</Link>
            )
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <Avatar className={`size-9 border-2 ${transparent ? "border-white/40" : "border-[#0F1E3D]/10"}`}>
                    <AvatarImage src={profile?.avatar_url ?? undefined} />
                    <AvatarFallback className="bg-[#C19A3D] text-black text-sm font-bold">
                      {profile?.full_name?.slice(0, 2)?.toUpperCase() ?? "??"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 text-sm">
                  <div className="font-semibold">{profile?.full_name ?? "Member"}</div>
                  <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/dashboard" className="cursor-pointer"><LayoutDashboard className="size-4 mr-2" />Dashboard</Link></DropdownMenuItem>
                {profile?.slug && <DropdownMenuItem asChild><Link href={`/members/${profile.slug}`} className="cursor-pointer"><UserIcon className="size-4 mr-2" />My profile</Link></DropdownMenuItem>}
                <DropdownMenuSeparator />
                <form action={signOut}>
                  <button type="submit" className="w-full text-left">
                    <DropdownMenuItem className="cursor-pointer text-destructive"><LogOut className="size-4 mr-2" />Sign out</DropdownMenuItem>
                  </button>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost" className={transparent ? "text-white hover:bg-white/10 hover:text-white" : ""}>Sign in</Button></Link>
              <Link href="/signup"><Button className="bg-[#C19A3D] hover:bg-[#A88330] text-black font-semibold">Join us</Button></Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className={`md:hidden ${transparent ? "text-white" : "text-[#0F1E3D]"}`}>
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white">
          <nav className="px-4 py-3 space-y-1">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-lg text-[#0F1E3D] hover:bg-[#FDF8EE] font-medium">{item.label}</Link>
            ))}
            <div className="pt-3 mt-2 border-t">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-lg text-[#0F1E3D] hover:bg-[#FDF8EE] font-medium">Dashboard</Link>
                  <form action={signOut}><button type="submit" className="block w-full text-left px-4 py-3 rounded-lg text-destructive font-medium">Sign out</button></form>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-lg text-[#0F1E3D] hover:bg-[#FDF8EE] font-medium">Sign in</Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="block mx-4 my-2 px-4 py-3 rounded-lg bg-[#C19A3D] text-black font-bold text-center">Join us</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
