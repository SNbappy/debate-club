import "./globals.css"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "JUST Debate Club",
  description: "Where ideas take stage. JUST Debate Club at Jashore University of Science and Technology.",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase.from("profiles").select("full_name, slug, avatar_url").eq("id", user.id).single()
    profile = data
  }

  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <SiteNav user={user} profile={profile} />
        <main className="flex-1 pt-16">{children}</main>
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  )
}
