import type { SVGProps } from "react";

/**
 * Hand-drawn concept icons for the four focus areas, used by the orbiting
 * "A quick look" showcase on the homepage. Each is a self-contained inline
 * SVG (`currentColor` stroke/fill so it inherits the accent color passed
 * via className) sized on a 64x64 viewBox.
 */

type IconProps = SVGProps<SVGSVGElement>;

/** Physics — a Rutherford atomic model: a central nucleus with three
 * intersecting elliptical electron orbits. */
export function PhysicsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g stroke="currentColor" strokeWidth="1.6" opacity="0.85">
        <ellipse cx="32" cy="32" rx="27" ry="10.5" />
        <ellipse cx="32" cy="32" rx="27" ry="10.5" transform="rotate(60 32 32)" />
        <ellipse cx="32" cy="32" rx="27" ry="10.5" transform="rotate(120 32 32)" />
      </g>
      <circle cx="32" cy="32" r="6" fill="currentColor" />
      <circle cx="32" cy="32" r="9" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <circle cx="58.5" cy="32" r="2.4" fill="currentColor" />
      <circle cx="18.5" cy="12.9" r="2.4" fill="currentColor" transform="rotate(60 32 32)" />
      <circle cx="45.5" cy="12.9" r="2.4" fill="currentColor" transform="rotate(120 32 32)" />
    </svg>
  );
}

/** Chemistry — an Erlenmeyer flask, half-filled with liquid, with bubbles
 * rising from a reaction. */
export function ChemistryIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <clipPath id="flask-body">
          <path d="M26 8 L26 23 L9 53 A4 4 0 0 0 13 58 H51 A4 4 0 0 0 55 53 L38 23 L38 8 Z" />
        </clipPath>
      </defs>

      <path
        d="M32 39 C 26 37, 20 40, 12 39 L 9 53 A4 4 0 0 0 13 58 H51 A4 4 0 0 0 55 53 L 52 39 C 44 40, 38 37, 32 39 Z"
        fill="currentColor"
        opacity="0.22"
        clipPath="url(#flask-body)"
      />

      <path
        d="M26 8 L26 23 L9 53 A4 4 0 0 0 13 58 H51 A4 4 0 0 0 55 53 L38 23 L38 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M23 8 H41" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />

      <circle cx="27" cy="33" r="1.7" fill="currentColor" />
      <circle cx="34" cy="27" r="1.3" fill="currentColor" />
      <circle cx="31" cy="19" r="1" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/** Tech — a square microchip / processor with outward-radiating traces. */
export function TechIcon(props: IconProps) {
  const traces = [
    { x1: 20, y1: 14, x2: 20, y2: 4 },
    { x1: 28, y1: 14, x2: 28, y2: 4 },
    { x1: 36, y1: 14, x2: 36, y2: 4 },
    { x1: 44, y1: 14, x2: 44, y2: 4 },
    { x1: 20, y1: 50, x2: 20, y2: 60 },
    { x1: 28, y1: 50, x2: 28, y2: 60 },
    { x1: 36, y1: 50, x2: 36, y2: 60 },
    { x1: 44, y1: 50, x2: 44, y2: 60 },
    { x1: 14, y1: 20, x2: 4, y2: 20 },
    { x1: 14, y1: 28, x2: 4, y2: 28 },
    { x1: 14, y1: 36, x2: 4, y2: 36 },
    { x1: 14, y1: 44, x2: 4, y2: 44 },
    { x1: 50, y1: 20, x2: 60, y2: 20 },
    { x1: 50, y1: 28, x2: 60, y2: 28 },
    { x1: 50, y1: 36, x2: 60, y2: 36 },
    { x1: 50, y1: 44, x2: 60, y2: 44 },
  ];
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.75">
        {traces.map((t) => (
          <line key={`${t.x1}-${t.y1}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
        ))}
      </g>
      <g fill="currentColor" opacity="0.9">
        {traces.map((t) => (
          <rect key={`pad-${t.x2}-${t.y2}`} x={t.x2 - 1.6} y={t.y2 - 1.6} width="3.2" height="3.2" rx="0.6" />
        ))}
      </g>
      <rect x="14" y="14" width="36" height="36" rx="4" stroke="currentColor" strokeWidth="2" />
      <rect x="24" y="24" width="16" height="16" rx="2" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

/** Innovation — a glowing lightbulb whose filament is a small gear. */
export function InnovationIcon(props: IconProps) {
  const teeth = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M32 6a17 17 0 0 0-9 31.5c2 1.4 3 3.4 3 5.5v1h12v-1c0-2.1 1-4.1 3-5.5A17 17 0 0 0 32 6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <rect x="25" y="47" width="14" height="4" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <line x1="26.5" y1="54" x2="37.5" y2="54" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="27.5" y1="57.5" x2="36.5" y2="57.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />

      <g transform="translate(32 26)">
        {teeth.map((angle) => (
          <rect
            key={angle}
            x="-1.6"
            y="-9.5"
            width="3.2"
            height="4"
            rx="0.6"
            fill="currentColor"
            transform={`rotate(${angle})`}
          />
        ))}
        <circle r="6.5" fill="currentColor" />
        <circle r="2.2" fill="white" fillOpacity="0.85" />
      </g>
    </svg>
  );
}
