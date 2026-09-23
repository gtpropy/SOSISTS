"use client";

import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { sicGalleryPhotos } from "@/lib/data";
import { useAdmin } from "@/components/AdminProvider";

/**
 * Masonry-style photo wall for the School Innovation Challenge (SIC 2026).
 *
 * The source photos are served from an external host (see `sicGallery.baseUrl`
 * in the site content). They are loaded straight from that host by the
 * visitor's browser and are intentionally lazy-loaded so the page stays light.
 * To self-host instead, drop the files into `public/` and point `baseUrl`
 * at the local path — nothing else needs to change.
 *
 * A few of the source photos were shot/exported sideways or upside-down.
 * `sicGallery.rotations` in site.json is the permanent, shipped fix (filename
 * -> clockwise degrees). On top of that, an unlocked admin (see AdminProvider
 * / AdminBar) can nudge any photo's rotation live on the site — those tweaks
 * land in AdminProvider's rotationOverrides (persisted to localStorage on
 * their device) and win over the shipped value, so the admin can preview a
 * fix immediately, then use "Copy fix list" in the admin bar to hand the
 * final values back for a permanent commit to site.json.
 *
 * Rendering:
 *  - 90/270: the tile switches to a fixed square with `object-fit: cover` so
 *    the box stays correctly sized without needing the original pixel
 *    dimensions (a plain `transform: rotate()` would otherwise leave the
 *    surrounding masonry gap sized for the un-rotated image).
 *  - 180: no box-size change needed, so the image just flips in place within
 *    its normal masonry tile.
 */
export function EventGallery() {
  const { unlocked, rotationOverrides, setRotation } = useAdmin();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4 [&>*]:mb-3 sm:[&>*]:mb-4"
    >
      {sicGalleryPhotos.map((photo, i) => {
        const rotate = rotationOverrides[photo.file] ?? photo.rotate;
        const isSideways = rotate === 90 || rotate === 270;
        const alt = `School Innovation Challenge 2026 — photo ${i + 1}`;

        return (
          <a
            key={photo.url}
            href={photo.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative block break-inside-avoid overflow-hidden rounded-2xl bg-background-alt shadow-sm ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-primary/30 ${
              isSideways ? "aspect-square" : ""
            }`}
          >
            {isSideways ? (
              <div className="h-full w-full" style={{ transform: `rotate(${rotate}deg)` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo.url}
                alt={alt}
                loading="lazy"
                decoding="async"
                style={rotate === 180 ? { transform: "rotate(180deg)" } : undefined}
                className="w-full transition-transform duration-500 group-hover:scale-[1.04]"
              />
            )}

            {unlocked && (
              <button
                type="button"
                aria-label="Rotate photo 90°"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setRotation(photo.file, rotate + 90);
                }}
                className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-foreground/60 text-white backdrop-blur-sm transition-colors hover:bg-primary cursor-pointer"
              >
                <RotateCw size={14} />
              </button>
            )}
          </a>
        );
      })}
    </motion.div>
  );
}
