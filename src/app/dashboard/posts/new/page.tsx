import { FormLayout } from "@/components/admin/form-layout"
import { PostEditor } from "@/components/admin/post-editor"

export default function NewDashboardPostPage() {
  return (
    <FormLayout
      title="Create New Post"
      description="Write and publish announcements, news, or blog content."
      backUrl="/dashboard/posts"
      backLabel="Back to posts"
    >
      <PostEditor basePath="/dashboard/posts" />
    </FormLayout>
  )
}
