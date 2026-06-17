"use client"

import { useTransition } from "react"
import { deleteAchievement } from "@/lib/actions/achievements"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { Achievement } from "@/types/supabase"
import { Pencil, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

const CATEGORY_LABELS: Record<string, string> = {
  speaker_award: "Speaker Award",
  adjudication_award: "Adjudication Award",
  team_result: "Team Result",
  training_conducted: "Training Conducted",
  other: "Other",
}

export function AchievementsClient({ achievements, basePath = "/dashboard/achievements" }: { achievements: Achievement[], basePath?: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: string) {
    if (!confirm("Delete this achievement?")) return
    startTransition(async () => {
      const result = await deleteAchievement(id)
      if (result?.error) toast.error(result.error)
      else toast.success("Achievement deleted")
    })
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link href={`${basePath}/new`}>
          <Button>
            <Plus className="size-4 mr-2" />Add achievement
          </Button>
        </Link>
      </div>

      {achievements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No achievements yet. Click &quot;Add achievement&quot; to add your first one.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {achievements.map((a) => (
            <Card key={a.id}>
              <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg">{a.title}</CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge variant="secondary">{CATEGORY_LABELS[a.category]}</Badge>
                    {a.tournament_name && <span>{a.tournament_name}</span>}
                    {a.tournament_year && <span>· {a.tournament_year}</span>}
                    {a.position && <span>· {a.position}</span>}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {a.is_verified
                    ? <Badge>Verified</Badge>
                    : <Badge variant="outline">Pending</Badge>}
                  {!a.is_verified && (
                    <>
                      <Link href={`${basePath}/${a.id}/edit`}>
                        <Button size="sm" variant="outline">
                          <Pencil className="size-4" />
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(a.id)} disabled={isPending}>
                        <Trash2 className="size-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardHeader>
              {a.description && (
                <CardContent className="pt-0 text-sm text-muted-foreground">{a.description}</CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
