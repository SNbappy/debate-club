"use client"

import { usePathname } from "next/navigation"
import { motion } from "motion/react"

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

import type { User } from "@supabase/supabase-js"

export function AppShell({
  children,
  user,
  profile,
}: {
  children: React.ReactNode
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

  const shellless = SHELLLESS_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  )

  if (shellless) {
    return (
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SiteNav user={user} profile={profile} />
      <main className="flex-1 pt-16">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </main>
      <SiteFooter />
    </div>
  )
}
