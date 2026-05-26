import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"

type Evt = {
  id: string; title: string; slug: string; description: string | null
  event_date: string; location: string | null; cover_image_url: string | null
}

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: events } = await supabase.from("events").select("*").eq("is_published", true).order("event_date", { ascending: true })

  const now = new Date()
  const upcoming = (events ?? []).filter((e) => new Date(e.event_date) >= now)
  const past = (events ?? []).filter((e) => new Date(e.event_date) < now).reverse()

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Events</h1>
        <p className="text-muted-foreground">Tournaments, workshops, and other club happenings.</p>
      </div>

      {upcoming.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Upcoming</h2>
          <div className="grid sm:grid-cols-2 gap-6">{upcoming.map((e) => <EventCard key={e.id} event={e} />)}</div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-muted-foreground">Past events</h2>
          <div className="grid sm:grid-cols-2 gap-6 opacity-80">{past.map((e) => <EventCard key={e.id} event={e} isPast />)}</div>
        </section>
      )}

      {upcoming.length === 0 && past.length === 0 && (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No events yet.</CardContent></Card>
      )}
    </div>
  )
}

function EventCard({ event, isPast }: { event: Evt; isPast?: boolean }) {
  return (
    <Link href={`/events/${event.slug}`}>
      <Card className="hover:shadow-lg transition-shadow h-full overflow-hidden pt-0">
        {event.cover_image_url && <img src={event.cover_image_url} alt={event.title} className="aspect-video w-full object-cover" />}
        <CardContent className="pt-6">
          {isPast && <Badge variant="outline" className="mb-2">Past</Badge>}
          <h3 className="text-xl font-semibold mb-2 line-clamp-2">{event.title}</h3>
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="size-4" />{new Date(event.event_date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</div>
            {event.location && <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="size-4" />{event.location}</div>}
          </div>
          {event.description && <p className="text-sm text-muted-foreground line-clamp-2 mt-3">{event.description}</p>}
        </CardContent>
      </Card>
    </Link>
  )
}
