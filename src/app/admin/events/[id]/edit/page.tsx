import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { FormLayout } from "@/components/admin/form-layout"
import { EventEditor } from "@/components/admin/event-editor"

export default async function EditAdminEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single()

  if (!event) {
    notFound()
  }

  return (
    <FormLayout
      title="Edit Event"
      description="Update event timing, location, or cover image."
      backUrl="/admin/events"
      backLabel="Back to events"
    >
      <EventEditor event={event} basePath="/admin/events" />
    </FormLayout>
  )
}
