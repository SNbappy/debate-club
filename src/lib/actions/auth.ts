"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const emailSchema = z.string().email("Invalid email")
const passwordSchema = z.string().min(8, "Password must be at least 8 characters")

const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  full_name: z.string().min(2, "Name must be at least 2 characters"),
})

const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
})

export type ActionResult = { error?: string; success?: string }

export async function signUp(formData: FormData): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    full_name: formData.get("full_name"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signIn(formData: FormData): Promise<ActionResult> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/")
}
