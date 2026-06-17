import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { FormLayout } from "@/components/admin/form-layout"
import { AchievementEditor } from "@/components/admin/achievement-editor"

export default async function EditDashboardAchievementPage({
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

  const { data: achievement } = await supabase
    .from("achievements")
    .select("*")
    .eq("id", id)
    .single()

  // Make sure it exists and belongs to the user
  if (!achievement || achievement.profile_id !== user.id) {
    notFound()
  }

  // Once verified, users cannot edit it directly
  if (achievement.is_verified) {
    return (
      <FormLayout
        title="Edit Achievement"
        description="This achievement has already been verified and cannot be edited."
        backUrl="/dashboard/achievements"
        backLabel="Back to achievements"
      >
        <div className="text-center text-[#0F1E3D]/60 py-10">
          <p>Verified achievements can only be modified by administrators.</p>
        </div>
      </FormLayout>
    )
  }

  return (
    <FormLayout
      title="Edit Achievement"
      description="Update details about your debate award or result."
      backUrl="/dashboard/achievements"
      backLabel="Back to achievements"
    >
      <AchievementEditor achievement={achievement} basePath="/dashboard/achievements" />
    </FormLayout>
  )
}
