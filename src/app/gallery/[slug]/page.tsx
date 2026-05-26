import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default async function PublicAlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: album } = await supabase.from("gallery_albums").select("*").eq("slug", slug).eq("is_published", true).maybeSingle()
  if (!album) notFound()
  const { data: photos } = await supabase.from("gallery_images").select("*").eq("album_id", album.id).order("order_index")

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link href="/gallery" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="size-4 mr-1" /> All albums
      </Link>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{album.title}</h1>
        <p className="text-muted-foreground">
          {photos?.length ?? 0} photo{(photos?.length ?? 0) !== 1 ? "s" : ""}{album.event_date && <> · {album.event_date}</>}
        </p>
        {album.description && <p className="text-muted-foreground mt-3 max-w-2xl">{album.description}</p>}
      </div>

      {(!photos || photos.length === 0) ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No photos in this album yet.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((p) => (
            <a key={p.id} href={p.image_url} target="_blank" rel="noopener noreferrer" className="block group">
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <img src={p.image_url} alt={p.caption ?? ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              {p.caption && <p className="text-xs text-muted-foreground mt-2 line-clamp-1">{p.caption}</p>}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: album } = await supabase.from("gallery_albums").select("title, description").eq("slug", slug).eq("is_published", true).maybeSingle()
  if (!album) return { title: "Album not found" }
  return { title: album.title, description: album.description ?? undefined }
}
