import { FormLayout } from "@/components/admin/form-layout"
import { GalleryAlbumEditor } from "@/components/admin/gallery-album-editor"

export default function NewAdminGalleryAlbumPage() {
  return (
    <FormLayout
      title="Create New Album"
      description="Add details about a new gallery album."
      backUrl="/admin/gallery"
      backLabel="Back to gallery"
    >
      <GalleryAlbumEditor basePath="/admin/gallery" />
    </FormLayout>
  )
}
