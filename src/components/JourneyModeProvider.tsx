"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface JourneyModeContextValue {
  active: boolean;
  start: () => void;
  stop: () => void;
}

const JourneyModeContext = createContext<JourneyModeContextValue | null>(null);

export function JourneyModeProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);

  return (
    <JourneyModeContext.Provider
      value={{
        active,
        start: () => setActive(true),
        stop: () => setActive(false),
      }}
    >
      {children}
    </JourneyModeContext.Provider>
  );
}

export function useJourneyMode() {
  const ctx = useContext(JourneyModeContext);
  if (!ctx) throw new Error("useJourneyMode must be used within JourneyModeProvider");
  return ctx;
}
