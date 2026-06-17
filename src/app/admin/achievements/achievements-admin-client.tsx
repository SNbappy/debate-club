"use client"

import { useTransition } from "react"
import { deleteAchievement } from "@/lib/actions/achievements"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"
import {
  Trophy,
  Pencil,
  Plus,
  Trash2,
  Calendar,
  Medal,
} from "lucide-react"
import type { Achievement } from "@/types/supabase"

const CATEGORY_LABELS: Record<string, string> = {
  speaker_award: "Speaker Award",
  adjudication_award: "Adjudication Award",
  team_result: "Team Result",
  training_conducted: "Training Conducted",
  other: "Other",
}

function formatDate(value: string | null) {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function AchievementsAdminClient({
  achievements,
  basePath,
}: {
  achievements: Achievement[]
  basePath: string
}) {
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: string) {
    if (!confirm("Delete this achievement?")) return

    startTransition(async () => {
      const result = await deleteAchievement(id)
      if (result?.error) toast.error(result.error)
      else toast.success("Achievement deleted")
    })
  }

  function AchievementCard({ achievement }: { achievement: Achievement }) {
    const typeLabel = CATEGORY_LABELS[achievement.category] ?? achievement.category

    return (
      <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-white p-5 transition-shadow hover:shadow-[0_14px_35px_rgba(15,30,61,0.08)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[1rem] font-semibold text-[#0F1E3D]">
                {achievement.title}
              </h3>
              <Badge variant="outline" className="rounded-full border-[#0F1E3D]/12 bg-[#F8F8FA] text-[#0F1E3D]">
                {typeLabel}
              </Badge>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#0F1E3D]/60">
              {achievement.tournament_name && <span>{achievement.tournament_name}</span>}
              {achievement.tournament_year && (
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  {achievement.tournament_year}
                </span>
              )}
              {achievement.position && (
                <span className="flex items-center gap-1 uppercase tracking-wider text-[#C19A3D] font-bold text-xs">
                  <Medal className="size-3.5" />
                  {achievement.position}
                </span>
              )}
              {achievement.achievement_date && <span>· {formatDate(achievement.achievement_date)}</span>}
            </div>

            {achievement.description && (
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#0F1E3D]/65">
                {achievement.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 xl:justify-end">
            <Link href={`${basePath}/${achievement.id}/edit`}>
              <Button size="sm" variant="outline" className="rounded-xl border-[#0F1E3D]/12">
                <Pencil className="mr-1.5 size-4" />
                Edit
              </Button>
            </Link>

            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => handleDelete(achievement.id)}
              className="rounded-xl border-[#0F1E3D]/12"
            >
              <Trash2 className="mr-1.5 size-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#0F1E3D]/8 bg-white p-5 shadow-[0_20px_60px_rgba(15,30,61,0.06)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C19A3D]/20 bg-[#FBF6E8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A17C27]">
              Records Management
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#0F1E3D]">
                Achievements
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#0F1E3D]/62">
                Manage club achievements, tournament results, and speaker awards to display on the public page.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
            <div className="rounded-[22px] border border-[#0F1E3D]/8 bg-[#F8F8FA] px-4 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/45">
                Total achievements
              </div>
              <div className="mt-2 text-2xl font-semibold text-[#0F1E3D]">
                {achievements.length}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[#0F1E3D]/8 bg-[#FCFCFD] px-4 py-4">
          <div>
            <div className="text-sm font-medium text-[#0F1E3D]">
              Create new achievement
            </div>
            <p className="mt-1 text-sm text-[#0F1E3D]/58">
              Add a new award or result to the club's history.
            </p>
          </div>

          <Link href={`${basePath}/new`}>
            <Button className="rounded-xl bg-[#0F1E3D] text-white hover:bg-[#1A2E5A]">
              <Plus className="mr-2 size-4" />
              New achievement
            </Button>
          </Link>
        </div>
      </section>

      {achievements.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-[#0F1E3D]/15 bg-white p-10 text-center">
          <Trophy className="mx-auto mb-4 size-10 text-[#0F1E3D]/20" />
          <p className="text-sm font-medium text-[#0F1E3D]/55">
            No achievements have been added yet.
          </p>
          <p className="mt-2 text-sm text-[#0F1E3D]/45">
            Create the first achievement to start showcasing the club's success.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-[#C19A3D]" />
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/55">
              All Achievements
            </h3>
          </div>

          <div className="space-y-3">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
