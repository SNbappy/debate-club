"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const achievementSchema = z.object({
  title: z.string().min(2, "Title too short").max(200),
  description: z.string().max(1000).optional(),
  category: z.enum(["speaker_award", "adjudication_award", "team_result", "training_conducted", "other"]),
  tournament_name: z.string().max(200).optional(),
  tournament_year: z.number().int().min(1900).max(2100).optional(),
  position: z.string().max(100).optional(),
  achievement_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date").optional(),
})

function normalize(formData: FormData): Record<string, unknown> {
  const raw: Record<string, unknown> = {}
  for (const [k, v] of formData.entries()) {
    if (typeof v !== "string") continue
    if (k === "tournament_year") {
      if (!v) { raw[k] = undefined; continue }
      const n = Number(v)
      if (isNaN(n) || n <= 0) { raw[k] = undefined; continue }
      raw[k] = n < 100 ? 2000 + n : n
    } else if (v === "") {
      raw[k] = undefined
    } else {
      raw[k] = v
    }
  }
  return raw
}

function toDb(parsed: Record<string, unknown>): Record<string, unknown> {
  const data: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(parsed)) data[k] = v === undefined ? null : v
  return data
}

export async function createAchievement(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const parsed = achievementSchema.safeParse(normalize(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" }

  const { error } = await supabase.from("achievements").insert({
    ...(toDb(parsed.data) as { title: string; category: "speaker_award" | "adjudication_award" | "team_result" | "training_conducted" | "other" }),
    profile_id: user.id,
  })
  if (error) return { error: error.message }
  revalidatePath("/dashboard/achievements")
  revalidatePath("/dashboard")
  return {}
}

export async function updateAchievement(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const parsed = achievementSchema.safeParse(normalize(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" }

  const { error } = await supabase
    .from("achievements")
    .update(toDb(parsed.data))
    .eq("id", id)
    .eq("profile_id", user.id)
    .eq("is_verified", false)
  if (error) return { error: error.message }
  revalidatePath("/dashboard/achievements")
  return {}
}

export async function deleteAchievement(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("achievements")
    .delete()
    .eq("id", id)
    .eq("profile_id", user.id)
  if (error) return { error: error.message }
  revalidatePath("/dashboard/achievements")
  revalidatePath("/dashboard")
  return {}
}
