import { createClient } from "@/lib/supabase/server"
import { PostsAdminClient } from "./posts-admin-client"

export default async function AdminPostsPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase.from("posts").select("*").order("created_at", { ascending: false })

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">Posts</h1>
      <PostsAdminClient posts={posts ?? []} basePath="/admin/posts" />
    </div>
  )
}
