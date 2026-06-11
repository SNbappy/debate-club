"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Award,
  Calendar,
  FileText,
  Images,
  LayoutDashboard,
  Mail,
  Trophy,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"

type AdminNavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/achievements", label: "Achievements", icon: Trophy },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/contact", label: "Contact", icon: Mail },
]

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <nav className="mt-6 space-y-2">
      {adminNavItems.map((item) => {
        const Icon = item.icon
        const active = isActivePath(pathname, item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center justify-between rounded-[18px] px-4 py-3 text-sm transition-all",
              active
                ? "bg-[#F7E9BF] text-[#0F1E3D] shadow-[0_12px_30px_rgba(193,154,61,0.18)]"
                : "text-white/74 hover:bg-white/8 hover:text-white"
            )}
          >
            <span className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-2xl transition-all",
                  active
                    ? "bg-white/55 text-[#0F1E3D]"
                    : "bg-white/6 text-white/72 group-hover:bg-white/10 group-hover:text-white"
                )}
              >
                <Icon className="size-4" />
              </span>
              <span>{item.label}</span>
            </span>

            <span
              className={cn(
                "text-xs transition-opacity",
                active ? "opacity-100" : "opacity-0 group-hover:opacity-60"
              )}
            >
              →
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
