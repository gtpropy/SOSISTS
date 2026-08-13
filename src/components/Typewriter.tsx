"use client";

import { useEffect, useState } from "react";
import { useSound } from "@/components/SoundProvider";

interface TypewriterProps {
  text: string;
  className?: string;
  startDelay?: number;
  speed?: number;
  onDone?: () => void;
}

export function Typewriter({ text, className, startDelay = 300, speed = 55, onDone }: TypewriterProps) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const { play } = useSound();

  useEffect(() => {
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setShown(text.slice(0, i));
        if (i % 2 === 0) play("type");
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
          onDone?.();
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, startDelay, speed]);

  return (
    <span className={className}>
      {shown}
      <span
        className="animate-caret inline-block w-[3px] -mb-1 h-[0.85em] ml-1 bg-primary"
        style={{ animationPlayState: done ? "running" : "paused", opacity: done ? undefined : 1 }}
      />
    </span>
  );
}
