"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { verifyAdminKey } from "@/lib/adminAuth";

interface AdminContextValue {
  unlocked: boolean;
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  unlock: (key: string) => Promise<boolean>;
  lock: () => void;
  rotationOverrides: Record<string, number>;
  setRotation: (file: string, degrees: number) => void;
  resetRotations: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

// --- unlocked flag: same module-level + useSyncExternalStore pattern as SoundProvider ---
const UNLOCK_KEY = "ists-admin-unlocked";
const unlockListeners = new Set<() => void>();
let cachedUnlocked = false;
let hydratedUnlocked = false;

function notifyUnlock() {
  unlockListeners.forEach((l) => l());
}
function subscribeUnlock(l: () => void) {
  unlockListeners.add(l);
  return () => unlockListeners.delete(l);
}
function getUnlockSnapshot() {
  if (!hydratedUnlocked) {
    hydratedUnlocked = true;
    cachedUnlocked = window.localStorage.getItem(UNLOCK_KEY) === "true";
  }
  return cachedUnlocked;
}
function getUnlockServerSnapshot() {
  return false;
}
function setUnlockedFlag(value: boolean) {
  cachedUnlocked = value;
  if (value) window.localStorage.setItem(UNLOCK_KEY, "true");
  else window.localStorage.removeItem(UNLOCK_KEY);
  notifyUnlock();
}

// --- per-photo rotation overrides the admin sets while looking at the live site ---
const ROTATIONS_KEY = "ists-admin-rotation-overrides";
const rotationListeners = new Set<() => void>();
let cachedRotations: Record<string, number> = {};
let hydratedRotations = false;

function notifyRotations() {
  rotationListeners.forEach((l) => l());
}
function subscribeRotations(l: () => void) {
  rotationListeners.add(l);
  return () => rotationListeners.delete(l);
}
function getRotationsSnapshot() {
  if (!hydratedRotations) {
    hydratedRotations = true;
    try {
      const stored = window.localStorage.getItem(ROTATIONS_KEY);
      if (stored) cachedRotations = JSON.parse(stored);
    } catch {
      cachedRotations = {};
    }
  }
  return cachedRotations;
}
const EMPTY_ROTATIONS: Record<string, number> = {};
function getRotationsServerSnapshot(): Record<string, number> {
  return EMPTY_ROTATIONS;
}
function persistRotations(next: Record<string, number>) {
  cachedRotations = next;
  window.localStorage.setItem(ROTATIONS_KEY, JSON.stringify(next));
  notifyRotations();
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const unlocked = useSyncExternalStore(
    subscribeUnlock,
    getUnlockSnapshot,
    getUnlockServerSnapshot,
  );
  const rotationOverrides = useSyncExternalStore(
    subscribeRotations,
    getRotationsSnapshot,
    getRotationsServerSnapshot,
  );
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const unlock = useCallback(async (key: string) => {
    const ok = await verifyAdminKey(key);
    if (ok) {
      setUnlockedFlag(true);
      setModalOpen(false);
    }
    return ok;
  }, []);

  const lock = useCallback(() => setUnlockedFlag(false), []);

  const setRotation = useCallback((file: string, degrees: number) => {
    const normalized = ((degrees % 360) + 360) % 360;
    const next = { ...cachedRotations };
    if (normalized === 0) delete next[file];
    else next[file] = normalized;
    persistRotations(next);
  }, []);

  const resetRotations = useCallback(() => persistRotations({}), []);

  return (
    <AdminContext.Provider
      value={{
        unlocked,
        modalOpen,
        openModal,
        closeModal,
        unlock,
        lock,
        rotationOverrides,
        setRotation,
        resetRotations,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
