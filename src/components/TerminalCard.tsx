"use client";

import { motion } from "framer-motion";

const lines = [
  { t: "text-muted-soft", c: "$ ists --status" },
  { t: "text-lime", c: "> society: active" },
  { t: "text-cyan", c: "> members: 18" },
  { t: "text-violet", c: "> focus: [chem, physics, robotics, research]" },
  { t: "text-primary", c: "> next_event: weekly_seminar.mon" },
  { t: "text-foreground", c: "$ run learn_build_innovate()" },
];

export function TerminalCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: 2 }}
      animate={{ opacity: 1, y: 0, rotate: 2 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ rotate: 0, y: -4 }}
      className="glow-primary card-surface w-full max-w-sm overflow-hidden shadow-2xl"
    >
      <div className="flex items-center gap-1.5 border-b border-border bg-background-alt px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[11px] text-muted-soft">ists.sh</span>
      </div>
      <div className="space-y-2 p-5 font-mono text-[12.5px] leading-relaxed">
        {lines.map((l, i) => (
          <motion.p
            key={l.c}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + i * 0.28, duration: 0.35 }}
            className={l.t}
          >
            {l.c}
          </motion.p>
        ))}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 + lines.length * 0.28 }}
          className="animate-caret inline-block h-3.5 w-[7px] bg-primary align-middle"
        />
      </div>
    </motion.div>
  );
}
