"use client";

import { motion } from "framer-motion";
import { Bot, FlaskConical, TerminalSquare, MonitorSmartphone, CircuitBoard } from "lucide-react";

const tileVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ShowcaseGallery() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.1 }}
      className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4 md:grid-cols-4"
    >
      {/* Robotics — large tile */}
      <motion.div
        variants={tileVariants}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -4 }}
        className="group relative col-span-2 row-span-2 overflow-hidden rounded-2xl bg-gradient-to-br from-cyan/15 via-primary/10 to-transparent p-5 shadow-sm ring-1 ring-border sm:p-7"
      >
        <CircuitBoard
          size={140}
          strokeWidth={0.9}
          className="absolute -bottom-6 -right-6 text-cyan/20 transition-transform duration-500 group-hover:scale-110"
        />
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/15 text-cyan">
          <Bot size={22} strokeWidth={2.2} />
        </span>
        <p className="mt-6 font-display text-lg font-semibold text-foreground sm:text-xl">
          Robotics &amp; Automation
        </p>
        <p className="mt-1 text-sm text-muted">Arduino, sensors, and live demos.</p>
      </motion.div>

      {/* Smart board concept mockup — wide tile */}
      <motion.div
        variants={tileVariants}
        transition={{ duration: 0.5, delay: 0.05 }}
        whileHover={{ y: -4 }}
        className="group relative col-span-2 overflow-hidden rounded-2xl bg-gradient-to-br from-violet/15 to-transparent p-4 shadow-sm ring-1 ring-border sm:p-5"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet/15 text-violet">
            <MonitorSmartphone size={16} strokeWidth={2.2} />
          </span>
          <p className="font-display text-sm font-semibold text-foreground">Smart Classroom Display</p>
        </div>
        <div className="mt-3 rounded-lg border border-border-strong bg-surface/80 p-3 font-mono text-[10px] leading-relaxed text-muted-soft backdrop-blur-sm">
          <div className="flex items-center justify-between text-cyan">
            <span>Room 204 · Period 3</span>
            <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse-glow" />
          </div>
          <p className="mt-1 text-foreground">Physics — Substitute: Assigned</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background-alt">
            <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-violet to-cyan" />
          </div>
          <p className="mt-1 text-[9px] text-muted-soft">Attendance: 78% checked in</p>
        </div>
      </motion.div>

      {/* Chemistry */}
      <motion.div
        variants={tileVariants}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ y: -4 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-lime/15 to-transparent p-4 shadow-sm ring-1 ring-border sm:p-5"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime/15 text-lime">
          <FlaskConical size={18} strokeWidth={2.2} />
        </span>
        <p className="mt-3 font-display text-sm font-semibold text-foreground">Chemistry</p>
        <p className="mt-0.5 text-xs text-muted">Safe, hands-on demos.</p>
      </motion.div>

      {/* Code & Research */}
      <motion.div
        variants={tileVariants}
        transition={{ duration: 0.5, delay: 0.15 }}
        whileHover={{ y: -4 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 to-transparent p-4 shadow-sm ring-1 ring-border sm:p-5"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <TerminalSquare size={18} strokeWidth={2.2} />
        </span>
        <p className="mt-3 font-display text-sm font-semibold text-foreground">Code &amp; Research</p>
        <p className="mt-0.5 text-xs text-muted">Projects, not just theory.</p>
      </motion.div>
    </motion.div>
  );
}
