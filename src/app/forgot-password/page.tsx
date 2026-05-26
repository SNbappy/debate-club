"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    })
    setPending(false)
    if (error) {
      toast.error(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF8EE] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-[#0F1E3D]/10 p-8">
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C19A3D] mb-2 font-semibold">Account</p>
            <h1 className="text-2xl font-bold text-[#0F1E3D]">Forgot Password</h1>
            <p className="text-sm text-[#0F1E3D]/60 mt-2">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="font-semibold text-[#0F1E3D]">Check your inbox</p>
              <p className="text-sm text-[#0F1E3D]/60">
                We sent a password reset link to <strong>{email}</strong>
              </p>
              <Link href="/login" className="inline-block text-sm text-[#C19A3D] hover:underline font-medium">
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-[#0F1E3D]">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#0F1E3D]/20 bg-[#FDF8EE] text-[#0F1E3D] placeholder:text-[#0F1E3D]/40 focus:outline-none focus:ring-2 focus:ring-[#C19A3D]/40 focus:border-[#C19A3D] transition-colors text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={pending}
                className="w-full bg-[#0F1E3D] hover:bg-[#1a2e5a] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors duration-200 text-sm"
              >
                {pending ? "Sending…" : "Send Reset Link"}
              </button>
              <p className="text-center text-sm text-[#0F1E3D]/60">
                Remember your password?{" "}
                <Link href="/login" className="text-[#C19A3D] hover:underline font-medium">Log in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
