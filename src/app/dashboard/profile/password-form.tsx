"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Eye, EyeOff, LockKeyhole } from "lucide-react"

import { updatePassword } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PasswordForm() {
  const [isPending, startTransition] = useTransition()
  const [inlineError, setInlineError] = useState("")
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function handleUpdatePassword(formData: FormData) {
    setInlineError("")
    const password = String(formData.get("password") ?? "")
    const confirmPassword = String(formData.get("confirm_password") ?? "")

    if (password !== confirmPassword) {
      setInlineError("Passwords do not match.")
      return
    }

    startTransition(async () => {
      const result = await updatePassword(formData)
      if (result?.error) {
        setInlineError(result.error)
        toast.error(result.error)
      } else {
        toast.success("Password updated successfully!")
        setInlineError("")
      }
    })
  }

  return (
    <form action={handleUpdatePassword} className="space-y-6 bg-white p-6 rounded-2xl border border-[#0F1E3D]/10 shadow-sm mt-8">
      <div>
        <h3 className="font-display text-xl font-bold tracking-tight text-[#0F1E3D]">Change Password</h3>
        <p className="mt-1 text-sm text-[#0F1E3D]/50 font-medium">
          Update your account password securely.
        </p>
      </div>

      <div className="space-y-5 max-w-md">
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium text-[#0F1E3D]/80">
            New password
          </Label>
          <div className="relative flex items-center">
            <LockKeyhole className="absolute left-4 size-4.5 text-[#0F1E3D]/40 pointer-events-none" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              minLength={8}
              autoComplete="new-password"
              required
              className="h-12 pl-11 pr-11 border-[#0F1E3D]/12 bg-[#EEF2F6] text-[#0F1E3D] placeholder:text-[#0F1E3D]/40 rounded-xl focus-visible:ring-[#C19A3D]/30 focus-visible:border-[#C19A3D] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-4 text-[#0F1E3D]/40 hover:text-[#0F1E3D] transition-colors focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm_password" className="text-sm font-medium text-[#0F1E3D]/80">
            Confirm new password
          </Label>
          <div className="relative flex items-center">
            <LockKeyhole className="absolute left-4 size-4.5 text-[#0F1E3D]/40 pointer-events-none" />
            <Input
              id="confirm_password"
              name="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              minLength={8}
              autoComplete="new-password"
              required
              className="h-12 pl-11 pr-11 border-[#0F1E3D]/12 bg-[#EEF2F6] text-[#0F1E3D] placeholder:text-[#0F1E3D]/40 rounded-xl focus-visible:ring-[#C19A3D]/30 focus-visible:border-[#C19A3D] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              className="absolute right-4 text-[#0F1E3D]/40 hover:text-[#0F1E3D] transition-colors focus:outline-none"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
            </button>
          </div>
        </div>

        {inlineError ? (
          <div className="rounded-[1rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
            {inlineError}
          </div>
        ) : null}
      </div>

      <div className="pt-4 border-t border-[#0F1E3D]/10">
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 bg-[#0F1E3D] text-white hover:bg-[#132955] rounded-xl text-sm font-semibold shadow-md px-6"
        >
          {isPending ? "Updating..." : "Update password"}
        </Button>
      </div>
    </form>
  )
}
