"use client";

import { motion } from "framer-motion";

function flamePath(s: number) {
  const t = -9 * s;
  const b = 9 * s;
  const w = 6 * s;
  const w2 = 3.31 * s;
  const m = -2 * s;
  const m2 = 6.31 * s;
  return `M0,${t} C0,${t} ${-w},${m} ${-w},${3 * s} C${-w},${m2} ${-w2},${b} 0,${b} C${w2},${b} ${w},${m2} ${w},${3 * s} C${w},${m} 0,${t} 0,${t} Z`;
}

const OUTER = flamePath(6.5);
const MID = flamePath(4.6);
const CORE = flamePath(2.9);

export function FireGlow({ stage, className }: { stage: number; className?: string }) {
  const scale = Math.min(stage / 3, 1);
  const flameOpacity = stage <= 4 ? 1 : Math.max(0, 1 - (stage - 4) / 1.4);
  const coolOpacity = stage >= 4 ? Math.min(1, (stage - 4) / 1.4) : 0;

  return (
    <motion.svg
      viewBox="-60 -90 120 120"
      className={className}
      animate={{ scale: scale > 0 ? 0.35 + scale * 0.65 : 0, opacity: scale > 0 ? 1 : 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      aria-hidden
    >
      <defs>
        <radialGradient id="introCoolGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="45%" stopColor="var(--cyan-light, #22d3ee)" />
          <stop offset="100%" stopColor="var(--primary-light, #6366f1)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.g animate={{ opacity: flameOpacity }} transition={{ duration: 0.8 }}>
        <motion.path
          d={OUTER}
          fill="var(--amber, #d97706)"
          animate={{ scaleX: [1, 1.07, 0.95, 1], scaleY: [1, 0.96, 1.04, 1] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "0px 25px" }}
        />
        <motion.path
          d={MID}
          fill="#f59e0b"
          animate={{ scaleX: [1, 0.93, 1.06, 1], scaleY: [1, 1.05, 0.95, 1] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
          style={{ transformOrigin: "0px 18px" }}
        />
        <motion.path
          d={CORE}
          fill="#fde68a"
          animate={{ scaleX: [1, 1.09, 0.94, 1] }}
          transition={{ duration: 1.05, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          style={{ transformOrigin: "0px 12px" }}
        />
      </motion.g>

      <motion.g animate={{ opacity: coolOpacity }} transition={{ duration: 0.8 }}>
        <motion.circle
          cx="0"
          cy="0"
          r="34"
          fill="url(#introCoolGlow)"
          animate={{ scale: [1, 1.14, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="0" cy="0" r="9" fill="#f0f9ff" />
      </motion.g>
    </motion.svg>
  );
}
