import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AlbumPhotosClient } from "./album-photos-client"

export default async function AdminAlbumPhotosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: album }, { data: photos }] = await Promise.all([
    supabase.from("gallery_albums").select("*").eq("id", id).maybeSingle(),
    supabase.from("gallery_images").select("*").eq("album_id", id).order("order_index"),
  ])
  if (!album) notFound()

  return (
    <div className="max-w-6xl">
      <Link href="/admin/gallery" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-4 mr-1" /> All albums
      </Link>
      <h1 className="text-3xl font-bold mb-2">{album.title}</h1>
      <p className="text-muted-foreground mb-6">{photos?.length ?? 0} photos</p>
      <AlbumPhotosClient albumId={album.id} photos={photos ?? []} />
    </div>
  )
}
