import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProfileForm } from "./profile-form"
import { ArrowLeft } from "lucide-react"

export default async function ProfileEditPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  if (!profile) redirect("/login")

  return (
    <div className="max-w-3xl mx-auto p-8">
      <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-4 mr-1" /> Back to dashboard
      </Link>
      <h1 className="text-3xl font-bold mb-2">Edit profile</h1>
      <p className="text-muted-foreground mb-8">
        Fill in your details. Once an admin verifies your account, your profile becomes public.
      </p>
      <ProfileForm profile={profile} />
    </div>
  )
}
