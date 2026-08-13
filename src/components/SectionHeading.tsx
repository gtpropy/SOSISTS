import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  return (
    <Reveal className={`flex max-w-2xl flex-col gap-4 ${alignment} ${className}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse-glow" />
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && <p className="text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
    </Reveal>
  );
}
