"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react"
import { toast } from "sonner"

import { signIn } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()
  const [inlineError, setInlineError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const searchParams = useSearchParams()

  const redirectedFrom = searchParams.get("redirectedFrom")
  const helperText = useMemo(() => {
    if (!redirectedFrom) return "Sign in to continue to your Debate Club workspace."
    return `Sign in to continue to ${redirectedFrom}.`
  }, [redirectedFrom])

  function handleSubmit(formData: FormData) {
    setInlineError("")

    startTransition(async () => {
      const result = await signIn(formData)
      if (result?.error) {
        setInlineError(result.error)
        toast.error(result.error)
      }
    })
  }

  return (
    <main className="min-h-screen bg-[#FDF8EE] text-[#0F1E3D] flex">
      {/* Left Column: Brand Info Sidebar (hidden on mobile/tablet) */}
      <section className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#081126] text-white relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(193,154,61,0.18),transparent_25%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.06),transparent_20%)]" />
        
        {/* Top: Clean Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <img src="/logo.png" alt="JUST Debate Club" className="size-9 rounded-full" />
          <div>
            <div className="font-display font-bold text-sm tracking-tight text-white">JUST Debate Club</div>
            <div className="text-[8px] uppercase tracking-[0.24em] text-white/50">JUSTDC</div>
          </div>
        </Link>

        {/* Center: Headline & Subtext */}
        <div className="relative z-10 max-w-md">
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-[1.05] tracking-tight text-white mb-6">
            Where ideas take <span className="italic text-[#C19A3D]">stage</span>.
          </h1>
          <p className="text-white/76 leading-relaxed">
            Cultivating Bangladesh&apos;s sharpest student voices through structured debate, public speaking, and critical reasoning.
          </p>
        </div>

        {/* Bottom: Muted Footer info */}
        <div className="relative z-10 text-xs text-white/40 font-medium">
          &copy; {new Date().getFullYear()} JUST Debate Club. Protected workspace.
        </div>
      </section>

      {/* Right Column: Clean Sign-in Form (full width on mobile) */}
      <section className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-[#FDF8EE] relative">
        <div className="w-full max-w-[380px] mx-auto">
          {/* Logo at the top for mobile viewports */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src="/logo.png" alt="JUST Debate Club" className="size-9 rounded-full" />
            <div>
              <div className="font-display font-bold text-sm tracking-tight text-[#0F1E3D]">JUST Debate Club</div>
              <div className="text-[8px] uppercase tracking-[0.24em] text-[#0F1E3D]/50">JUSTDC</div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-[#0F1E3D] tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-[#0F1E3D]/60">
              {helperText}
            </p>
          </div>

          <form action={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-[#0F1E3D]/80">
                Email address
              </Label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 size-4.5 text-[#0F1E3D]/40 pointer-events-none" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@university.edu"
                  required
                  className="h-12 pl-11 pr-4 border-[#0F1E3D]/12 bg-[#EEF2F6] text-[#0F1E3D] placeholder:text-[#0F1E3D]/40 rounded-xl focus-visible:ring-[#C19A3D]/30 focus-visible:border-[#C19A3D] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-[#0F1E3D]/80">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#C19A3D] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <LockKeyhole className="absolute left-4 size-4.5 text-[#0F1E3D]/40 pointer-events-none" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
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

            {inlineError ? (
              <div className="rounded-[1rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
                {inlineError}
              </div>
            ) : null}

            <Button
              type="submit"
              disabled={isPending}
              className="h-12 w-full bg-[#0F1E3D] text-white hover:bg-[#132955] rounded-xl text-sm font-semibold shadow-md"
            >
              {isPending ? "Signing in..." : "Sign in →"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-[#0F1E3D]/62">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#C19A3D] hover:underline"
            >
              Sign up
            </Link>
          </p>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F1E3D]/50 hover:text-[#0F1E3D] transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
