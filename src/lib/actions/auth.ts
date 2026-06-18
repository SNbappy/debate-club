"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { z } from "zod"

const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address.")

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")

const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  full_name: z.string().trim().min(2, "Name must be at least 2 characters."),
})

const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
})

export type ActionResult = {
  error?: string
  success?: string
  requiresEmailConfirmation?: boolean
}

function normalizeOrigin(value: string | null | undefined) {
  if (!value) return null
  return value.endsWith("/") ? value.slice(0, -1) : value
}

async function getSiteUrl() {
  const envUrl = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL)

  if (envUrl) return envUrl

  const headerStore = await headers()
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host")
  const proto = headerStore.get("x-forwarded-proto") ?? "http"

  if (!host) return null

  return `${proto}://${host}`
}

export async function signUp(formData: FormData): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    full_name: formData.get("full_name"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  const supabase = await createClient()
  const siteUrl = await getSiteUrl()

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.full_name,
      },
      ...(siteUrl
        ? {
          emailRedirectTo: `${siteUrl}/auth/callback`,
        }
        : {}),
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")

  const hasSession = Boolean(data.session)

  if (!hasSession) {
    return {
      success: "Account created. Please check your email to confirm your account before signing in.",
      requiresEmailConfirmation: true,
    }
  }

  redirect("/dashboard")
}

export async function signIn(formData: FormData): Promise<ActionResult> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/")
}

export async function verifyOtp(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim()
  const token = String(formData.get("token") ?? "").trim()
  const type = String(formData.get("type") ?? "") as "signup" | "recovery"

  if (!email || !token || !type) {
    return { error: "Missing required fields." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type,
  })

  if (error) {
    return { error: error.message }
  }

  if (type === "signup") {
    revalidatePath("/", "layout")
    redirect("/dashboard")
  }

  return { success: "OTP verified successfully." }
}

export async function sendPasswordResetOtp(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim()

  if (!email) {
    return { error: "Email is required." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) {
    return { error: error.message }
  }

  return { success: "Password reset code sent to your email." }
}

export async function updatePassword(formData: FormData): Promise<ActionResult> {
  const password = String(formData.get("password") ?? "")

  const parsed = passwordSchema.safeParse(password)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid password." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}