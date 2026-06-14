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
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated" as const }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) return { error: "Not authorized" as const }

  return { supabase }
}

function autoSlug(t: string): string {
  return t
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 100)
}

function normalize(input: any) {
  return {
    ...input,
    slug: input.slug || autoSlug(input.title),
    description: input.description || undefined,
    cover_image_url: input.cover_image_url || undefined,
    event_date: input.event_date || undefined,
    is_published:
      input.is_published === true ||
      input.is_published === "true" ||
      input.is_published === "on",
  }
}

async function getAlbumSlug(
  ctx: Awaited<ReturnType<typeof requireAdmin>>,
  albumId: string
) {
  const { data } = await ctx.supabase!
    .from("gallery_albums")
    .select("slug")
    .eq("id", albumId)
    .maybeSingle()

  return data?.slug ?? null
}

async function getPhotoRecord(
  ctx: Awaited<ReturnType<typeof requireAdmin>>,
  photoId: string
) {
  const { data } = await ctx.supabase!
    .from("gallery_images")
    .select("id, album_id, order_index")
    .eq("id", photoId)
    .maybeSingle()

  return data ?? null
}

function revalidateGallery(albumSlug: string | null, albumId?: string) {
  revalidatePath("/admin/gallery")
  revalidatePath("/gallery")
  if (albumSlug) revalidatePath(`/gallery/${albumSlug}`)
  if (albumId) revalidatePath(`/admin/gallery/${albumId}`)
}

async function normalizePhotoOrder(
  ctx: Awaited<ReturnType<typeof requireAdmin>>,
  albumId: string
) {
  const { data: photos } = await ctx.supabase!
    .from("gallery_images")
    .select("id")
    .eq("album_id", albumId)
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: true })

  if (!photos?.length) return

  const updates = photos.map((photo, index) =>
    ctx.supabase!
      .from("gallery_images")
      .update({ order_index: index })
      .eq("id", photo.id)
  )

  await Promise.all(updates)
}

export async function adminCreateAlbum(
  input: any
): Promise<{ error?: string; id?: string }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }

  const parsed = albumSchema.safeParse(normalize(input))
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  const { data: album, error } = await ctx.supabase
    .from("gallery_albums")
    .insert({
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      cover_image_url: parsed.data.cover_image_url || null,
      event_date: parsed.data.event_date || null,
      is_published: parsed.data.is_published,
    })
    .select("id, slug")
    .single()

  if (error) {
    if (error.code === "23505") return { error: "Slug exists" }
    return { error: error.message }
  }

  revalidateGallery(album?.slug ?? null)
  return { id: album?.id }
}

export async function adminUpdateAlbum(
  id: string,
  input: any
): Promise<{ error?: string }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }

  const previousSlug = await getAlbumSlug(ctx, id)
  const parsed = albumSchema.safeParse(normalize(input))

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  const { error } = await ctx.supabase
    .from("gallery_albums")
    .update({
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      cover_image_url: parsed.data.cover_image_url || null,
      event_date: parsed.data.event_date || null,
      is_published: parsed.data.is_published,
    })
    .eq("id", id)

  if (error) {
    if (error.code === "23505") return { error: "Slug exists" }
    return { error: error.message }
  }

  revalidateGallery(previousSlug, id)
  if (parsed.data.slug !== previousSlug) {
    revalidatePath(`/gallery/${parsed.data.slug}`)
  }

  return {}
}

export async function adminDeleteAlbum(
  id: string
): Promise<{ error?: string }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }

  const slug = await getAlbumSlug(ctx, id)
  const { error } = await ctx.supabase
    .from("gallery_albums")
    .delete()
    .eq("id", id)

  if (error) return { error: error.message }

  revalidateGallery(slug)
  return {}
}

export async function adminAddPhotos(
  albumId: string,
  urls: string[]
): Promise<{ error?: string; added?: number }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }

  if (urls.length === 0) return { added: 0 }

  const slug = await getAlbumSlug(ctx, albumId)
  const { data: maxOrder } = await ctx.supabase
    .from("gallery_images")
    .select("order_index")
    .eq("album_id", albumId)
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle()

  const start = (maxOrder?.order_index ?? -1) + 1
  const inserts = urls.map((url, i) => ({
    album_id: albumId,
    image_url: url,
    order_index: start + i,
  }))

  const { error } = await ctx.supabase.from("gallery_images").insert(inserts)

  if (error) return { error: error.message }

  revalidateGallery(slug, albumId)
  return { added: urls.length }
}

export async function adminDeletePhoto(
  photoId: string
): Promise<{ error?: string }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }

  const photo = await getPhotoRecord(ctx, photoId)
  const albumId = photo?.album_id ?? null
  const albumSlug = albumId ? await getAlbumSlug(ctx, albumId) : null

  const { error } = await ctx.supabase
    .from("gallery_images")
    .delete()
    .eq("id", photoId)

  if (error) return { error: error.message }

  if (albumId) {
    await normalizePhotoOrder(ctx, albumId)
  }

  revalidateGallery(albumSlug, albumId ?? undefined)
  return {}
}

export async function adminUpdatePhotoCaption(
  photoId: string,
  caption: string
): Promise<{ error?: string }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }

  const photo = await getPhotoRecord(ctx, photoId)
  const albumId = photo?.album_id ?? null
  const albumSlug = albumId ? await getAlbumSlug(ctx, albumId) : null

  const { error } = await ctx.supabase
    .from("gallery_images")
    .update({ caption: caption.trim() || null })
    .eq("id", photoId)

  if (error) return { error: error.message }

  revalidateGallery(albumSlug, albumId ?? undefined)
  return {}
}

export async function adminMovePhoto(
  photoId: string,
  direction: "up" | "down"
): Promise<{ error?: string }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }

  const photo = await getPhotoRecord(ctx, photoId)
  if (!photo?.album_id) return { error: "Photo not found" }

  const albumId = photo.album_id
  const albumSlug = await getAlbumSlug(ctx, albumId)

  await normalizePhotoOrder(ctx, albumId)

  const { data: orderedPhotos } = await ctx.supabase
    .from("gallery_images")
    .select("id, order_index")
    .eq("album_id", albumId)
    .order("order_index", { ascending: true })

  if (!orderedPhotos?.length) return { error: "No photos found" }

  const currentIndex = orderedPhotos.findIndex((item) => item.id === photoId)
  if (currentIndex === -1) return { error: "Photo not found" }

  const targetIndex =
    direction === "up" ? currentIndex - 1 : currentIndex + 1

  if (targetIndex < 0 || targetIndex >= orderedPhotos.length) {
    return {}
  }

  const current = orderedPhotos[currentIndex]
  const target = orderedPhotos[targetIndex]

  const first = ctx.supabase
    .from("gallery_images")
    .update({ order_index: target.order_index })
    .eq("id", current.id)

  const second = ctx.supabase
    .from("gallery_images")
    .update({ order_index: current.order_index })
    .eq("id", target.id)

  const [{ error: firstError }, { error: secondError }] = await Promise.all([
    first,
    second,
  ])

  if (firstError || secondError) {
    return { error: firstError?.message || secondError?.message || "Failed to move photo" }
  }

  revalidateGallery(albumSlug, albumId)
  return {}
}