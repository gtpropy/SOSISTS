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

interface MusicContextValue {
  enabled: boolean;
  toggle: () => void;
  attemptPlay: () => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

const STORAGE_KEY = "ists-music-enabled";
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

export function MusicProvider({ children }: { children: ReactNode }) {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = 0.22;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (enabled) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [enabled]);

  const attemptPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !cachedEnabled) return;
    audio.play().catch(() => {});
  }, []);

  const toggle = useCallback(() => {
    setEnabled(!cachedEnabled);
  }, []);

  return (
    <MusicContext.Provider value={{ enabled, toggle, attemptPlay }}>
      {children}
      <audio ref={audioRef} src="/audio/background-music.mp3" loop preload="none" />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
}
