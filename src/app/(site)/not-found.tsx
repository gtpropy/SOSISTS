import Link from "next/link";
import { TerminalSquare, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <TerminalSquare size={28} strokeWidth={1.8} />
      </span>
      <p className="mt-6 font-mono text-sm text-muted-soft">error 404</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
        This page hasn&apos;t been built yet.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
        The page you&apos;re looking for doesn&apos;t exist — but there&apos;s plenty more to
        explore at ISTS.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>
    </div>
  );
}
