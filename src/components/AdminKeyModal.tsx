"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KeyRound, X } from "lucide-react";
import { useAdmin } from "@/components/AdminProvider";

export function AdminKeyModal() {
  const { modalOpen, closeModal, unlock } = useAdmin();
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleClose = () => {
    setValue("");
    setError(false);
    closeModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value || checking) return;
    setChecking(true);
    const ok = await unlock(value);
    setChecking(false);
    if (!ok) {
      setError(true);
      setValue("");
    }
  };

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-foreground/40 p-5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Admin key"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="card-surface relative w-full max-w-xs p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close"
              onClick={handleClose}
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-muted-soft transition-colors hover:bg-background-alt hover:text-foreground cursor-pointer"
            >
              <X size={14} />
            </button>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <KeyRound size={18} strokeWidth={2.2} />
            </span>
            <h2 className="mt-3 font-display text-base font-bold text-foreground">Admin key</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Enter the admin passphrase to unlock photo rotation controls.
            </p>

            <form onSubmit={handleSubmit} className="mt-4">
              <input
                type="password"
                autoFocus
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(false);
                }}
                placeholder="Passphrase"
                className={`w-full rounded-lg border bg-background-alt px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-soft ${
                  error ? "border-red-500" : "border-border focus:border-primary/50"
                }`}
              />
              {error && <p className="mt-1.5 text-xs text-red-500">Incorrect key.</p>}

              <button
                type="submit"
                disabled={!value || checking}
                className="mt-4 w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {checking ? "Checking…" : "Unlock"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
