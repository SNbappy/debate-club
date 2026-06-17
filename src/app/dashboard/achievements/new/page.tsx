import { FormLayout } from "@/components/admin/form-layout"
import { AchievementEditor } from "@/components/admin/achievement-editor"

export default function NewDashboardAchievementPage() {
  return (
    <FormLayout
      title="Add Achievement"
      description="Record a new debate award, result, or milestone."
      backUrl="/dashboard/achievements"
      backLabel="Back to achievements"
    >
      <AchievementEditor basePath="/dashboard/achievements" />
    </FormLayout>
  )
}
