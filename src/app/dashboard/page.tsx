import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { signOut } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Pencil, Trophy, Award, ArrowRight, Shield } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const [{ count: achCount }, { count: pendingAch }, { count: certCount }] = await Promise.all([
    supabase.from("achievements").select("*", { count: "exact", head: true }).eq("profile_id", user.id),
    supabase.from("achievements").select("*", { count: "exact", head: true }).eq("profile_id", user.id).eq("is_verified", false),
    supabase.from("certificates").select("*", { count: "exact", head: true }).eq("profile_id", user.id),
  ])

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          {profile?.is_verified && profile?.slug && (
            <Link href={`/members/${profile.slug}`} target="_blank">
              <Button variant="outline" size="sm">View public profile</Button>
            </Link>
          )}
          <form action={signOut}>
            <Button variant="outline" type="submit">Sign out</Button>
          </form>
        </div>
      </div>

      {!profile?.is_verified && (
        <Card className="mb-6 border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
          <CardContent className="pt-6 text-sm">
            <strong>Your profile is pending admin approval.</strong> Once verified, your profile becomes public at{" "}
            {profile?.slug ? <code className="bg-background px-1 rounded">/members/{profile.slug}</code> : <code className="bg-background px-1 rounded">/members/[your-slug]</code>}.
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Profile</CardTitle>
              <CardDescription>{profile?.full_name || "Unnamed"}</CardDescription>
            </div>
            <Link href="/dashboard/profile">
              <Button size="sm" variant="outline"><Pencil className="size-4 mr-2" />Edit</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="font-medium">Email:</span> {profile?.email}</div>
            <div className="flex items-center gap-2"><span className="font-medium">Role:</span><Badge variant="secondary">{profile?.role}</Badge></div>
            <div className="flex items-center gap-2"><span className="font-medium">Verified:</span>{profile?.is_verified ? <Badge>Yes</Badge> : <Badge variant="outline">Pending</Badge>}</div>
            <div className="flex items-center gap-2"><span className="font-medium">Admin:</span>{profile?.is_admin ? <Badge>Yes</Badge> : <Badge variant="outline">No</Badge>}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Trophy className="size-5" />Achievements</CardTitle>
              <CardDescription>{achCount ?? 0} total · {pendingAch ?? 0} pending</CardDescription>
            </div>
            <Link href="/dashboard/achievements">
              <Button size="sm">Manage<ArrowRight className="size-4 ml-2" /></Button>
            </Link>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Add your debate awards and tournament results.</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Award className="size-5" />Certificates</CardTitle>
              <CardDescription>{certCount ?? 0} issued</CardDescription>
            </div>
            <Link href="/dashboard/certificates">
              <Button size="sm">View<ArrowRight className="size-4 ml-2" /></Button>
            </Link>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Certificates issued by the admin. Download and share.</CardContent>
        </Card>

        {profile?.is_admin && (
          <Card className="md:col-span-2 lg:col-span-3 border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><Shield className="size-5" />Admin</CardTitle>
                <CardDescription>Approve members, verify achievements, issue certificates</CardDescription>
              </div>
              <Link href="/admin">
                <Button size="sm" variant="outline">Open admin<ArrowRight className="size-4 ml-2" /></Button>
              </Link>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}
