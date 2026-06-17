"use client"

import { useState, useTransition, useEffect } from "react"
import { updateProfile } from "@/lib/actions/profile"
import { updateAvatar } from "@/lib/actions/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CldUploadWidget } from "next-cloudinary"
import { toast } from "sonner"
import type { Profile } from "@/types/supabase"
import { Upload, Trash2, CheckCircle2, XCircle } from "lucide-react"
import { cloudinaryUploadWidgetStyles } from "@/lib/cloudinary"

const CURRENT_YEAR = new Date().getFullYear()
const START_YEAR = 2015

function generateSessionOptions() {
  const options: { value: string; label: string }[] = []
  for (let year = CURRENT_YEAR + 1; year >= START_YEAR; year--) {
    const shortNext = String(year + 1).slice(-2)
    options.push({ value: String(year), label: `${year}-${shortNext}` })
  }
  return options
}

function generateYearOptions() {
  const options: { value: string; label: string }[] = []
  for (let year = CURRENT_YEAR + 1; year >= START_YEAR; year--) {
    options.push({ value: String(year), label: String(year) })
  }
  return options
}

const SESSION_OPTIONS = generateSessionOptions()
const YEAR_OPTIONS = generateYearOptions()

export function ProfileForm({ profile }: { profile: Profile }) {
  const [isPending, startTransition] = useTransition()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url)

  const [liveState, setLiveState] = useState({
    full_name: profile.full_name || "",
    slug: profile.slug || "",
    bio: profile.bio || "",
    department: profile.department || "",
    batch_year: profile.batch_year ? String(profile.batch_year) : "",
    phone: profile.phone || "",
    avatar_url: profile.avatar_url || "",
  })

  useEffect(() => {
    setLiveState((prev) => ({ ...prev, avatar_url: avatarUrl || "" }))
  }, [avatarUrl])

  function handleFormChange(e: React.FormEvent<HTMLFormElement>) {
    const fd = new FormData(e.currentTarget)
    setLiveState((prev) => ({
      ...prev,
      full_name: fd.get("full_name")?.toString() || "",
      slug: fd.get("slug")?.toString() || "",
      bio: fd.get("bio")?.toString() || "",
      department: fd.get("department")?.toString() || "",
      phone: fd.get("phone")?.toString() || "",
    }))
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result?.error) toast.error(result.error)
      else toast.success("Profile updated")
    })
  }

  function handleAvatar(url: string | null) {
    setAvatarUrl(url)
    startTransition(async () => {
      const r = await updateAvatar(url)
      if (r?.error) toast.error(r.error)
      else toast.success(url ? "Avatar updated" : "Avatar removed")
    })
  }

  const checklist = [
    { label: "Profile Picture", complete: liveState.avatar_url.trim().length > 0 },
    { label: "Full Name", complete: liveState.full_name.trim().length > 0 },
    { label: "Profile URL Slug", complete: liveState.slug.trim().length > 0 },
    { label: "Bio", complete: liveState.bio.trim().length > 0 },
    { label: "Session", complete: liveState.batch_year.trim().length > 0 },
    { label: "Department", complete: liveState.department.trim().length > 0 },
    { label: "Phone", complete: liveState.phone.trim().length > 0 },
  ]
  const completedCount = checklist.filter((c) => c.complete).length
  const percent = Math.round((completedCount / checklist.length) * 100)

  const initials = profile.full_name?.split(" ").slice(0, 2).map((s) => s[0]).join("").toUpperCase() || "?"

  return (
    <div className="space-y-6">
      {/* Live Profile Completion Card */}
      <Card className="border-[#0F1E3D]/10 bg-gradient-to-br from-white to-[#EEF2F6]/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-[#0F1E3D] flex items-center justify-between">
            <span>Profile Completion</span>
            <span className="text-[#C19A3D]">{percent}%</span>
          </CardTitle>
          <div className="h-2 w-full rounded-full bg-[#0F1E3D]/5 overflow-hidden mt-2">
            <div 
              className="h-full bg-[#C19A3D] transition-all duration-500 ease-out" 
              style={{ width: `${percent}%` }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 text-sm mt-2">
            {checklist.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                {item.complete ? (
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="size-4 text-rose-400 shrink-0" />
                )}
                <span className={item.complete ? "text-[#0F1E3D]/80" : "text-[#0F1E3D]/50"}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Avatar</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <Avatar className="size-20">
            <AvatarImage src={avatarUrl ?? undefined} alt={profile.full_name} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{ 
              maxFiles: 1, 
              clientAllowedFormats: ["png", "jpg", "jpeg", "webp"], 
              maxFileSize: 5000000,
              singleUploadAutoClose: false,
              styles: cloudinaryUploadWidgetStyles 
            }}
            onSuccess={(result) => {
              const info = result.info
              if (info && typeof info === "object" && "secure_url" in info && typeof info.secure_url === "string") {
                handleAvatar(info.secure_url)
              }
            }}
          >
            {({ open }) => (
              <Button type="button" onClick={() => open?.()} disabled={isPending}>
                <Upload className="size-4 mr-2" />{avatarUrl ? "Change" : "Upload"}
              </Button>
            )}
          </CldUploadWidget>
          {avatarUrl && (
            <Button type="button" variant="outline" onClick={() => handleAvatar(null)} disabled={isPending}>
              <Trash2 className="size-4 mr-2" />Remove
            </Button>
          )}
        </CardContent>
      </Card>

      <form action={handleSubmit} onChange={handleFormChange} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Basic info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input id="full_name" name="full_name" defaultValue={profile.full_name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Profile URL slug</Label>
                <Input id="slug" name="slug" defaultValue={profile.slug ?? ""} placeholder="e.g. sabbir-bappy" />
                <p className="text-xs text-muted-foreground">Lowercase, hyphens. Used in /members/[slug].</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" defaultValue={profile.bio ?? ""} rows={4} placeholder="About you, your debate journey..." />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batch_year">Session</Label>
                <Select 
                  name="batch_year" 
                  defaultValue={profile.batch_year ? String(profile.batch_year) : undefined}
                  onValueChange={(val) => setLiveState(prev => ({ ...prev, batch_year: val }))}
                >
                  <SelectTrigger id="batch_year">
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent>
                    {SESSION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Your university admission session.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" name="department" defaultValue={profile.department ?? ""} placeholder="CSE" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joined_year">Joined club</Label>
                <Select name="joined_year" defaultValue={profile.joined_year ? String(profile.joined_year) : undefined}>
                  <SelectTrigger id="joined_year">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" defaultValue={profile.phone ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_visibility">Phone visibility</Label>
                <Select name="phone_visibility" defaultValue={profile.phone_visibility}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="members_only">Members only</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email_visibility">Email visibility</Label>
              <Select name="email_visibility" defaultValue={profile.email_visibility}>
                <SelectTrigger className="w-full sm:w-[280px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="members_only">Members only</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Social links</CardTitle></CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="social_facebook">Facebook</Label>
                <Input id="social_facebook" name="social_facebook" type="url" defaultValue={profile.social_facebook ?? ""} placeholder="https://facebook.com/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social_linkedin">LinkedIn</Label>
                <Input id="social_linkedin" name="social_linkedin" type="url" defaultValue={profile.social_linkedin ?? ""} placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social_twitter">X / Twitter</Label>
                <Input id="social_twitter" name="social_twitter" type="url" defaultValue={profile.social_twitter ?? ""} placeholder="https://x.com/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social_instagram">Instagram</Label>
                <Input id="social_instagram" name="social_instagram" type="url" defaultValue={profile.social_instagram ?? ""} placeholder="https://instagram.com/..." />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="social_website">Personal website</Label>
                <Input id="social_website" name="social_website" type="url" defaultValue={profile.social_website ?? ""} placeholder="https://..." />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save changes"}</Button>
        </div>
      </form>
    </div>
  )
}
