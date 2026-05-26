"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function submitContactMessage(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
  }

  const result = schema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("contact_messages").insert(result.data)
  if (error) return { error: "Failed to send message. Please try again." }
  return {}
}
