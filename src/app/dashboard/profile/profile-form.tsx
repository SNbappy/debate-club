"use client"

import { useState, useTransition } from "react"
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
import { Upload, Trash2 } from "lucide-react"

export function ProfileForm({ profile }: { profile: Profile }) {
  const [isPending, startTransition] = useTransition()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url)

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

  const initials = profile.full_name?.split(" ").slice(0, 2).map((s) => s[0]).join("").toUpperCase() || "?"

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Avatar</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="size-20">
            <AvatarImage src={avatarUrl ?? undefined} alt={profile.full_name} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{ maxFiles: 1, clientAllowedFormats: ["png", "jpg", "jpeg", "webp"], maxFileSize: 5000000 }}
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

      <form action={handleSubmit} className="space-y-6">
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
                <Label htmlFor="batch_year">Batch year</Label>
                <Input id="batch_year" name="batch_year" type="number" defaultValue={profile.batch_year ?? ""} placeholder="2024" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" name="department" defaultValue={profile.department ?? ""} placeholder="CSE" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joined_year">Joined club</Label>
                <Input id="joined_year" name="joined_year" type="number" defaultValue={profile.joined_year ?? ""} placeholder="2024" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alumni_year">Alumni year (if applicable)</Label>
              <Input id="alumni_year" name="alumni_year" type="number" defaultValue={profile.alumni_year ?? ""} placeholder="Leave blank if currently active" />
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
                <SelectTrigger className="sm:w-[280px]"><SelectValue /></SelectTrigger>
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


