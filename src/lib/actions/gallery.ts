"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const albumSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: lowercase, hyphens").min(3).max(100),
  description: z.string().max(1000).optional(),
  cover_image_url: z.string().url().optional(),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date").optional(),
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

function normalize(input: any) {
  return {
    ...input,
    slug: input.slug || autoSlug(input.title),
    description: input.description || undefined,
    cover_image_url: input.cover_image_url || undefined,
    event_date: input.event_date || undefined,
    is_published: input.is_published === true || input.is_published === "true" || input.is_published === "on",
  }
}

export async function adminCreateAlbum(input: any): Promise<{ error?: string; id?: string }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }
  const parsed = albumSchema.safeParse(normalize(input))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  const { data: album, error } = await ctx.supabase.from("gallery_albums").insert({
    title: parsed.data.title, slug: parsed.data.slug,
    description: parsed.data.description || null,
    cover_image_url: parsed.data.cover_image_url || null,
    event_date: parsed.data.event_date || null,
    is_published: parsed.data.is_published,
  }).select("id").single()
  if (error) { if (error.code === "23505") return { error: "Slug exists" }; return { error: error.message } }
  revalidatePath("/admin/gallery"); revalidatePath("/gallery")
  return { id: album?.id }
}

export async function adminUpdateAlbum(id: string, input: any): Promise<{ error?: string }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }
  const parsed = albumSchema.safeParse(normalize(input))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  const { error } = await ctx.supabase.from("gallery_albums").update({
    title: parsed.data.title, slug: parsed.data.slug,
    description: parsed.data.description || null,
    cover_image_url: parsed.data.cover_image_url || null,
    event_date: parsed.data.event_date || null,
    is_published: parsed.data.is_published,
  }).eq("id", id)
  if (error) { if (error.code === "23505") return { error: "Slug exists" }; return { error: error.message } }
  revalidatePath("/admin/gallery"); revalidatePath("/gallery"); revalidatePath(`/gallery/${parsed.data.slug}`)
  return {}
}

export async function adminDeleteAlbum(id: string): Promise<{ error?: string }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }
  const { error } = await ctx.supabase.from("gallery_albums").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/gallery"); revalidatePath("/gallery")
  return {}
}

export async function adminAddPhotos(albumId: string, urls: string[]): Promise<{ error?: string; added?: number }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }
  if (urls.length === 0) return { added: 0 }
  const { data: maxOrder } = await ctx.supabase.from("gallery_images").select("order_index").eq("album_id", albumId).order("order_index", { ascending: false }).limit(1).maybeSingle()
  const start = (maxOrder?.order_index ?? -1) + 1
  const inserts = urls.map((url, i) => ({ album_id: albumId, image_url: url, order_index: start + i }))
  const { error } = await ctx.supabase.from("gallery_images").insert(inserts)
  if (error) return { error: error.message }
  revalidatePath(`/admin/gallery/${albumId}`); revalidatePath("/admin/gallery"); revalidatePath("/gallery")
  return { added: urls.length }
}

export async function adminDeletePhoto(photoId: string): Promise<{ error?: string }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }
  const { error } = await ctx.supabase.from("gallery_images").delete().eq("id", photoId)
  if (error) return { error: error.message }
  revalidatePath("/admin/gallery"); revalidatePath("/gallery")
  return {}
}

export async function adminUpdatePhotoCaption(photoId: string, caption: string): Promise<{ error?: string }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }
  const { error } = await ctx.supabase.from("gallery_images").update({ caption: caption.trim() || null }).eq("id", photoId)
  if (error) return { error: error.message }
  revalidatePath("/admin/gallery")
  return {}
}
