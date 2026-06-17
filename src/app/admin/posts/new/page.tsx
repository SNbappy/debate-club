import { FormLayout } from "@/components/admin/form-layout"
import { PostEditor } from "@/components/admin/post-editor"

export default function NewAdminPostPage() {
  return (
    <FormLayout
      title="Create New Post"
      description="Write and publish announcements, news, or blog content."
      backUrl="/admin/posts"
      backLabel="Back to posts"
    >
      <PostEditor basePath="/admin/posts" />
    </FormLayout>
  )
}
