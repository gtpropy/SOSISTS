import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FocusAreaDetail } from "@/components/FocusAreaDetail";
import { Reveal } from "@/components/Reveal";
import { focusAreas } from "@/lib/data";

export const metadata: Metadata = {
  title: "Focus Areas | ISTS",
  description:
    "Chemistry & Scientific Exploration, Physics & Engineering, Robotics & Automation, and Innovation & Research — the core focus areas of ISTS.",
};

export default function FocusAreasPage() {
  return (
    <div>
      <PageHero
        eyebrow="Focus Areas"
        title="Four disciplines. One mission."
        description="Hands-on, supervised, and built for beginners and builders alike."
      />

      <section className="px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-16 pb-10">
          {focusAreas.map((area, i) => (
            <FocusAreaDetail key={area.id} area={area} reverse={i % 2 === 1} />
          ))}
        </div>

        <Reveal className="mx-auto mt-4 max-w-6xl">
          <div className="card-surface flex flex-col items-start gap-4 border-amber/20 bg-amber/5 p-6 shadow-sm sm:flex-row sm:items-center">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber/15 text-amber">
              <ShieldAlert size={20} strokeWidth={2.2} />
            </span>
            <p className="text-sm leading-relaxed text-muted">
              <strong className="text-foreground">Safety first.</strong> Every hands-on activity
              runs under teacher supervision with approved, low-voltage equipment.
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
