import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const TYPE_LABELS: Record<string, string> = {
  news: "News", blog: "Blog", tournament_writeup: "Tournament Writeup", announcement: "Announcement",
}

const TYPE_FILTERS = [
  { value: "", label: "All" },
  { value: "news", label: "News" },
  { value: "blog", label: "Blog" },
  { value: "tournament_writeup", label: "Tournaments" },
  { value: "announcement", label: "Announcements" },
]

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const sp = await searchParams
  const type = sp.type ?? ""

  const supabase = await createClient()
  let query = supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image_url, type, published_at, profiles!author_id(full_name, slug)")
    .eq("is_published", true)
  if (type) query = query.eq("type", type as "news" | "blog" | "tournament_writeup" | "announcement")
  const { data: posts } = await query.order("published_at", { ascending: false })

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Posts</h1>
        <p className="text-muted-foreground">News, blogs, tournament writeups, and announcements.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {TYPE_FILTERS.map((f) => {
          const href = f.value ? `/posts?type=${f.value}` : "/posts"
          const active = type === f.value
          return (
            <Link key={f.value} href={href}>
              <span className={`inline-block px-3 py-1.5 rounded-md text-sm ${active ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70"}`}>{f.label}</span>
            </Link>
          )
        })}
      </div>

      {(!posts || posts.length === 0) ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No posts yet.</CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {posts.map((p) => {
            const author = (p as any).profiles
            return (
              <Link key={p.id} href={`/posts/${p.slug}`}>
                <Card className="hover:shadow-lg transition-shadow h-full overflow-hidden pt-0">
                  {p.cover_image_url && (
                    <img src={p.cover_image_url} alt={p.title} className="aspect-video w-full object-cover" />
                  )}
                  <CardContent className="pt-6">
                    <Badge variant="secondary" className="mb-2">{TYPE_LABELS[p.type]}</Badge>
                    <h2 className="text-xl font-semibold mb-2 line-clamp-2">{p.title}</h2>
                    {p.excerpt && <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{p.excerpt}</p>}
                    <div className="text-xs text-muted-foreground">
                      {author?.full_name && <span>By {author.full_name} · </span>}
                      {p.published_at && <span>{new Date(p.published_at).toLocaleDateString()}</span>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
