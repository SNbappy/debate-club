"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import type { UpdateTables } from "@/types/supabase"

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const profileSchema = z.object({
  full_name: z.string().min(2, "Name too short").max(100),
  slug: z.string().regex(slugRegex, "Slug: lowercase letters, numbers, hyphens only").min(3).max(50),
  bio: z.string().max(500).optional(),
  batch_year: z.number().int().min(1900).max(2100).optional(),
  department: z.string().max(100).optional(),
  joined_year: z.number().int().min(1900).max(2100).optional(),
  phone: z.string().max(30).optional(),
  email_visibility: z.enum(["public", "members_only", "hidden"]),
  phone_visibility: z.enum(["public", "members_only", "hidden"]),
  social_facebook: z.string().url().optional(),
  social_linkedin: z.string().url().optional(),
  social_twitter: z.string().url().optional(),
  social_instagram: z.string().url().optional(),
  social_website: z.string().url().optional(),
})

const YEAR_FIELDS = ["batch_year", "joined_year"]

function normalizeYear(v: string | undefined): number | undefined {
  if (!v) return undefined
  const n = Number(v)
  if (isNaN(n) || n <= 0) return undefined
  // 2-digit shorthand: 24 -> 2024
  if (n < 100) return 2000 + n
  return n
}

export async function updateProfile(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const raw: Record<string, unknown> = {}
  for (const [k, v] of formData.entries()) {
    if (typeof v !== "string") continue
    if (YEAR_FIELDS.includes(k)) {
      raw[k] = normalizeYear(v)
    } else if (v === "") {
      raw[k] = undefined
    } else {
      raw[k] = v
    }
  }

  const parsed = profileSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  const data: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(parsed.data)) {
    data[k] = v === undefined ? null : v
  }



  const { error } = await supabase.from("profiles").update(data as UpdateTables<"profiles">).eq("id", user.id)
  if (error) {
    if (error.code === "23505") return { error: "That profile URL slug is already taken." }
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/profile")
  return {}
}
