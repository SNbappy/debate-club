"use client"

import { useMemo, useTransition } from "react"
import {
  adminDeleteAchievement,
  adminVerifyAchievement,
} from "@/lib/actions/admin"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Check, Clock3, Trash2, Trophy, UserRound, X } from "lucide-react"

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

export function AchievementsAdminClient({
  achievements,
}: {
  achievements: AchievementRow[]
}) {
  const [isPending, startTransition] = useTransition()

  const pendingAchievements = useMemo(
    () => achievements.filter((a) => !a.is_verified),
    [achievements]
  )

  const verifiedAchievements = useMemo(
    () => achievements.filter((a) => a.is_verified),
    [achievements]
  )

  function act(fn: () => Promise<{ error?: string }>, msg: string) {
    startTransition(async () => {
      const result = await fn()
      if (result?.error) toast.error(result.error)
      else toast.success(msg)
    })
  }

  function AchievementCard({
    achievement,
    urgent = false,
  }: {
    achievement: AchievementRow
    urgent?: boolean
  }) {
    return (
      <div
        className={`rounded-[22px] border p-5 transition-shadow hover:shadow-[0_14px_35px_rgba(15,30,61,0.08)] ${
          urgent
            ? "border-amber-200 bg-amber-50/60"
            : "border-[#0F1E3D]/8 bg-white"
        }`}
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[1rem] font-semibold text-[#0F1E3D]">
                {achievement.title}
              </h3>

              {achievement.is_verified ? (
                <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  Verified
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="rounded-full border-amber-300 bg-amber-50 text-amber-700"
                >
                  Pending
                </Badge>
              )}

              <Badge
                variant="outline"
                className="rounded-full border-[#0F1E3D]/12 bg-[#F8F8FA] text-[#0F1E3D]"
              >
                {CATEGORY_LABELS[achievement.category] ?? achievement.category}
              </Badge>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#0F1E3D]/58">
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="size-3.5" />
                {achievement.profiles?.full_name ?? "Unknown member"}
              </span>
              {achievement.profiles?.email && <span>· {achievement.profiles.email}</span>}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#0F1E3D]/62">
              {achievement.tournament_name && <span>{achievement.tournament_name}</span>}
              {achievement.tournament_year && <span>· {achievement.tournament_year}</span>}
              {achievement.position && <span>· {achievement.position}</span>}
              {achievement.achievement_date && <span>· {achievement.achievement_date}</span>}
            </div>

            {achievement.description && (
              <p className="mt-3 text-sm leading-6 text-[#0F1E3D]/65">
                {achievement.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 xl:justify-end">
            {achievement.is_verified ? (
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() =>
                  act(
                    () => adminVerifyAchievement(achievement.id, false),
                    "Achievement unverified"
                  )
                }
                className="rounded-xl border-[#0F1E3D]/12"
              >
                <X className="mr-1.5 size-4" />
                Unverify
              </Button>
            ) : (
              <Button
                size="sm"
                disabled={isPending}
                onClick={() =>
                  act(
                    () => adminVerifyAchievement(achievement.id, true),
                    "Achievement verified"
                  )
                }
                className="rounded-xl bg-[#0F1E3D] text-white hover:bg-[#1a2e5a]"
              >
                <Check className="mr-1.5 size-4" />
                Verify
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => {
                if (!confirm("Delete this achievement?")) return
                act(() => adminDeleteAchievement(achievement.id), "Achievement deleted")
              }}
              className="rounded-xl border-[#0F1E3D]/12"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (achievements.length === 0) {
    return (
      <div className="rounded-[22px] border border-dashed border-[#0F1E3D]/15 bg-white p-10 text-center">
        <Trophy className="mx-auto mb-4 size-10 text-[#0F1E3D]/20" />
        <p className="text-sm font-medium text-[#0F1E3D]/50">
          No achievements have been submitted yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {pendingAchievements.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 text-[#C19A3D]" />
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/55">
              Pending review
            </h3>
          </div>

          <div className="space-y-3">
            {pendingAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} urgent />
            ))}
          </div>
        </div>
      )}

      {verifiedAchievements.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Check className="size-4 text-[#C19A3D]" />
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/55">
              Verified records
            </h3>
          </div>

          <div className="space-y-3">
            {verifiedAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
