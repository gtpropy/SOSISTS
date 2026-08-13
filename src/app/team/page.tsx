import type { Metadata } from "next";
import { Crown, Megaphone, Users2 } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { MemberCard } from "@/components/MemberCard";
import { Reveal } from "@/components/Reveal";
import { executiveTeam, generalMembers, siteMeta } from "@/lib/data";

export const metadata: Metadata = {
  title: "Executive Team | ISTS",
  description:
    "Meet the executive committee and members of the Innovation, Science & Technology Society (ISTS) at SOS Hermann Minor School.",
};

const president = executiveTeam[0];
const restOfExec = executiveTeam.slice(1).filter((m) => m.role !== "Media & Outreach");
const mediaTeam = executiveTeam.filter((m) => m.role === "Media & Outreach");

export default function TeamPage() {
  return (
    <div>
      <PageHero
        eyebrow="Section 8 — Organizational Structure"
        title="The people building ISTS"
        description="A student-led executive committee working under faculty supervision — every role built for accountability, leadership, and growth."
      />

      {/* PRESIDENT / FOUNDER */}
      <section className="px-5 py-10 sm:px-8">
        <Reveal className="mx-auto max-w-3xl">
          <div className="card-surface glow-primary relative overflow-hidden p-8 text-center shadow-lg sm:p-10">
            <div className="animate-blob absolute -top-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 to-violet/20 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-primary">
                <Crown size={13} /> President &amp; Founder
              </span>
              <div className="mx-auto mt-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary via-violet to-cyan font-display text-2xl font-bold text-white shadow-lg">
                {president.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
                {president.name}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                Provides overall leadership to the society — planning major initiatives,
                coordinating with faculty supervisors, guiding executive members, and
                representing {siteMeta.shortName} before the school administration.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* EXECUTIVE COMMITTEE */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Executive Committee"
            title="One role each. One team together."
            description="Coordinators spanning operations, finance, technology, events, and research."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {restOfExec.map((member, i) => (
              <MemberCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* MEDIA & OUTREACH POD */}
      <section className="px-5 py-4 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-8 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet/10 text-violet">
              <Megaphone size={18} strokeWidth={2.2} />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Media &amp; Outreach Team
              </h3>
              <p className="text-sm text-muted">
                Posters, announcements, photography, and promotional content.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-3">
            {mediaTeam.map((member, i) => (
              <MemberCard key={member.name} member={member} index={i} compact />
            ))}
          </div>
        </div>
      </section>

      {/* GENERAL MEMBERS */}
      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="General Members"
            title="The builders behind every project"
            description="Every member — new or experienced — contributes directly to seminars, workshops, and showcases."
          />

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {generalMembers.map((member, i) => (
              <MemberCard key={member.name} member={member} index={i} compact />
            ))}
          </div>

          <Reveal className="mt-10">
            <div className="card-surface flex items-center gap-4 p-6 shadow-sm">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime/10 text-lime">
                <Users2 size={20} strokeWidth={2.2} />
              </span>
              <p className="text-sm leading-relaxed text-muted">
                ISTS is inclusive by design — membership welcomes both talented and beginner
                students. No prior experience in science, coding, or robotics is required, only
                curiosity, discipline, and a willingness to learn.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
