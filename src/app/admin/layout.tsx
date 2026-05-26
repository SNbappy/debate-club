import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Users, Trophy, LayoutDashboard, Award, FileText, Calendar, Images , Mail} from "lucide-react"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
  if (!profile?.is_admin) redirect("/dashboard")

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-60 md:min-h-screen border-b md:border-b-0 md:border-r p-4 md:p-6 bg-muted/30">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="size-4 mr-1" /> Dashboard
        </Link>
        <h2 className="font-bold mb-4 text-lg">Admin</h2>
        <nav className="space-y-1 text-sm">
          <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"><LayoutDashboard className="size-4" />Overview</Link>
          <Link href="/admin/members" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"><Users className="size-4" />Members</Link>
          <Link href="/admin/achievements" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"><Trophy className="size-4" />Achievements</Link>
          <Link href="/admin/certificates" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"><Award className="size-4" />Certificates</Link>
          <Link href="/admin/posts" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"><FileText className="size-4" />Posts</Link>
          <Link href="/admin/events" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"><Calendar className="size-4" />Events</Link>
          <Link href="/admin/gallery" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"><Images className="size-4" />Gallery</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  )
}


