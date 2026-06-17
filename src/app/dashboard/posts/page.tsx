import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PostsAdminClient } from "@/app/admin/posts/posts-admin-client"

export default async function MemberPostsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_verified")
    .eq("id", user.id)
    .single()

  if (!profile?.is_verified) {
    return (
      <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-bold text-[#0F1E3D]">Access Pending</h2>
        <p className="mt-2 text-sm text-[#0F1E3D]/60">
          Your account is currently waiting for administrator approval. Once verified, you will be able to create and manage blog posts.
        </p>
      </div>
    )
  }

  // Fetch posts written by this specific member
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#0F1E3D]">
          My Posts
        </h2>
        <p className="mt-1.5 text-sm text-[#0F1E3D]/50 font-medium">
          Create, edit, and manage your editorial publications on the website.
        </p>
      </div>

      <PostsAdminClient posts={posts ?? []} basePath="/dashboard/posts" />
    </div>
  )
}
