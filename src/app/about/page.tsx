import type { Metadata } from "next";
import { CheckCircle2, Target } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { ObjectivesAccordion } from "@/components/ObjectivesAccordion";
import { vision, mission, objectives } from "@/lib/data";

export const metadata: Metadata = {
  title: "About — Vision & Mission | ISTS",
  description:
    "The vision, mission, and objectives of the Innovation, Science & Technology Society (ISTS) at SOS Hermann Minor School.",
};

export default function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="About ISTS"
        title="Learn. Build. Innovate."
        description="A structured, student-led, teacher-supervised platform where curiosity becomes knowledge, knowledge becomes skill, and skill becomes innovation."
      />

      {/* VISION */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/5 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-cyan">
              <Target size={12} /> Vision
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
              A vibrant culture of scientific excellence
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
              {vision.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>

          <RevealGroup className="grid gap-3">
            {vision.aspirations.map((a) => (
              <RevealItem key={a}>
                <div className="card-surface flex items-start gap-3 p-4 shadow-sm">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-lime" strokeWidth={2.2} />
                  <p className="text-sm leading-relaxed text-foreground">{a}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* MISSION */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Mission"
            title="A structured, inspiring platform for STEM"
            description={mission.intro}
          />

          <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mission.items.map((item, i) => (
              <RevealItem key={item}>
                <div className="card-surface flex h-full gap-4 p-5 shadow-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-bold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed text-muted">{item}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* OBJECTIVES */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Section 5"
            title="Objectives of the Society"
            description="Six focus areas that guide everything ISTS plans and runs — from the classroom to the competition stage."
          />

          <div className="mt-12">
            <ObjectivesAccordion groups={objectives} />
          </div>
        </div>
      </section>
    </div>
  );
}
