"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { ArrowLeft, BadgeCheck, LockKeyhole, Mail, UserRound } from "lucide-react"
import { toast } from "sonner"

import { signUp } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
  const [isPending, startTransition] = useTransition()
  const [inlineError, setInlineError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [requiresEmailConfirmation, setRequiresEmailConfirmation] = useState(false)

  function handleSubmit(formData: FormData) {
    setInlineError("")
    setSuccessMessage("")
    setRequiresEmailConfirmation(false)

    const password = String(formData.get("password") ?? "")
    const confirmPassword = String(formData.get("confirm_password") ?? "")

    if (password !== confirmPassword) {
      const message = "Passwords do not match."
      setInlineError(message)
      toast.error(message)
      return
    }

    startTransition(async () => {
      const result = await signUp(formData)

      if (result?.error) {
        setInlineError(result.error)
        toast.error(result.error)
        return
      }

      if (result?.success) {
        setSuccessMessage(result.success)
        setRequiresEmailConfirmation(Boolean(result.requiresEmailConfirmation))
        toast.success(result.success)
      }
    })
  }

  return (
    <main className="min-h-screen bg-[#FDF8EE] text-[#0F1E3D]">
      <section className="relative isolate min-h-screen overflow-hidden bg-[linear-gradient(180deg,#081731_0%,#0D2244_58%,#10284E_100%)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(193,154,61,0.16),transparent_18%),radial-gradient(circle_at_83%_20%,rgba(255,255,255,0.07),transparent_20%),radial-gradient(circle_at_50%_100%,rgba(8,17,38,0.58),transparent_42%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FDF8EE] via-[#FDF8EE]/55 to-transparent" />

        <header className="relative z-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8 lg:px-10">
            <Link
              href="/"
              className="inline-flex min-w-0 items-center gap-3 transition-opacity hover:opacity-90"
            >
              <div className="flex size-11 items-center justify-center rounded-2xl border border-white/12 bg-white/8 shadow-[0_10px_30px_rgba(8,17,38,0.22)] backdrop-blur-md">
                <img
                  src="/logo.png"
                  alt="JUST Debate Club"
                  className="h-7 w-7 object-contain"
                />
              </div>

              <div className="min-w-0 leading-tight">
                <div className="truncate font-display text-[1.05rem] font-semibold tracking-tight text-white">
                  JUST Debate Club
                </div>
                <div className="truncate text-[10px] uppercase tracking-[0.24em] text-white/58">
                  Protected workspace
                </div>
              </div>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-medium text-white/86 backdrop-blur-md transition-all hover:bg-white/12 hover:text-white"
            >
              <ArrowLeft className="size-3.5" />
              Back to home
            </Link>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex max-w-7xl px-6 pb-16 pt-4 sm:px-8 sm:pb-20 sm:pt-6 lg:px-10 lg:pb-24 lg:pt-8">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="hidden lg:flex flex-col justify-center text-white">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/82 backdrop-blur-md">
                <BadgeCheck className="size-3.5 text-[#C19A3D]" />
                Member registration
              </div>

              <h1 className="mt-6 max-w-[11ch] font-display text-[2.9rem] leading-[0.92] tracking-[-0.04em] text-white sm:max-w-[10ch] sm:text-[3.5rem] lg:text-[4.5rem]">
                Create your club workspace account.
              </h1>

              <p className="mt-5 max-w-xl text-[1rem] leading-8 text-white/78 sm:text-[1.02rem]">
                Start your member access with a secure account for events, posts, gallery updates, and protected club operations inside the JUST Debate Club dashboard.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.25rem] border border-white/10 bg-white/8 p-4 backdrop-blur-md">
                  <UserRound className="size-4 text-[#C19A3D]" />
                  <p className="mt-3 text-sm font-medium text-white">Member identity</p>
                  <p className="mt-1 text-xs leading-6 text-white/68">
                    Register with your name so your workspace stays personalized.
                  </p>
                </div>

                <div className="rounded-[1.25rem] border border-white/10 bg-white/8 p-4 backdrop-blur-md">
                  <Mail className="size-4 text-[#C19A3D]" />
                  <p className="mt-3 text-sm font-medium text-white">Verified access</p>
                  <p className="mt-1 text-xs leading-6 text-white/68">
                    Use a valid email address for authentication and account recovery.
                  </p>
                </div>

                <div className="rounded-[1.25rem] border border-white/10 bg-white/8 p-4 backdrop-blur-md">
                  <LockKeyhole className="size-4 text-[#C19A3D]" />
                  <p className="mt-3 text-sm font-medium text-white">Secure onboarding</p>
                  <p className="mt-1 text-xs leading-6 text-white/68">
                    Choose a strong password before entering the protected workspace.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-md rounded-[1.75rem] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-6 text-[#0F1E3D] shadow-[0_24px_70px_rgba(15,30,61,0.12)] sm:p-8">
                <div className="mb-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
                    Sign up
                  </p>
                  <h2 className="mt-3 font-display text-[2rem] leading-none text-[#0F1E3D]">
                    Create account
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#0F1E3D]/68">
                    Create your member account to access the JUST Debate Club workspace.
                  </p>
                </div>

                <form action={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-[#0F1E3D]">
                      Full name
                    </Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      placeholder="Your full name"
                      required
                      className="h-12 border-[#0F1E3D]/12 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#0F1E3D]">
                      Email address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@juniv.edu"
                      autoComplete="email"
                      required
                      className="h-12 border-[#0F1E3D]/12 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#0F1E3D]">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      minLength={8}
                      autoComplete="new-password"
                      required
                      className="h-12 border-[#0F1E3D]/12 bg-white"
                    />
                    <p className="text-xs leading-5 text-[#0F1E3D]/58">
                      Use at least 8 characters.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password" className="text-[#0F1E3D]">
                      Confirm password
                    </Label>
                    <Input
                      id="confirm_password"
                      name="confirm_password"
                      type="password"
                      minLength={8}
                      autoComplete="new-password"
                      required
                      className="h-12 border-[#0F1E3D]/12 bg-white"
                    />
                  </div>

                  {inlineError ? (
                    <div className="rounded-[1rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
                      {inlineError}
                    </div>
                  ) : null}

                  {successMessage ? (
                    <div className="rounded-[1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
                      <p>{successMessage}</p>
                      {requiresEmailConfirmation ? (
                        <p className="mt-2 text-xs leading-5 text-emerald-700/80">
                          After confirming your email, return to the sign in page and access your dashboard.
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-12 w-full bg-[#0F1E3D] text-white hover:bg-[#132955]"
                  >
                    {isPending ? "Creating account..." : "Create account"}
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-[#0F1E3D]/62">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-[#0F1E3D] underline-offset-4 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}