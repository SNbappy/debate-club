import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, ExternalLink } from "lucide-react"

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: event } = await supabase.from("events").select("*").eq("slug", slug).eq("is_published", true).maybeSingle()
  if (!event) notFound()

  const isPast = new Date(event.event_date) < new Date()

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/events" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="size-4 mr-1" /> All events
      </Link>

      {isPast && <Badge variant="outline" className="mb-3">Past</Badge>}
      <h1 className="text-4xl font-bold mb-4">{event.title}</h1>

      <div className="space-y-2 text-sm mb-8">
        <div className="flex items-center gap-2"><Calendar className="size-4" />{new Date(event.event_date).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}{event.end_date && <> – {new Date(event.end_date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</>}</div>
        {event.location && <div className="flex items-center gap-2"><MapPin className="size-4" />{event.location}</div>}
      </div>

      {event.cover_image_url && <img src={event.cover_image_url} alt={event.title} className="w-full aspect-video object-cover rounded-lg mb-8" />}

      {event.description && <p className="whitespace-pre-wrap leading-relaxed mb-8">{event.description}</p>}

      {event.registration_url && !isPast && (
        <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
          <Button size="lg">Register<ExternalLink className="size-4 ml-2" /></Button>
        </a>
      )}
    </article>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: event } = await supabase.from("events").select("title, description").eq("slug", slug).eq("is_published", true).maybeSingle()
  if (!event) return { title: "Event not found" }
  return { title: event.title, description: event.description?.slice(0, 200) ?? undefined }
}
