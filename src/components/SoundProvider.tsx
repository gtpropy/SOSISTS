"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { primeAudio, sfx } from "@/lib/sound";

type SfxName = keyof typeof sfx;

interface SoundContextValue {
  enabled: boolean;
  toggle: () => void;
  play: (name: SfxName) => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

const STORAGE_KEY = "ists-sound-enabled";
const listeners = new Set<() => void>();
let cachedEnabled = true;
let hydratedFromStorage = false;

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  if (!hydratedFromStorage) {
    hydratedFromStorage = true;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null) cachedEnabled = stored === "true";
  }
  return cachedEnabled;
}

function getServerSnapshot() {
  return true;
}

function setEnabled(value: boolean) {
  cachedEnabled = value;
  window.localStorage.setItem(STORAGE_KEY, String(value));
  notify();
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const primed = useRef(false);

  useEffect(() => {
    const primeOnce = () => {
      if (primed.current) return;
      primed.current = true;
      primeAudio();
    };
    window.addEventListener("pointerdown", primeOnce, { once: true });
    window.addEventListener("keydown", primeOnce, { once: true });
    return () => {
      window.removeEventListener("pointerdown", primeOnce);
      window.removeEventListener("keydown", primeOnce);
    };
  }, []);

  const play = useCallback(
    (name: SfxName) => {
      if (!enabled) return;
      sfx[name]();
    },
    [enabled],
  );

  const toggle = useCallback(() => {
    const next = !cachedEnabled;
    setEnabled(next);
    if (next) sfx.toggleOn();
    else sfx.toggleOff();
  }, []);

  return (
    <SoundContext.Provider value={{ enabled, toggle, play }}>{children}</SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}
