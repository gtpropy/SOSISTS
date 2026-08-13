import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { EventCard } from "@/components/EventCard";
import { events } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events & Calendar | ISTS",
  description:
    "Weekly innovation seminars, monthly major events, the Grand Term Event, and inter-school collaboration — the event structure of ISTS.",
};

export default function EventsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Events"
        title="A rhythm that keeps ISTS active"
        description="Weekly learning, monthly builds, and a grand term-end showcase."
      />

      <section className="px-5 py-10 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>

        <Reveal className="mx-auto mt-6 max-w-6xl">
          <div className="card-surface p-6 text-center shadow-sm">
            <p className="text-sm leading-relaxed text-muted">
              Judged on creativity, accuracy, teamwork &amp; safety — with awards including{" "}
              <strong className="text-foreground">Best Innovation Project</strong> and{" "}
              <strong className="text-foreground">Most Promising Young Scientist</strong>.
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
