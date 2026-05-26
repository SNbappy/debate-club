import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HeroSlider } from "@/components/home/hero-slider"
import { CountUp, Reveal } from "@/components/home/animations"
import { Trophy, Calendar, Mic, ArrowRight, Sparkles, MessageSquare, Award } from "lucide-react"

export default async function Home() {
  const supabase = await createClient()
  const [{ data: events }, { data: albums }, { count: memberCount }] = await Promise.all([
    supabase.from("events").select("*").eq("is_published", true).order("event_date", { ascending: false }).limit(3),
    supabase.from("gallery_albums").select("*").eq("is_published", true).order("created_at", { ascending: false }).limit(4),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_verified", true),
  ])

  return (
    <>
      <section className="relative min-h-screen flex items-center text-white overflow-hidden -mt-16">
        <HeroSlider />
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full pt-16">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md bg-white/5 text-xs uppercase tracking-[0.2em] mb-6">
              <Sparkles className="size-3 text-[#C19A3D]" /> Jashore University of Science and Technology
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6 max-w-4xl tracking-tight">
              Where <span className="text-[#C19A3D] italic font-serif">ideas</span> take stage.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg md:text-xl text-white/85 max-w-xl mb-10 leading-relaxed">
              JUST Debate Club is where Bangladesh&apos;s sharpest student voices are forged &mdash; through rigorous debate, public speaking, and intellectual discourse in both Bangla and English.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup">
                <Button size="lg" className="bg-[#C19A3D] hover:bg-[#A88330] text-black h-12 px-8 font-semibold">
                  Join the club <ArrowRight className="size-4 ml-2" />
                </Button>
              </Link>
              <Link href="/members">
                <Button size="lg" variant="outline" className="border-white/30 bg-white/5 hover:bg-white/15 text-white h-12 px-8 backdrop-blur-sm">
                  Meet our members
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#FDF8EE] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-[#C19A3D] mb-4 font-semibold">About JUSTDC</div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#0F1E3D] leading-[1.1]">
                Argue with purpose.<br />Persuade with grace.
              </h2>
              <p className="text-lg text-[#0F1E3D]/75 leading-relaxed mb-6">
                The premier debate society of Jashore University of Science and Technology &mdash; cultivating logical reasoning, articulate speech, and the courage to challenge ideas across two languages.
              </p>
              <Link href="/posts" className="inline-flex items-center text-[#0F1E3D] font-semibold hover:gap-3 gap-2 transition-all border-b-2 border-[#C19A3D] pb-1">
                Read our story <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-[#0F1E3D]">
              <img src="/images/about/about-1.jpg" alt="JUSTDC members" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0F1E3D]/40 via-transparent to-[#C19A3D]/10" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-3xl font-bold leading-tight">Built on debate.</div>
                <div className="text-sm opacity-90 mt-1">Sharpened by competition.</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#0F1E3D] py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,#C19A3D,transparent_60%)]" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: memberCount ?? 50, label: "Active members", suffix: "+" },
              { value: 25, label: "Tournaments", suffix: "+" },
              { value: 100, label: "Events held", suffix: "+" },
              { value: 5, label: "Years strong", suffix: "" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="border-l-2 border-[#C19A3D] pl-5">
                  <div className="text-5xl md:text-6xl font-bold mb-2 tracking-tight">
                    <CountUp end={s.value} />{s.suffix}
                  </div>
                  <div className="text-xs text-white/70 uppercase tracking-[0.2em]">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <div className="text-xs uppercase tracking-[0.2em] text-[#C19A3D] mb-3 font-semibold">What we do</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0F1E3D] leading-tight">More than just debate.</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Trophy, title: "Tournaments", desc: "Intra-university and national tournaments year-round." },
              { icon: Mic, title: "Public Speaking", desc: "Articulate, persuasive speech training from day one." },
              { icon: MessageSquare, title: "Bilingual Debate", desc: "Master debate in both Bangla and English formats." },
              { icon: Award, title: "Recognition", desc: "Earn verified achievements and digital certificates." },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full border-2 hover:border-[#C19A3D]/40 group">
                  <CardContent className="pt-8">
                    <div className="size-14 rounded-xl bg-[#0F1E3D] flex items-center justify-center mb-5 group-hover:bg-[#C19A3D] group-hover:rotate-6 transition-all duration-300">
                      <item.icon className="size-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-[#0F1E3D]">{item.title}</h3>
                    <p className="text-sm text-[#0F1E3D]/70 leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {events && events.length > 0 && (
        <section className="bg-[#FDF8EE] py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[#C19A3D] mb-3 font-semibold">Recent</div>
                  <h2 className="text-4xl md:text-5xl font-bold text-[#0F1E3D]">Events &amp; happenings</h2>
                </div>
                <Link href="/events" className="text-[#0F1E3D] font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all border-b-2 border-[#C19A3D] pb-1">
                  All events <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-6">
              {events.map((e, i) => (
                <Reveal key={e.id} delay={i * 0.1}>
                  <Link href={`/events/${e.slug}`}>
                    <Card className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden pt-0 group border-2 hover:border-[#C19A3D]/30">
                      <div className="aspect-video relative overflow-hidden bg-[#0F1E3D]">
                        {e.cover_image_url ? (
                          <img src={e.cover_image_url} alt={e.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#0F1E3D] to-[#1a2f5c] flex items-center justify-center"><Calendar className="size-12 text-white/30" /></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                      <CardContent className="pt-6">
                        <div className="text-xs uppercase tracking-[0.15em] text-[#C19A3D] mb-2 font-semibold">
                          {new Date(e.event_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                        <h3 className="text-xl font-bold text-[#0F1E3D] line-clamp-2 group-hover:text-[#C19A3D] transition-colors">{e.title}</h3>
                        {e.location && <p className="text-sm text-[#0F1E3D]/60 mt-2">{e.location}</p>}
                      </CardContent>
                    </Card>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {albums && albums.length > 0 && (
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[#C19A3D] mb-3 font-semibold">Moments</div>
                  <h2 className="text-4xl md:text-5xl font-bold text-[#0F1E3D]">From the gallery</h2>
                </div>
                <Link href="/gallery" className="text-[#0F1E3D] font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all border-b-2 border-[#C19A3D] pb-1">
                  Full gallery <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {albums.slice(0, 4).map((a, i) => (
                <Reveal key={a.id} delay={i * 0.05}>
                  <Link href={`/gallery/${a.slug}`} className="block group">
                    <div className="aspect-square rounded-xl overflow-hidden relative bg-[#FDF8EE]">
                      {a.cover_image_url && <img src={a.cover_image_url} alt={a.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E3D] via-[#0F1E3D]/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="text-sm font-bold line-clamp-1">{a.title}</div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative py-24 md:py-32 overflow-hidden bg-[#0F1E3D] text-white">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute -top-32 -left-32 size-96 rounded-full bg-[#C19A3D] blur-3xl" />
          <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-[#C19A3D] blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-[1.05]">
              Ready to find <span className="text-[#C19A3D] italic font-serif">your voice</span>?
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether you&apos;re a seasoned debater or just curious, there&apos;s a place for you at the JUSTDC podium.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-[#C19A3D] hover:bg-[#A88330] text-black h-12 px-8 font-semibold">
                  Join now <ArrowRight className="size-4 ml-2" />
                </Button>
              </Link>
              <Link href="/events">
                <Button size="lg" variant="outline" className="border-white/30 bg-white/5 hover:bg-white/15 text-white h-12 px-8 backdrop-blur-sm">
                  See upcoming events
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

