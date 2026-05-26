import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

const ROLE_LABELS: Record<string, string> = {
  member: "Member",
  executive: "Executive",
  general_secretary: "General Secretary",
  president: "President",
  alumni: "Alumni",
}

const ROLE_FILTERS = [
  { value: "", label: "All" },
  { value: "president", label: "President" },
  { value: "general_secretary", label: "GS" },
  { value: "executive", label: "Executive" },
  { value: "member", label: "Members" },
  { value: "alumni", label: "Alumni" },
]

export default async function MembersPage({ searchParams }: { searchParams: Promise<{ q?: string; role?: string }> }) {
  const sp = await searchParams
  const q = sp.q?.trim() ?? ""
  const role = sp.role ?? ""

  const supabase = await createClient()
  let query = supabase
    .from("profiles")
    .select("id, full_name, slug, avatar_url, role, exec_position, batch_year, department, bio")
    .eq("is_verified", true)
    .not("slug", "is", null)

  if (q) query = query.ilike("full_name", `%${q}%`)
  if (role) query = query.eq("role", role as "member" | "executive" | "general_secretary" | "president" | "alumni")

  const { data: members } = await query.order("role").order("full_name")

  const [{ count: totalVerified }, { count: alumniCount }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_verified", true),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_verified", true).eq("role", "alumni"),
  ])

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Members</h1>
        <p className="text-muted-foreground">
          Meet the people behind our debate club — <strong>{totalVerified ?? 0}</strong> verified members, <strong>{alumniCount ?? 0}</strong> alumni.
        </p>
      </div>

      <form action="/members" className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="Search by name..." className="pl-10" />
          {role && <input type="hidden" name="role" value={role} />}
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div className="flex flex-wrap gap-2 mb-8">
        {ROLE_FILTERS.map((f) => {
          const params = new URLSearchParams()
          if (q) params.set("q", q)
          if (f.value) params.set("role", f.value)
          const href = `/members${params.size ? "?" + params.toString() : ""}`
          const active = (role || "") === f.value
          return (
            <Link key={f.value} href={href}>
              <Button size="sm" variant={active ? "default" : "outline"}>{f.label}</Button>
            </Link>
          )
        })}
      </div>

      {(!members || members.length === 0) ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No members found.</CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => (
            <Link key={m.id} href={`/members/${m.slug}`}>
              <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="size-16">
                      <AvatarImage src={m.avatar_url ?? undefined} alt={m.full_name} />
                      <AvatarFallback>{m.full_name?.slice(0, 2).toUpperCase() ?? "?"}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{m.full_name}</div>
                      <div className="text-sm text-muted-foreground truncate">{m.exec_position || ROLE_LABELS[m.role]}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary">{ROLE_LABELS[m.role]}</Badge>
                    {m.batch_year && <Badge variant="outline">Batch {m.batch_year}</Badge>}
                    {m.department && <Badge variant="outline">{m.department}</Badge>}
                  </div>
                  {m.bio && <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{m.bio}</p>}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
