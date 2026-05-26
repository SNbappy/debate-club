"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

function generateCertificateId(): string {
  const year = new Date().getFullYear()
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let suffix = ""
  for (let i = 0; i < 6; i++) suffix += chars[Math.floor(Math.random() * chars.length)]
  return `DC-${year}-${suffix}`
}

const certificateSchema = z.object({
  profile_id: z.string().uuid("Pick a recipient"),
  event_name: z.string().min(2).max(200),
  achievement_description: z.string().max(500).optional(),
  issued_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  issued_by: z.string().max(200).optional(),
  file_url: z.string().url().refine((u) => u.startsWith("https://res.cloudinary.com/"), "Invalid file URL"),
  thumbnail_url: z.string().url().optional(),
})

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" as const }
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
  if (!profile?.is_admin) return { error: "Not authorized" as const }
  return { supabase }
}

export async function adminCreateCertificate(input: {
  profile_id: string
  event_name: string
  achievement_description?: string
  issued_date: string
  issued_by?: string
  file_url: string
  thumbnail_url?: string
}): Promise<{ error?: string; certificateId?: string }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }

  const parsed = certificateSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" }

  const { data: recipient } = await ctx.supabase.from("profiles").select("full_name").eq("id", parsed.data.profile_id).single()
  if (!recipient) return { error: "Recipient not found" }

  let certId = generateCertificateId()
  for (let i = 0; i < 5; i++) {
    const { data: existing } = await ctx.supabase.from("certificates").select("id").eq("certificate_id", certId).maybeSingle()
    if (!existing) break
    certId = generateCertificateId()
  }

  const { error } = await ctx.supabase.from("certificates").insert({
    certificate_id: certId,
    profile_id: parsed.data.profile_id,
    recipient_name: recipient.full_name,
    event_name: parsed.data.event_name,
    achievement_description: parsed.data.achievement_description || null,
    issued_date: parsed.data.issued_date,
    issued_by: parsed.data.issued_by || "Debate Club",
    file_url: parsed.data.file_url,
    thumbnail_url: parsed.data.thumbnail_url || null,
  })
  if (error) return { error: error.message }

  revalidatePath("/admin/certificates")
  return { certificateId: certId }
}

export async function adminDeleteCertificate(id: string): Promise<{ error?: string }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }
  const { error } = await ctx.supabase.from("certificates").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/certificates")
  return {}
}
