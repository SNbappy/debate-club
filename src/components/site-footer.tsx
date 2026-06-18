"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLink } from "lucide-react"

const HIDDEN = ["/login", "/signup", "/forgot-password", "/reset-password", "/dashboard", "/admin", "/verify"]

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export function SiteFooter() {
  const pathname = usePathname()
  if (HIDDEN.some((p) => pathname === p || pathname.startsWith(p + "/"))) return null

  return (
    <footer className="bg-[#0F1E3D] text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 gap-8 sm:gap-10 md:grid-cols-4 mb-10 sm:mb-12">

          {/* brand — full width on mobile */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="JUSTDC" className="size-11 rounded-full shrink-0"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
              <div>
                <div className="font-bold text-lg sm:text-xl leading-tight">JUST Debate Club</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/55 mt-0.5">
                  Jashore University of Science and Technology
                </div>
              </div>
            </div>
            <p className="text-white/65 leading-relaxed text-sm sm:text-base max-w-md">
              Where ideas take stage. Cultivating articulate minds and sharp arguments at JUST.
            </p>
          </div>

          {/* explore */}
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#C19A3D] font-semibold mb-4">Explore</div>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/about", label: "About" },
                { href: "/members", label: "Members" },
                { href: "/achievements", label: "Achievements" },
                { href: "/posts", label: "Posts" },
                { href: "/events", label: "Events" },
                { href: "/gallery", label: "Gallery" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/72 hover:text-[#C19A3D] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* get involved */}
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#C19A3D] font-semibold mb-4">Get involved</div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/signup" className="text-white/72 hover:text-[#C19A3D] transition-colors">
                  Join the club
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-white/72 hover:text-[#C19A3D] transition-colors">
                  Member login
                </Link>
              </li>
              <li>
                <a href="https://facebook.com/JUSTdebateclub" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/72 hover:text-white transition-colors">
                  <FacebookIcon className="size-4 text-[#1877F2]" /> Facebook
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/just-debate-club" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/72 hover:text-white transition-colors">
                  <LinkedInIcon className="size-4 text-[#0A66C2]" /> LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center text-xs sm:text-sm text-white/50">
          <div>&copy; {new Date().getFullYear()} JUST Debate Club. All rights reserved.</div>
          <div>
            Built by{" "}
            <a href="https://www.linkedin.com/in/snbappy/" target="_blank" rel="noopener noreferrer"
              className="text-[#C19A3D] hover:underline font-semibold">
              Md. Sabbir Hossain Bappy
            </a>
            {" "}at{" "}
            <a href="https://nowsin.me/" target="_blank" rel="noopener noreferrer"
              className="text-[#C19A3D] hover:underline font-semibold">
              Cyber Security Lab
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
