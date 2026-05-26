import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Globe, Mail, Phone, ArrowLeft, GraduationCap, Calendar, Award } from "lucide-react"
import Link from "next/link"

const ROLE_LABELS: Record<string, string> = {
  member: "Member",
  executive: "Executive",
  general_secretary: "General Secretary",
  president: "President",
  alumni: "Alumni",
}

const CATEGORY_LABELS: Record<string, string> = {
  speaker_award: "Speaker Awards",
  adjudication_award: "Adjudication Awards",
  team_result: "Team Results",
  training_conducted: "Training Conducted",
  other: "Other",
}

const CATEGORY_ORDER = ["speaker_award", "adjudication_award", "team_result", "training_conducted", "other"] as const

export default async function MemberProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .eq("is_verified", true)
    .maybeSingle()

  if (!profile) notFound()

  const [{ data: achievements }, { data: certificates }] = await Promise.all([
    supabase.from("achievements").select("*").eq("profile_id", profile.id).eq("is_verified", true)
      .order("achievement_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false }),
    supabase.from("certificates").select("*").eq("profile_id", profile.id).order("issued_date", { ascending: false }),
  ])

  const grouped: Record<string, typeof achievements> = {}
  for (const a of achievements ?? []) {
    if (!grouped[a.category]) grouped[a.category] = []
    grouped[a.category]!.push(a)
  }

  const initials = profile.full_name.split(" ").slice(0, 2).map((s) => s[0]).join("").toUpperCase() || "?"
  const showEmail = profile.email_visibility === "public"
  const showPhone = profile.phone_visibility === "public" && profile.phone

  const socials = [
    { url: profile.social_facebook, label: "Facebook", isWeb: false },
    { url: profile.social_linkedin, label: "LinkedIn", isWeb: false },
    { url: profile.social_twitter, label: "X / Twitter", isWeb: false },
    { url: profile.social_instagram, label: "Instagram", isWeb: false },
    { url: profile.social_website, label: "Website", isWeb: true },
  ].filter((s) => s.url)

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link href="/members" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="size-4 mr-1" /> All members
      </Link>

      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <Avatar className="size-32">
          <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name} />
          <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-1">{profile.full_name}</h1>
          {profile.exec_position && <p className="text-lg text-muted-foreground mb-3">{profile.exec_position}</p>}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{ROLE_LABELS[profile.role]}</Badge>
            {profile.batch_year && <Badge variant="outline"><GraduationCap className="size-3 mr-1" />Batch {profile.batch_year}</Badge>}
            {profile.department && <Badge variant="outline">{profile.department}</Badge>}
            {profile.joined_year && <Badge variant="outline"><Calendar className="size-3 mr-1" />Joined {profile.joined_year}</Badge>}
          </div>
          {profile.bio && <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>}
        </div>
      </div>

      {(socials.length > 0 || showEmail || showPhone) && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              {showEmail && (
                <a href={`mailto:${profile.email}`}>
                  <Button size="sm" variant="outline"><Mail className="size-4 mr-2" />{profile.email}</Button>
                </a>
              )}
              {showPhone && (
                <a href={`tel:${profile.phone}`}>
                  <Button size="sm" variant="outline"><Phone className="size-4 mr-2" />{profile.phone}</Button>
                </a>
              )}
              {socials.map((s, i) => {
                const Icon = s.isWeb ? Globe : ExternalLink
                return (
                  <a key={i} href={s.url!} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline"><Icon className="size-4 mr-2" />{s.label}</Button>
                  </a>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Achievements</h2>
        {(!achievements || achievements.length === 0) ? (
          <Card><CardContent className="py-8 text-center text-muted-foreground text-sm">No verified achievements yet.</CardContent></Card>
        ) : (
          <div className="space-y-6">
            {CATEGORY_ORDER.filter((c) => grouped[c]).map((cat) => (
              <div key={cat}>
                <h3 className="font-semibold text-lg mb-3">{CATEGORY_LABELS[cat]}</h3>
                <div className="space-y-2">
                  {grouped[cat]!.map((a) => (
                    <Card key={a.id}>
                      <CardContent className="pt-4">
                        <div className="font-medium">{a.title}</div>
                        <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-2 mt-1">
                          {a.tournament_name && <span>{a.tournament_name}</span>}
                          {a.tournament_year && <span>· {a.tournament_year}</span>}
                          {a.position && <span>· {a.position}</span>}
                          {a.achievement_date && <span>· {a.achievement_date}</span>}
                        </div>
                        {a.description && <p className="text-sm text-muted-foreground mt-2">{a.description}</p>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {certificates && certificates.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Award className="size-6" />Certificates</h2>
          <div className="space-y-2">
            {certificates.map((c) => (
              <Card key={c.id}>
                <CardContent className="pt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-medium">{c.event_name}</div>
                    <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-2 mt-1">
                      <Badge variant="secondary" className="font-mono text-xs">{c.certificate_id}</Badge>
                      <span>· {c.issued_date}</span>
                      <span>· by {c.issued_by}</span>
                    </div>
                    {c.achievement_description && <p className="text-sm text-muted-foreground mt-1">{c.achievement_description}</p>}
                  </div>
                  <Link href={`/verify/${c.certificate_id}`} target="_blank">
                    <Button size="sm" variant="outline">Verify<ExternalLink className="size-4 ml-1" /></Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase.from("profiles").select("full_name, bio").eq("slug", slug).eq("is_verified", true).maybeSingle()
  if (!profile) return { title: "Member not found" }
  return { title: profile.full_name, description: profile.bio ?? `${profile.full_name} — Debate Club` }
}
