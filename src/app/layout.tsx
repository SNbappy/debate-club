import type { Metadata } from "next"
import { Cormorant_Garamond, Manrope } from "next/font/google"

import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { AppShell } from "@/components/app-shell"
import { PageLoader } from "@/components/page-loader"
import { createClient } from "@/lib/supabase/server"

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "JUST Debate Club",
  description: "Official website of JUST Debate Club",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, slug, avatar_url, is_admin")
      .eq("id", user.id)
      .single()
    profile = data
  }

  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="min-h-screen overflow-x-hidden bg-white text-[#0F1E3D] antialiased">
        <PageLoader />
        <AppShell user={user} profile={profile}>
          {children}
        </AppShell>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
