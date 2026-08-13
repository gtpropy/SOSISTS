const keywords = [
  "Artificial Intelligence",
  "Robotics",
  "Python",
  "Chemistry",
  "Arduino",
  "Web Development",
  "Physics",
  "Research",
  "Cybersecurity",
  "Innovation",
  "Engineering",
  "STEM",
];

export function MarqueeStrip() {
  const loop = [...keywords, ...keywords];
  return (
    <div className="relative overflow-hidden border-y border-border bg-surface/60 py-4 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="animate-marquee flex w-max gap-10">
        {loop.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="flex items-center gap-2.5 font-mono text-sm text-muted-soft"
          >
            <span className="text-primary/40">/</span>
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
