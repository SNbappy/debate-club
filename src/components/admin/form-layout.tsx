import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import React from "react"

interface FormLayoutProps {
  title: string
  description: string
  backUrl: string
  backLabel?: string
  children: React.ReactNode
}

export function FormLayout({
  title,
  description,
  backUrl,
  backLabel = "Back",
  children,
}: FormLayoutProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={backUrl}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#0F1E3D]/10 bg-white text-[#0F1E3D] shadow-sm transition-colors hover:bg-[#F8F8FA] hover:text-[#1A2E5A]"
        >
          <ArrowLeft className="size-4" />
          <span className="sr-only">{backLabel}</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F1E3D]">{title}</h1>
          <p className="text-sm text-[#0F1E3D]/60">{description}</p>
        </div>
      </div>

      <div className="rounded-[28px] border border-[#0F1E3D]/8 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,30,61,0.06)] backdrop-blur-xl sm:p-10">
        {children}
      </div>
    </div>
  )
}
