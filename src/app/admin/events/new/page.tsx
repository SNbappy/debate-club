import { FormLayout } from "@/components/admin/form-layout"
import { EventEditor } from "@/components/admin/event-editor"

export default function NewAdminEventPage() {
  return (
    <FormLayout
      title="Create New Event"
      description="Add details about an upcoming event, tournament, or workshop."
      backUrl="/admin/events"
      backLabel="Back to events"
    >
      <EventEditor basePath="/admin/events" />
    </FormLayout>
  )
}
