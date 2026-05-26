"use client"

import { useTransition } from "react"
import { adminVerifyAchievement, adminDeleteAchievement } from "@/lib/actions/admin"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Check, X, Trash2 } from "lucide-react"

type AchievementRow = {
  id: string
  title: string
  category: string
  tournament_name: string | null
  tournament_year: number | null
  position: string | null
  achievement_date: string | null
  description: string | null
  is_verified: boolean
  profiles: { full_name: string; slug: string | null; email: string } | null
}

const CATEGORY_LABELS: Record<string, string> = {
  speaker_award: "Speaker Award",
  adjudication_award: "Adjudication Award",
  team_result: "Team Result",
  training_conducted: "Training Conducted",
  other: "Other",
}

export function AchievementsAdminClient({ achievements }: { achievements: AchievementRow[] }) {
  const [isPending, startTransition] = useTransition()

  function act(fn: () => Promise<{ error?: string }>, msg: string) {
    startTransition(async () => {
      const r = await fn()
      if (r?.error) toast.error(r.error)
      else toast.success(msg)
    })
  }

  if (achievements.length === 0) {
    return <Card><CardContent className="py-12 text-center text-muted-foreground">No achievements yet.</CardContent></Card>
  }

  return (
    <div className="space-y-3">
      {achievements.map((a) => (
        <Card key={a.id}>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="font-medium text-lg">{a.title}</div>
                <div className="text-sm text-muted-foreground">
                  By <strong>{a.profiles?.full_name ?? "Unknown"}</strong> ({a.profiles?.email})
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                  <Badge variant="secondary">{CATEGORY_LABELS[a.category]}</Badge>
                  {a.tournament_name && <span>{a.tournament_name}</span>}
                  {a.tournament_year && <span>· {a.tournament_year}</span>}
                  {a.position && <span>· {a.position}</span>}
                  {a.achievement_date && <span>· {a.achievement_date}</span>}
                </div>
                {a.description && <p className="text-sm text-muted-foreground mt-2">{a.description}</p>}
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {a.is_verified ? <Badge>Verified</Badge> : <Badge variant="outline">Pending</Badge>}
                {a.is_verified ? (
                  <Button size="sm" variant="outline" disabled={isPending}
                    onClick={() => act(() => adminVerifyAchievement(a.id, false), "Unverified")}>
                    <X className="size-4 mr-1" />Unverify
                  </Button>
                ) : (
                  <Button size="sm" disabled={isPending}
                    onClick={() => act(() => adminVerifyAchievement(a.id, true), "Verified")}>
                    <Check className="size-4 mr-1" />Verify
                  </Button>
                )}
                <Button size="sm" variant="outline" disabled={isPending}
                  onClick={() => {
                    if (!confirm("Delete this achievement?")) return
                    act(() => adminDeleteAchievement(a.id), "Deleted")
                  }}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
