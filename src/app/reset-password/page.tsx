"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, LockKeyhole } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [pending, setPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }
    if (password !== confirm) {
      toast.error("Passwords do not match")
      return
    }
    setPending(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setPending(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Password updated successfully!")
      router.push("/login")
    }
  }

  return (
    <main className="min-h-screen bg-[#FDF8EE] text-[#0F1E3D] flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
      <div className="w-full max-w-[380px] mx-auto">
        {/* Inline Logo */}
        <div className="flex items-center gap-3 mb-8">
          <img src="/logo.png" alt="JUST Debate Club" className="size-9 rounded-full" />
          <div>
            <div className="font-display font-bold text-sm tracking-tight text-[#0F1E3D]">JUST Debate Club</div>
            <div className="text-[8px] uppercase tracking-[0.24em] text-[#0F1E3D]/50">JUSTDC</div>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-[#0F1E3D] tracking-tight">Set new password</h1>
          <p className="mt-2 text-sm text-[#0F1E3D]/60">
            Choose a strong password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium text-[#0F1E3D]/80">
              New Password
            </Label>
            <div className="relative flex items-center">
              <LockKeyhole className="absolute left-4 size-4.5 text-[#0F1E3D]/40 pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="At least 8 characters"
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
            <Label htmlFor="confirm" className="text-sm font-medium text-[#0F1E3D]/80">
              Confirm Password
            </Label>
            <div className="relative flex items-center">
              <LockKeyhole className="absolute left-4 size-4.5 text-[#0F1E3D]/40 pointer-events-none" />
              <Input
                id="confirm"
                type={showConfirmPassword ? "text" : "password"}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                placeholder="Repeat your password"
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

          <Button
            type="submit"
            disabled={pending}
            className="h-12 w-full bg-[#0F1E3D] text-white hover:bg-[#132955] rounded-xl text-sm font-semibold shadow-md"
          >
            {pending ? "Updating…" : "Update Password →"}
          </Button>
        </form>

        <div className="text-center mt-12">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F1E3D]/50 hover:text-[#0F1E3D] transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    </main>
  )
}
