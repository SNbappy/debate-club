import { createClient } from "@/lib/supabase/server"
import { EventsAdminClient } from "./events-admin-client"

export default async function AdminEventsPage() {
  const supabase = await createClient()
  const { data: events } = await supabase.from("events").select("*").order("event_date", { ascending: false })

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">Events</h1>
      <p className="text-muted-foreground mb-6">Tournaments, workshops, and other club happenings.</p>
      <EventsAdminClient events={events ?? []} />
    </div>
  )
}
