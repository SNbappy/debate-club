import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { FormLayout } from "@/components/admin/form-layout"
import { AchievementEditor } from "@/components/admin/achievement-editor"

export default async function EditAdminAchievementPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: achievement } = await supabase
    .from("achievements")
    .select("*")
    .eq("id", id)
    .single()

  if (!achievement) {
    notFound()
  }

  return (
    <FormLayout
      title="Edit Achievement"
      description="Update details for this achievement record."
      backUrl="/admin/achievements"
      backLabel="Back to achievements"
    >
      <AchievementEditor achievement={achievement} basePath="/admin/achievements" />
    </FormLayout>
  )
}
