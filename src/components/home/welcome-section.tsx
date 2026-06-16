import { Reveal } from "./animations"

export function WelcomeSection() {
  return (
    <section className="relative overflow-hidden bg-[#FDF8EE] py-16 sm:py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(193,154,61,0.10),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(15,30,61,0.06),transparent_20%)]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal>
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
              Leadership voices
            </div>
            <h2 className="font-display text-[1.9rem] font-bold leading-[0.96] tracking-tight text-[#0F1E3D] sm:text-4xl md:text-5xl lg:text-6xl">
              A welcome from the leadership.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#0F1E3D]/70 sm:text-lg">
              JUST Debate Club is shaped not only by competition, but by community, discipline, and a shared commitment to thoughtful expression.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal delay={0.05}>
            <article
              className="overflow-hidden rounded-[2rem] border border-[#0F1E3D]/10 bg-white shadow-[0_20px_60px_rgba(15,30,61,0.08)]"
              style={{ contain: "layout paint style" }}
            >
              <div className="grid md:grid-cols-[0.88fr_1.12fr]">
                <div className="relative min-h-[320px] overflow-hidden bg-[#0F1E3D] sm:min-h-[380px] md:min-h-full">
                  <img
                    src="/images/home/president.jpg"
                    alt="President of JUST Debate Club"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E3D]/58 via-[#0F1E3D]/8 to-transparent" />
                  <div className="absolute left-4 top-4 inline-flex items-center rounded-full border border-white/18 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
                    President
                  </div>
                </div>

                <div className="relative p-6 sm:p-7 md:p-8">
                  <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                    Welcome note
                  </div>
                  <blockquote className="font-display text-[1.6rem] leading-[1.06] tracking-tight text-[#0F1E3D] sm:text-[1.85rem] md:text-[2.2rem]">
                    &ldquo;We believe debate is not only about winning arguments, but about building character, clarity, and conviction.&rdquo;
                  </blockquote>
                  <p className="mt-5 text-[15px] leading-7 text-[#0F1E3D]/72">
                    Our club stands for disciplined thought, respectful disagreement, and the courage to speak with reason. We invite every curious mind to grow with us through dialogue, competition, and shared learning.
                  </p>
                  <div className="mt-6 border-t border-[#0F1E3D]/10 pt-5">
                    <div className="font-display text-2xl leading-none text-[#0F1E3D]">President Name</div>
                    <div className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0F1E3D]/55">
                      President, JUST Debate Club
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.12}>
            <article
              className="overflow-hidden rounded-[2rem] border border-[#0F1E3D]/10 bg-[#0F1E3D] text-white shadow-[0_20px_60px_rgba(15,30,61,0.14)]"
              style={{ contain: "layout paint style" }}
            >
              <div className="grid md:grid-cols-[1.12fr_0.88fr]">
                <div className="relative p-6 sm:p-7 md:p-8 order-2 md:order-1">
                  <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                    General Secretary
                  </div>
                  <blockquote className="font-display text-[1.6rem] leading-[1.06] tracking-tight text-white sm:text-[1.85rem] md:text-[2.2rem]">
                    &ldquo;JUSTDC is a place where ideas are sharpened, friendships are built, and voices learn to carry purpose.&rdquo;
                  </blockquote>
                  <p className="mt-5 text-[15px] leading-7 text-white/76">
                    We are building a culture where members can think deeply, speak confidently, and represent the club with excellence. Whether you are experienced or just beginning, your voice has a place here.
                  </p>
                  <div className="mt-6 border-t border-white/12 pt-5">
                    <div className="font-display text-2xl leading-none text-white">Md. Sabbir Hossain Bappy</div>
                    <div className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
                      General Secretary, JUST Debate Club
                    </div>
                  </div>
                </div>

                <div className="relative min-h-[320px] overflow-hidden sm:min-h-[380px] md:min-h-full order-1 md:order-2">
                  <img
                    src="/images/home/general-secretary.jpg"
                    alt="General Secretary of JUST Debate Club"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E3D]/68 via-[#0F1E3D]/18 to-transparent" />
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
