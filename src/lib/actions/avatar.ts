"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateAvatar(url: string | null): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  if (url !== null && !url.startsWith("https://res.cloudinary.com/")) {
    return { error: "Invalid image URL" }
  }

  const { error } = await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id)
  if (error) return { error: error.message }

  revalidatePath("/dashboard/profile")
  revalidatePath("/dashboard")
  revalidatePath("/members")
  return {}
}
