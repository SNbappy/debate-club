import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Images } from "lucide-react"

export default async function GalleryPage() {
  const supabase = await createClient()
  const { data: albums } = await supabase
    .from("gallery_albums")
    .select("*, gallery_images(count)")
    .eq("is_published", true)
    .order("event_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Gallery</h1>
        <p className="text-muted-foreground">Photos from events, tournaments, and club activities.</p>
      </div>

      {(!albums || albums.length === 0) ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No albums yet.</CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((a) => {
            const count = (a as any).gallery_images?.[0]?.count ?? 0
            return (
              <Link key={a.id} href={`/gallery/${a.slug}`}>
                <Card className="hover:shadow-xl hover:-translate-y-1 transition-all h-full overflow-hidden pt-0 group">
                  {a.cover_image_url ? (
                    <div className="aspect-video overflow-hidden">
                      <img src={a.cover_image_url} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center"><Images className="size-12 text-muted-foreground" /></div>
                  )}
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-1 line-clamp-2 group-hover:text-primary transition-colors">{a.title}</h2>
                    <div className="text-xs text-muted-foreground">
                      {count} photo{count !== 1 ? "s" : ""}{a.event_date && <> · {a.event_date}</>}
                    </div>
                    {a.description && <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{a.description}</p>}
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
