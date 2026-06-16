import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "./profile-form"

export default async function DashboardProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#0F1E3D]">
          Edit Profile
        </h2>
        <p className="mt-1.5 text-sm text-[#0F1E3D]/50 font-medium">
          Update your public directory details, social links, and contact visibility.
        </p>
      </div>

      <div className="max-w-4xl">
        <ProfileForm profile={profile} />
      </div>
    </div>
  )
}
