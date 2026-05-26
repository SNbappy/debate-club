import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  const [{ count: totalMembers }, { count: pendingMembers }, { count: pendingAch }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_verified", false),
    supabase.from("achievements").select("*", { count: "exact", head: true }).eq("is_verified", false),
  ])

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Overview</h1>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total members" value={totalMembers ?? 0} />
        <StatCard label="Pending approval" value={pendingMembers ?? 0} highlight={(pendingMembers ?? 0) > 0} />
        <StatCard label="Pending achievements" value={pendingAch ?? 0} highlight={(pendingAch ?? 0) > 0} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Verify members</CardTitle><CardDescription>Approve sign-ups, set roles, grant admin</CardDescription></CardHeader>
          <CardContent><Link href="/admin/members"><Button size="sm">Manage members<ArrowRight className="size-4 ml-2" /></Button></Link></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Verify achievements</CardTitle><CardDescription>Approve member-submitted achievements</CardDescription></CardHeader>
          <CardContent><Link href="/admin/achievements"><Button size="sm">Manage achievements<ArrowRight className="size-4 ml-2" /></Button></Link></CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <Card className={highlight ? "border-amber-300 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20" : ""}>
      <CardContent className="pt-6">
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground mt-1">{label}</div>
      </CardContent>
    </Card>
  )
}
