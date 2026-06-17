import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { FormLayout } from "@/components/admin/form-layout"
import { PostEditor } from "@/components/admin/post-editor"

export default async function EditDashboardPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  // Also verify they are the author since this is the member dashboard
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single()

  if (!post || post.author_id !== user.id) {
    // If not found or not the author, don't allow edit from dashboard
    notFound()
  }

  return (
    <FormLayout
      title="Edit Post"
      description="Update editorial content and publish status."
      backUrl="/dashboard/posts"
      backLabel="Back to posts"
    >
      <PostEditor post={post} basePath="/dashboard/posts" />
    </FormLayout>
  )
}
