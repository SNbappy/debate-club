"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
          <h1 className="font-display text-3xl font-bold text-[#0F1E3D] tracking-tight">Forgot password</h1>
          <p className="mt-2 text-sm text-[#0F1E3D]/60">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="font-semibold text-[#0F1E3D]">Check your inbox</p>
            <p className="text-sm text-[#0F1E3D]/60">
              We sent a password reset link to <strong>{email}</strong>
            </p>
            <div className="pt-2">
              <Link href="/login" className="text-sm font-semibold text-[#C19A3D] hover:underline">
                Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-[#0F1E3D]/80">
                Email address
              </Label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 size-4.5 text-[#0F1E3D]/40 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@university.edu"
                  className="h-12 pl-11 pr-4 border-[#0F1E3D]/12 bg-[#EEF2F6] text-[#0F1E3D] placeholder:text-[#0F1E3D]/40 rounded-xl focus-visible:ring-[#C19A3D]/30 focus-visible:border-[#C19A3D] transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={pending}
              className="h-12 w-full bg-[#0F1E3D] text-white hover:bg-[#132955] rounded-xl text-sm font-semibold shadow-md"
            >
              {pending ? "Sending…" : "Send Reset Link →"}
            </Button>
          </form>
        )}

        <div className="mt-12 text-center">
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
