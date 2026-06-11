"use client"

import { usePathname } from "next/navigation"

import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

const SHELLLESS_PREFIXES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify",
  "/dashboard",
  "/admin",
]

export function AppShell({
  children,
  user,
  profile,
}: {
  children: React.ReactNode
  user: any
  profile: any
}) {
  const pathname = usePathname()

  const shellless = SHELLLESS_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  )

  if (shellless) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SiteNav user={user} profile={profile} />
      <main className="flex-1 pt-16">{children}</main>
      <SiteFooter />
    </div>
  )
}
