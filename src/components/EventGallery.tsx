"use client";

import { motion } from "framer-motion";
import { sicGalleryUrls } from "@/lib/data";

/**
 * Masonry-style photo wall for the School Innovation Challenge (SIC 2026).
 *
 * The source photos are served from an external host (see `sicGallery.baseUrl`
 * in the site content). They are loaded straight from that host by the
 * visitor's browser and are intentionally lazy-loaded so the page stays light.
 * To self-host instead, drop the files into `public/` and point `baseUrl`
 * at the local path — nothing else needs to change.
 */
export function EventGallery() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4 [&>*]:mb-3 sm:[&>*]:mb-4"
    >
      {sicGalleryUrls.map((url, i) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block break-inside-avoid overflow-hidden rounded-2xl bg-background-alt shadow-sm ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-primary/30"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={`School Innovation Challenge 2026 — photo ${i + 1}`}
            loading="lazy"
            decoding="async"
            className="w-full transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </a>
      ))}
    </motion.div>
  );
}
