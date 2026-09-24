import type { Metadata } from "next";
import Image from "next/image";
import { Crown, Users2 } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { MemberStoryReel } from "@/components/MemberStoryReel";
import { Reveal } from "@/components/Reveal";
import { executiveTeam, generalMembers, siteMeta } from "@/lib/data";

export const metadata: Metadata = {
  title: "Executive Team | ISTS",
  description:
    "Meet the executive committee and members of the Innovation, Science & Technology Society (ISTS) at SOS Hermann Gmeiner School.",
};

const president = executiveTeam[0];
const reelMembers = [...executiveTeam.slice(1), ...generalMembers];

export default function TeamPage() {
  return (
    <div>
      <PageHero
        eyebrow="Team"
        title="The people building ISTS"
        description="A student-led executive committee, working under faculty supervision."
      />

      {/* PRESIDENT / FOUNDER */}
      <section className="px-5 py-10 sm:px-8">
        <Reveal className="mx-auto max-w-3xl">
          <div className="card-surface glow-primary relative overflow-hidden text-center shadow-lg">
            <div className="relative h-64 overflow-hidden bg-background-alt sm:h-72">
              <div className="bg-dot-grid absolute inset-0 opacity-70" />
              <div className="animate-blob absolute -top-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/25 to-violet/25 blur-3xl" />
              <span aria-hidden className="absolute left-4 top-4 h-3 w-3 border-l border-t border-border" />
              <span aria-hidden className="absolute right-4 top-4 h-3 w-3 border-r border-t border-border" />
              <span className="absolute left-1/2 top-5 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-primary">
                <Crown size={13} /> President &amp; Founder
              </span>
              {president.image ? (
                <Image
                  src={president.image}
                  alt={president.name}
                  fill
                  sizes="320px"
                  className="object-contain object-bottom drop-shadow-[0_18px_22px_rgba(15,23,42,0.3)]"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary via-violet to-cyan font-display text-2xl font-bold text-white shadow-lg">
                    {president.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                </div>
              )}
            </div>
            <div className="relative p-8 sm:p-10">
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                {president.name}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                {president.bio ??
                  `Leads ${siteMeta.shortName} and represents the society to the school administration.`}
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* MEMBER STORY REEL */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Executive Committee & Members"
            title="One role each. One team together."
            description="Scroll through, or just let it play."
          />

          <div className="mt-14">
            <MemberStoryReel members={reelMembers} />
          </div>

          <Reveal className="mt-16">
            <div className="card-surface flex items-center gap-4 p-6 shadow-sm">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime/10 text-lime">
                <Users2 size={20} strokeWidth={2.2} />
              </span>
              <p className="text-sm leading-relaxed text-muted">
                No prior experience required — just curiosity, discipline, and a willingness to
                learn.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
