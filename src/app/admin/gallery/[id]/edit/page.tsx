import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { FormLayout } from "@/components/admin/form-layout"
import { GalleryAlbumEditor } from "@/components/admin/gallery-album-editor"

export default async function EditAdminGalleryAlbumPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: album } = await supabase
    .from("gallery_albums")
    .select("*")
    .eq("id", id)
    .single()

  if (!album) {
    notFound()
  }

  return (
    <FormLayout
      title="Edit Album"
      description="Update album details, date, or cover image."
      backUrl="/admin/gallery"
      backLabel="Back to gallery"
    >
      <GalleryAlbumEditor initialData={album} basePath="/admin/gallery" />
    </FormLayout>
  )
}
