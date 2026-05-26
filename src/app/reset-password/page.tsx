"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [pending, setPending] = useState(false)
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
    <div className="min-h-screen bg-[#FDF8EE] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-[#0F1E3D]/10 p-8">
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C19A3D] mb-2 font-semibold">Account</p>
            <h1 className="text-2xl font-bold text-[#0F1E3D]">Set New Password</h1>
            <p className="text-sm text-[#0F1E3D]/60 mt-2">Choose a strong password for your account.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[#0F1E3D]">New Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="w-full px-4 py-2.5 rounded-lg border border-[#0F1E3D]/20 bg-[#FDF8EE] text-[#0F1E3D] placeholder:text-[#0F1E3D]/40 focus:outline-none focus:ring-2 focus:ring-[#C19A3D]/40 focus:border-[#C19A3D] transition-colors text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="confirm" className="text-sm font-medium text-[#0F1E3D]">Confirm Password</label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                placeholder="Repeat your password"
                className="w-full px-4 py-2.5 rounded-lg border border-[#0F1E3D]/20 bg-[#FDF8EE] text-[#0F1E3D] placeholder:text-[#0F1E3D]/40 focus:outline-none focus:ring-2 focus:ring-[#C19A3D]/40 focus:border-[#C19A3D] transition-colors text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-[#0F1E3D] hover:bg-[#1a2e5a] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors duration-200 text-sm"
            >
              {pending ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
