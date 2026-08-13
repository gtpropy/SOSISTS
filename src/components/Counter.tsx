"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CounterProps {
  value: string;
  className?: string;
}

export function Counter({ value, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const numericMatch = value.match(/^(\d+)(.*)$/);
  const [display, setDisplay] = useState(numericMatch ? "0" : value);

  useEffect(() => {
    if (!inView || !numericMatch) return;
    const target = parseInt(numericMatch[1], 10);
    const suffix = numericMatch[2];
    const durationMs = 900;
    const start = performance.now();

    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      setDisplay(`${current}${suffix}`);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
