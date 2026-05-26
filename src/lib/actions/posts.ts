"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const POST_TYPES = ["news", "blog", "tournament_writeup", "announcement"] as const

const postSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: lowercase, hyphens").min(3).max(100),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(10),
  cover_image_url: z.string().url().optional(),
  type: z.enum(POST_TYPES),
  is_published: z.boolean(),
})

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" as const }
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
  if (!profile?.is_admin) return { error: "Not authorized" as const }
  return { supabase, userId: user.id }
}

function autoSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 100)
}

function normalize(input: any) {
  return {
    ...input,
    slug: input.slug || autoSlug(input.title),
    excerpt: input.excerpt || undefined,
    cover_image_url: input.cover_image_url || undefined,
    is_published: input.is_published === true || input.is_published === "true" || input.is_published === "on",
  }
}

export async function adminCreatePost(input: any): Promise<{ error?: string; id?: string }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }
  const parsed = postSchema.safeParse(normalize(input))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" }

  const { data: post, error } = await ctx.supabase.from("posts").insert({
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt || null,
    content: parsed.data.content,
    cover_image_url: parsed.data.cover_image_url || null,
    type: parsed.data.type,
    is_published: parsed.data.is_published,
    published_at: parsed.data.is_published ? new Date().toISOString() : null,
    author_id: ctx.userId,
  }).select("id").single()

  if (error) {
    if (error.code === "23505") return { error: "Slug already exists" }
    return { error: error.message }
  }
  revalidatePath("/admin/posts"); revalidatePath("/posts")
  return { id: post?.id }
}

export async function adminUpdatePost(id: string, input: any): Promise<{ error?: string }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }
  const parsed = postSchema.safeParse(normalize(input))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" }

  const { data: current } = await ctx.supabase.from("posts").select("is_published").eq("id", id).single()
  const updateData: any = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt || null,
    content: parsed.data.content,
    cover_image_url: parsed.data.cover_image_url || null,
    type: parsed.data.type,
    is_published: parsed.data.is_published,
  }
  if (parsed.data.is_published && !current?.is_published) updateData.published_at = new Date().toISOString()

  const { error } = await ctx.supabase.from("posts").update(updateData).eq("id", id)
  if (error) {
    if (error.code === "23505") return { error: "Slug already exists" }
    return { error: error.message }
  }
  revalidatePath("/admin/posts"); revalidatePath("/posts"); revalidatePath(`/posts/${parsed.data.slug}`)
  return {}
}

export async function adminDeletePost(id: string): Promise<{ error?: string }> {
  const ctx = await requireAdmin()
  if ("error" in ctx) return { error: ctx.error }
  const { error } = await ctx.supabase.from("posts").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/posts"); revalidatePath("/posts")
  return {}
}
