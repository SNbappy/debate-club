"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const eventSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: lowercase, hyphens").min(3).max(100),
  description: z.string().max(2000).optional(),
  event_date: z.string().datetime("Invalid date/time"),
  end_date: z.string().datetime().optional(),
  location: z.string().max(200).optional(),
  registration_url: z.string().url().optional(),
  cover_image_url: z.string().url().optional(),
  is_published: z.boolean(),
})

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" as const }
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
  if (!profile?.is_admin) return { error: "Not authorized" as const }
  return { supabase }
}

function autoSlug(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 100)
}

function toISO(s: string | undefined): string | undefined {
  if (!s) return undefined
  const d = new Date(s)
  if (isNaN(d.getTime())) return undefined
  return d.toISOString()
}

function normalize(input: any) {
  return {
    ...input,
    slug: input.slug || autoSlug(input.title),
    description: input.description || undefined,
    location: input.location || undefined,
    registration_url: input.registration_url || undefined,
    cover_image_url: input.cover_image_url || undefined,
    event_date: toISO(input.event_date),
    end_date: toISO(input.end_date),
    is_published: input.is_published === true || input.is_published === "true" || input.is_published === "on",
  }
}

export async function adminCreateEvent(input: any): Promise<{ error?: string }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }
  const parsed = eventSchema.safeParse(normalize(input))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" }

  const { error } = await ctx.supabase.from("events").insert({
    title: parsed.data.title, slug: parsed.data.slug,
    description: parsed.data.description || null,
    event_date: parsed.data.event_date,
    end_date: parsed.data.end_date || null,
    location: parsed.data.location || null,
    registration_url: parsed.data.registration_url || null,
    cover_image_url: parsed.data.cover_image_url || null,
    is_published: parsed.data.is_published,
  })
  if (error) { if (error.code === "23505") return { error: "Slug exists" }; return { error: error.message } }
  revalidatePath("/admin/events"); revalidatePath("/events")
  return {}
}

export async function adminUpdateEvent(id: string, input: any): Promise<{ error?: string }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }
  const parsed = eventSchema.safeParse(normalize(input))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" }

  const { error } = await ctx.supabase.from("events").update({
    title: parsed.data.title, slug: parsed.data.slug,
    description: parsed.data.description || null,
    event_date: parsed.data.event_date,
    end_date: parsed.data.end_date || null,
    location: parsed.data.location || null,
    registration_url: parsed.data.registration_url || null,
    cover_image_url: parsed.data.cover_image_url || null,
    is_published: parsed.data.is_published,
  }).eq("id", id)
  if (error) { if (error.code === "23505") return { error: "Slug exists" }; return { error: error.message } }
  revalidatePath("/admin/events"); revalidatePath("/events"); revalidatePath(`/events/${parsed.data.slug}`)
  return {}
}

export async function adminDeleteEvent(id: string): Promise<{ error?: string }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }
  const { error } = await ctx.supabase.from("events").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/events"); revalidatePath("/events")
  return {}
}
