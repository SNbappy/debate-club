"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLink } from "lucide-react"

const HIDDEN = ["/login", "/signup", "/forgot-password", "/reset-password", "/dashboard", "/admin", "/verify"]

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
            <ul className="space-y-2.5 text-sm">
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
                  className="inline-flex items-center gap-1.5 text-white/72 hover:text-[#C19A3D] transition-colors">
                  Facebook <ExternalLink className="size-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center text-xs sm:text-sm text-white/50">
          <div>&copy; {new Date().getFullYear()} JUST Debate Club. All rights reserved.</div>
          <div>
            Built by{" "}
            <a href="https://github.com/SNbappy" target="_blank" rel="noopener noreferrer"
              className="text-[#C19A3D] hover:underline">
              Md. Sabbir Hossain Bappy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
