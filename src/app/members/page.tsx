import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Reveal } from "@/components/home/animations";

type Member = {
  id: string;
  full_name: string | null;
  slug: string | null;
  avatar_url: string | null;
  role: string | null;
  exec_position: string | null;
  batch_year: string | number | null;
  department: string | null;
  bio: string | null;
};

function normalizeText(value: string | null | undefined) {
  return value?.trim() || "";
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getMemberHref(member: Member) {
  return member.slug ? `/members/${member.slug}` : "#";
}

function getDisplayRole(member: Member) {
  return normalizeText(member.exec_position) || normalizeText(member.role) || "Member";
}

function getAvatar(member: Member) {
  const avatar = normalizeText(member.avatar_url);
  if (avatar) return avatar;

  const name = normalizeText(member.full_name) || "Member";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0F1E3D&color=F5E7BF&size=512`;
}

function MemberCard({
  member,
  featured = false,
  delay = 0,
}: {
  member: Member;
  featured?: boolean;
  delay?: number;
}) {
  const name = normalizeText(member.full_name) || "Unnamed Member";
  const role = getDisplayRole(member);
  const href = getMemberHref(member);
  const imageUrl = getAvatar(member);

  return (
    <Reveal delay={delay}>
      <Link href={href} className="group block h-full">
        <article
          className={[
            "h-full overflow-hidden rounded-[1.55rem] border border-[#0F1E3D]/10 bg-white shadow-[0_10px_30px_rgba(15,30,61,0.06)] transition-all duration-300",
            "group-hover:-translate-y-1 group-hover:shadow-[0_18px_50px_rgba(15,30,61,0.12)]",
            featured ? "ring-1 ring-[#C19A3D]/20" : "",
          ].join(" ")}
        >
          <div className="relative aspect-[4/4.9] overflow-hidden bg-[#0F1E3D]">
            <img
              src={imageUrl}
              alt={name}
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E3D]/24 via-transparent to-transparent" />

            {featured ? (
              <div className="absolute left-3 top-3 inline-flex items-center rounded-full border border-white/15 bg-[#0F1E3D]/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F5E7BF] backdrop-blur-md">
                Leadership
              </div>
            ) : null}

            {!normalizeText(member.avatar_url) ? (
              <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#C19A3D]/35 bg-[#0F1E3D]/80 text-[10px] font-semibold tracking-[0.16em] text-[#F5E7BF] backdrop-blur-md">
                {initials(name)}
              </div>
            ) : null}
          </div>

          <div className="bg-[#FDF8EE] p-3 sm:px-4 sm:py-4">
            <h2 className="font-display text-[1.4rem] leading-[0.92] tracking-tight text-[#0F1E3D] sm:text-[1.75rem]">
              {name}
            </h2>
            <p className="mt-1.5 text-[10px] sm:text-[11px] sm:mt-2 font-semibold uppercase tracking-[0.22em] text-[#0F1E3D]/58">
              {role}
            </p>
          </div>
        </article>
      </Link>
    </Reveal>
  );
}

export default async function MembersPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, slug, avatar_url, role, exec_position, batch_year, department, bio")
    .eq("is_verified", true)
    .order("exec_position", { ascending: true, nullsFirst: false })
    .order("full_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const members = (data ?? []) as Member[];
  const leadership = members.filter((member) => normalizeText(member.exec_position));
  const generalMembers = members.filter((member) => !normalizeText(member.exec_position));

  return (
    <main className="bg-white text-[#0F1E3D]">
      <section className="relative overflow-hidden -mt-16 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0B1731_0%,#0F1E3D_62%,#112449_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_22%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_83%_16%,rgba(193,154,61,0.14),transparent_16%),radial-gradient(circle_at_52%_100%,rgba(8,17,38,0.6),transparent_34%)]" />
        <div className="absolute inset-0 opacity-[0.12]">
          <div
            className="absolute left-1/2 top-[22%] h-[132%] w-[160%] -translate-x-1/2 [transform:perspective(1200px)_rotateX(74deg)]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)",
              backgroundSize: "44px 44px",
              backgroundPosition: "center center",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.9) 68%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.9) 68%, transparent 100%)",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,30,61,0.92)_0%,rgba(15,30,61,0.74)_30%,rgba(15,30,61,0.48)_58%,rgba(15,30,61,0.76)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#081126]/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FDF8EE] via-[#FDF8EE]/45 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[64vh] max-w-7xl items-center px-6 pt-30 pb-12 md:pt-34 md:pb-14">
          <div className="w-full">
            <div className="grid gap-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-end">
              <div className="max-w-4xl">
                <Reveal>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/90 backdrop-blur-md md:text-xs">
                    {/* <Sparkles className="size-3 text-[#C19A3D]" /> */}
                    Members Directory
                  </div>
                </Reveal>

                <Reveal delay={0.12}>
                  <h1 className="mt-6 max-w-4xl font-display text-[3.1rem] leading-[0.84] tracking-[-0.045em] text-white sm:text-[4rem] md:text-[4.9rem] lg:text-[5.4rem]">
                    Meet the people
                    <br />
                    behind the <span className="text-[#C19A3D] italic">voice</span>.
                  </h1>
                </Reveal>

                <Reveal delay={0.24}>
                  <p className="mt-6 max-w-2xl text-[1rem] leading-[1.8] text-white/82 md:text-[1.05rem]">
                    A compact directory of the people who shape the culture, conversations, and community of JUST Debate Club.
                  </p>
                </Reveal>
              </div>

              {/* <Reveal delay={0.42}>
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  <div className="rounded-[1.3rem] border border-white/10 bg-white/7 px-5 py-5 backdrop-blur-md">
                    <div className="mb-2 flex items-center gap-2 text-[#C19A3D]">
                      <Users className="size-4" />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.24em]">Members</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{members.length}</div>
                  </div>

                  <div className="rounded-[1.3rem] border border-white/10 bg-white/7 px-5 py-5 backdrop-blur-md">
                    <div className="mb-2 flex items-center gap-2 text-[#C19A3D]">
                      <Award className="size-4" />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.24em]">Leadership</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{leadership.length}</div>
                  </div>

                  <div className="rounded-[1.3rem] border border-white/10 bg-white/7 px-5 py-5 backdrop-blur-md">
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C19A3D]">
                      Layout
                    </div>
                    <div className="text-3xl font-bold text-white">4-up</div>
                  </div>
                </div>
              </Reveal> */}
            </div>
          </div>
        </div>
      </section>

      {leadership.length > 0 ? (
        <section className="relative overflow-hidden bg-[#FDF8EE] py-14 sm:py-18 md:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(193,154,61,0.10),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(15,30,61,0.06),transparent_20%)]" />
          <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
            <Reveal>
              <div className="mb-8">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                  Leadership voices
                </div>
                <h2 className="font-display text-[1.9rem] font-bold leading-[0.96] tracking-tight text-[#0F1E3D] sm:text-4xl md:text-5xl">
                  Executive committee
                </h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {leadership.map((member, index) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  featured={index < 2}
                  delay={0.04 + index * 0.03}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="relative overflow-hidden bg-white py-14 sm:py-18 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_22%,rgba(193,154,61,0.08),transparent_24%),radial-gradient(circle_at_84%_78%,rgba(15,30,61,0.05),transparent_22%)]" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <div className="mb-8">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C19A3D]">
                Community
              </div>
              <h2 className="font-display text-[1.9rem] font-bold leading-[0.96] tracking-tight text-[#0F1E3D] sm:text-4xl md:text-5xl">
                Club members
              </h2>
            </div>
          </Reveal>

          {generalMembers.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {generalMembers.map((member, index) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  delay={0.03 + index * 0.02}
                />
              ))}
            </div>
          ) : (
            <Reveal delay={0.08}>
              <div className="rounded-[1.6rem] border border-[#0F1E3D]/10 bg-[#FDF8EE] p-8 text-center">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
                  Directory
                </div>
                <h3 className="mt-3 font-display text-[2rem] leading-none text-[#0F1E3D]">
                  Member profiles coming soon
                </h3>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </main>
  );
}
