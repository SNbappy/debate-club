import { createClient } from "@/lib/supabase/server"
import { GalleryAdminClient } from "./gallery-admin-client"

export default async function AdminGalleryPage() {
  const supabase = await createClient()
  const { data: albums } = await supabase
    .from("gallery_albums")
    .select("*, gallery_images(count)")
    .order("event_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">Gallery</h1>
      <p className="text-muted-foreground mb-6">Photo albums from events and activities.</p>
      <GalleryAdminClient albums={(albums as any) ?? []} />
    </div>
  )
}
