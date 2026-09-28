import type { Metadata } from "next";
import { CheckCircle2, Target, Compass } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { ObjectivesAccordion } from "@/components/ObjectivesAccordion";
import { vision, mission, objectives } from "@/lib/data";

export const metadata: Metadata = {
  title: "About — Vision & Mission | ISTS",
  description:
    "The vision, mission, and objectives of the Innovation, Science & Technology Society (ISTS) at SOS Hermann Gmeiner School.",
};

export default function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="About ISTS"
        title="Learn. Build. Innovate."
        description="Curiosity becomes knowledge. Knowledge becomes skill. Skill becomes innovation."
      />

      {/* VISION + MISSION */}
      <section className="px-5 py-10 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <Reveal className="card-surface p-7 shadow-sm sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/5 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-cyan">
              <Target size={12} /> Vision
            </span>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{vision.body}</p>
            <ul className="mt-5 flex flex-col gap-2">
              {vision.aspirations.map((a) => (
                <li key={a} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-lime" strokeWidth={2.2} />
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08} className="card-surface p-7 shadow-sm sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-primary">
              <Compass size={12} /> Mission
            </span>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{mission.intro}</p>
            <ul className="mt-5 flex flex-col gap-2">
              {mission.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" strokeWidth={2.2} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* OBJECTIVES */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Objectives" title="What we're building toward" />

          <div className="mt-10">
            <ObjectivesAccordion groups={objectives} />
          </div>
        </div>
      </section>
    </div>
  );
}
