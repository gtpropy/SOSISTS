"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";

interface Snippet {
  text: string;
  top: string;
  left: string;
  depth: number;
  size: string;
  color: string;
  anim: string;
  rotate: number;
  delay: string;
}

const snippets: Snippet[] = [
  { text: "const ISTS = () => innovate();", top: "9%", left: "5%", depth: 14, size: "text-[11px] sm:text-xs", color: "text-primary/60", anim: "animate-float", rotate: -4, delay: "0s" },
  { text: "<Robotics active />", top: "16%", left: "78%", depth: 22, size: "text-xs sm:text-sm", color: "text-cyan/60", anim: "animate-float-slow", rotate: 3, delay: "0.6s" },
  { text: "while (curious) { learn(); }", top: "28%", left: "60%", depth: 10, size: "text-[11px] sm:text-xs", color: "text-violet/55", anim: "animate-float", rotate: 2, delay: "1.1s" },
  { text: "npm run build-future", top: "38%", left: "10%", depth: 18, size: "text-xs", color: "text-primary/50", anim: "animate-float-slow", rotate: -2, delay: "0.3s" },
  { text: "def hypothesis(x): return test(x)", top: "48%", left: "72%", depth: 16, size: "text-[11px] sm:text-xs", color: "text-lime/55", anim: "animate-float", rotate: -3, delay: "1.6s" },
  { text: "class Society(Innovation):", top: "58%", left: "4%", depth: 12, size: "text-xs", color: "text-cyan/55", anim: "animate-float-slow", rotate: 4, delay: "0.9s" },
  { text: "git commit -m \"build\"", top: "66%", left: "82%", depth: 20, size: "text-[11px] sm:text-xs", color: "text-violet/50", anim: "animate-float", rotate: -2, delay: "0.2s" },
  { text: "01001001 01010011 01010100 01010011", top: "74%", left: "22%", depth: 8, size: "text-[10px] sm:text-xs", color: "text-primary/45", anim: "animate-float-slow", rotate: 1, delay: "1.3s" },
  { text: "Arduino.begin(9600);", top: "82%", left: "62%", depth: 24, size: "text-xs sm:text-sm", color: "text-lime/50", anim: "animate-float", rotate: 3, delay: "0.5s" },
  { text: "{ status: \"building\" }", top: "12%", left: "40%", depth: 9, size: "text-[11px] sm:text-xs", color: "text-cyan/45", anim: "animate-float-slow", rotate: -3, delay: "1.9s" },
  { text: "SELECT * FROM ideas;", top: "90%", left: "8%", depth: 15, size: "text-xs", color: "text-violet/45", anim: "animate-float", rotate: 2, delay: "0.8s" },
  { text: "sudo learn --all", top: "5%", left: "88%", depth: 19, size: "text-[11px] sm:text-xs", color: "text-primary/55", anim: "animate-float-slow", rotate: -1, delay: "1.4s" },
];

function FloatingSnippet({
  s,
  sx,
  sy,
}: {
  s: Snippet;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}) {
  const x = useTransform(sx, (v) => v * s.depth);
  const y = useTransform(sy, (v) => v * s.depth);

  return (
    <motion.div
      className={`absolute font-mono whitespace-nowrap select-none ${s.size} ${s.color} ${s.anim}`}
      style={{
        top: s.top,
        left: s.left,
        x,
        y,
        rotate: s.rotate,
        animationDelay: s.delay,
      }}
    >
      {s.text}
    </motion.div>
  );
}

export function CodeBackground() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 40, damping: 18, mass: 0.4 });

  useEffect(() => {
    function handleMove(e: PointerEvent) {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    }
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [mx, my]);

  const blobX1 = useTransform(sx, (v) => v * -30);
  const blobY1 = useTransform(sy, (v) => v * -30);
  const blobX2 = useTransform(sx, (v) => v * 24);
  const blobY2 = useTransform(sy, (v) => v * 24);
  const blobX3 = useTransform(sx, (v) => v * -18);
  const blobY3 = useTransform(sy, (v) => v * 18);

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      <div className="absolute inset-0 bg-dot-grid opacity-70" />
      <div className="absolute inset-0 bg-grid opacity-40" />

      <motion.div
        className="animate-blob absolute -top-32 -left-24 h-[30rem] w-[30rem] rounded-full opacity-40 blur-[90px]"
        style={{
          x: blobX1,
          y: blobY1,
          background:
            "radial-gradient(circle at 30% 30%, var(--primary-light), transparent 70%)",
        }}
      />
      <motion.div
        className="animate-blob absolute top-1/3 -right-32 h-[26rem] w-[26rem] rounded-full opacity-40 blur-[90px]"
        style={{
          x: blobX2,
          y: blobY2,
          animationDelay: "3s",
          background: "radial-gradient(circle at 60% 40%, var(--cyan-light), transparent 70%)",
        }}
      />
      <motion.div
        className="animate-blob absolute bottom-0 left-1/4 h-[28rem] w-[28rem] rounded-full opacity-30 blur-[100px]"
        style={{
          x: blobX3,
          y: blobY3,
          animationDelay: "6s",
          background: "radial-gradient(circle at 40% 60%, var(--violet-light), transparent 70%)",
        }}
      />

      <div className="absolute inset-0">
        {snippets.map((s) => (
          <FloatingSnippet key={s.text} s={s} sx={sx} sy={sy} />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60" />
    </div>
  );
}
