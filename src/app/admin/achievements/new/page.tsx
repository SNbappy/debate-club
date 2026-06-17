import { FormLayout } from "@/components/admin/form-layout"
import { AchievementEditor } from "@/components/admin/achievement-editor"

export default function NewAdminAchievementPage() {
  return (
    <FormLayout
      title="Create New Achievement"
      description="Add a new award, result, or honor to the club's history."
      backUrl="/admin/achievements"
      backLabel="Back to achievements"
    >
      <AchievementEditor basePath="/admin/achievements" />
    </FormLayout>
  )
}
