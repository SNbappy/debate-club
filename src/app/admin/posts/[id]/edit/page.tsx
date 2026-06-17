import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { FormLayout } from "@/components/admin/form-layout"
import { PostEditor } from "@/components/admin/post-editor"

export default async function EditAdminPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single()

  if (!post) {
    notFound()
  }

  return (
    <FormLayout
      title="Edit Post"
      description="Update editorial content and publish status."
      backUrl="/admin/posts"
      backLabel="Back to posts"
    >
      <PostEditor post={post} basePath="/admin/posts" />
    </FormLayout>
  )
}
