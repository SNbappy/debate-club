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
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="JUSTDC" className="size-12 rounded-full"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
              <div>
                <div className="font-bold text-xl">JUST Debate Club</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/60">Jashore University of Science and Technology</div>
              </div>
            </div>
            <p className="text-white/70 leading-relaxed max-w-md">Where ideas take stage. Cultivating articulate minds and sharp arguments at JUST.</p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#C19A3D] font-semibold mb-4">Explore</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/members" className="text-white/80 hover:text-[#C19A3D]">Members</Link></li>
              <li><Link href="/posts" className="text-white/80 hover:text-[#C19A3D]">Posts</Link></li>
              <li><Link href="/events" className="text-white/80 hover:text-[#C19A3D]">Events</Link></li>
              <li><Link href="/gallery" className="text-white/80 hover:text-[#C19A3D]">Gallery</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#C19A3D] font-semibold mb-4">Get involved</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/signup" className="text-white/80 hover:text-[#C19A3D]">Join the club</Link></li>
              <li><Link href="/login" className="text-white/80 hover:text-[#C19A3D]">Member login</Link></li>
              <li><a href="https://facebook.com/JUSTdebateclub" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[#C19A3D] inline-flex items-center gap-1">Facebook <ExternalLink className="size-3" /></a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-sm text-white/60">
          <div>&copy; {new Date().getFullYear()} JUST Debate Club. All rights reserved.</div>
          <div>Built by <a href="https://github.com/SNbappy" className="text-[#C19A3D] hover:underline">Md. Sabbir Hossain Bappy</a></div>
        </div>
      </div>
    </footer>
  )
}
