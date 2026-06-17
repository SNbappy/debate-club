"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { createAchievement, updateAchievement } from "@/lib/actions/achievements"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import type { Achievement } from "@/types/supabase"

const CATEGORY_LABELS: Record<string, string> = {
  speaker_award: "Speaker Award",
  adjudication_award: "Adjudication Award",
  team_result: "Team Result",
  training_conducted: "Training Conducted",
  other: "Other",
}

export function AchievementEditor({
  achievement,
  basePath,
}: {
  achievement?: Achievement
  basePath: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = achievement
        ? await updateAchievement(achievement.id, formData)
        : await createAchievement(formData)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(achievement ? "Achievement updated" : "Achievement added")
        router.push(basePath)
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-3 sm:col-span-2">
          <Label htmlFor="title" className="text-sm font-semibold text-[#0F1E3D]">
            Title
          </Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={achievement?.title ?? ""}
            placeholder="e.g. Best Speaker, Champion, etc."
            className="h-12 rounded-xl border-[#0F1E3D]/12 bg-[#FCFCFD] px-4 text-[15px] shadow-sm transition-colors focus:bg-white"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="category" className="text-sm font-semibold text-[#0F1E3D]">
            Category
          </Label>
          <Select name="category" defaultValue={achievement?.category ?? "speaker_award"}>
            <SelectTrigger className="h-12 rounded-xl border-[#0F1E3D]/12 bg-[#FCFCFD] px-4 text-[15px] shadow-sm transition-colors focus:bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORY_LABELS).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="achievement_date" className="text-sm font-semibold text-[#0F1E3D]">
            Date
          </Label>
          <Input
            id="achievement_date"
            name="achievement_date"
            type="date"
            defaultValue={achievement?.achievement_date ?? ""}
            className="h-12 rounded-xl border-[#0F1E3D]/12 bg-[#FCFCFD] px-4 text-[15px] shadow-sm transition-colors focus:bg-white"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="tournament_name" className="text-sm font-semibold text-[#0F1E3D]">
            Tournament Name
          </Label>
          <Input
            id="tournament_name"
            name="tournament_name"
            defaultValue={achievement?.tournament_name ?? ""}
            placeholder="e.g. Asian BP, WUDC..."
            className="h-12 rounded-xl border-[#0F1E3D]/12 bg-[#FCFCFD] px-4 text-[15px] shadow-sm transition-colors focus:bg-white"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="tournament_year" className="text-sm font-semibold text-[#0F1E3D]">
            Tournament Year
          </Label>
          <Input
            id="tournament_year"
            name="tournament_year"
            type="number"
            defaultValue={achievement?.tournament_year ?? ""}
            placeholder="e.g. 2024"
            className="h-12 rounded-xl border-[#0F1E3D]/12 bg-[#FCFCFD] px-4 text-[15px] shadow-sm transition-colors focus:bg-white"
          />
        </div>

        <div className="space-y-3 sm:col-span-2">
          <Label htmlFor="position" className="text-sm font-semibold text-[#0F1E3D]">
            Position / Result
          </Label>
          <Input
            id="position"
            name="position"
            defaultValue={achievement?.position ?? ""}
            placeholder="e.g. 1st Place, Quarterfinalist..."
            className="h-12 rounded-xl border-[#0F1E3D]/12 bg-[#FCFCFD] px-4 text-[15px] shadow-sm transition-colors focus:bg-white"
          />
        </div>

        <div className="space-y-3 sm:col-span-2">
          <Label htmlFor="description" className="text-sm font-semibold text-[#0F1E3D]">
            Description (optional)
          </Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={achievement?.description ?? ""}
            className="min-h-[120px] rounded-xl border-[#0F1E3D]/12 bg-[#FCFCFD] p-4 text-[15px] shadow-sm transition-colors focus:bg-white leading-relaxed"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end border-t border-[#0F1E3D]/8 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(basePath)}
          className="h-12 rounded-xl border-[#0F1E3D]/12 px-8 text-[15px] font-medium"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 rounded-xl bg-[#0F1E3D] px-8 text-[15px] font-medium text-white shadow-md transition-transform hover:-translate-y-0.5 hover:bg-[#1A2E5A] hover:shadow-lg"
        >
          {isPending ? "Saving..." : achievement ? "Update Achievement" : "Add Achievement"}
        </Button>
      </div>
    </form>
  )
}
