"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const ROLE_VALUES = ["member", "executive", "general_secretary", "president", "alumni"] as const
const roleSchema = z.enum(ROLE_VALUES)

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" as const }
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
  if (!profile?.is_admin) return { error: "Not authorized" as const }
  return { supabase, userId: user.id }
}

export async function adminSetMemberVerified(profileId: string, verified: boolean) {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }
  const { error } = await ctx.supabase.from("profiles").update({ is_verified: verified }).eq("id", profileId)
  if (error) return { error: error.message }
  revalidatePath("/admin/members"); revalidatePath("/admin"); revalidatePath("/members")
  return {}
}

export async function adminSetMemberRole(profileId: string, role: string, execPosition: string) {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }
  const parsed = roleSchema.safeParse(role)
  if (!parsed.success) return { error: "Invalid role" }
  const { error } = await ctx.supabase.from("profiles").update({
    role: parsed.data,
    exec_position: execPosition.trim() || null,
  }).eq("id", profileId)
  if (error) return { error: error.message }
  revalidatePath("/admin/members")
  return {}
}

export async function adminSetMemberAdmin(profileId: string, isAdmin: boolean) {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }
  if (profileId === ctx.userId && !isAdmin) return { error: "Can't remove your own admin status" }
  const { error } = await ctx.supabase.from("profiles").update({ is_admin: isAdmin }).eq("id", profileId)
  if (error) return { error: error.message }
  revalidatePath("/admin/members")
  return {}
}

export async function adminVerifyAchievement(id: string, verified: boolean) {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }
  const { error } = await ctx.supabase.from("achievements").update({ is_verified: verified }).eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/achievements"); revalidatePath("/admin")
  return {}
}

export async function adminDeleteAchievement(id: string) {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }
  const { error } = await ctx.supabase.from("achievements").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/achievements"); revalidatePath("/admin")
  return {}
}
