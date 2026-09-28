import type { ReactNode } from "react";
import type { Metadata } from "next";

// This is a SEPARATE root layout (see Next.js route groups: multiple root
// layouts) — deliberately independent from `(site)/layout.tsx`. It skips
// Nav, Footer, the intro/command-palette/journey-mode/admin machinery,
// framer-motion, next/font Google Fonts, and the site's Tailwind bundle
// entirely. This route exists purely as a "poster QR code" destination:
// scan it, get the current event's details instantly, on any phone.
export const metadata: Metadata = {
  title: "ISTS — Current Event",
  description: "What's happening right now at ISTS.",
};

const css = `
  * { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    margin: 0;
    background: #f5f7fd;
    color: #0b1120;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.5;
  }
  a { color: inherit; }

  .wrap { max-width: 640px; margin: 0 auto; padding: 28px 20px 56px; }

  .eyebrow {
    display: inline-block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #16a34a;
    background: rgba(22, 163, 74, 0.12);
    border-radius: 999px;
    padding: 5px 12px;
  }

  h1 { font-size: 30px; font-weight: 800; margin: 14px 0 4px; line-height: 1.15; }
  .tagline { color: #4338ca; font-weight: 600; margin: 0 0 12px; }
  .hook { color: #374151; margin: 0 0 20px; }

  .btn {
    display: inline-block;
    background: #4338ca;
    color: #fff !important;
    font-weight: 700;
    text-decoration: none;
    padding: 13px 22px;
    border-radius: 999px;
    font-size: 15px;
  }
  .btn-secondary {
    display: inline-block;
    background: #fff;
    color: #0b1120 !important;
    font-weight: 600;
    text-decoration: none;
    padding: 11px 20px;
    border-radius: 999px;
    font-size: 14px;
    border: 1px solid #dfe4f3;
  }

  .note { font-size: 13px; color: #56607a; margin: 10px 0 0; }

  .facts { display: flex; flex-wrap: wrap; gap: 8px; margin: 18px 0 22px; padding: 0; list-style: none; }
  .facts li {
    border: 1px solid #dfe4f3;
    background: #fff;
    border-radius: 999px;
    padding: 6px 12px;
    font-size: 13px;
  }
  .facts b { color: #0b1120; }

  h2 { font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: #56607a; margin: 30px 0 10px; }

  ul.plain { margin: 0; padding: 0 0 0 20px; }
  ul.plain li { margin: 0 0 8px; }

  .day { border: 1px solid #dfe4f3; background: #fff; border-radius: 14px; padding: 14px 16px; margin: 0 0 12px; }
  .day p.title { margin: 0 0 8px; font-weight: 700; }
  .day .when { font-size: 12px; color: #56607a; text-transform: uppercase; letter-spacing: 0.03em; }

  .register-block {
    background: linear-gradient(135deg, #0891b2, #4338ca 55%, #7c3aed);
    color: #fff;
    border-radius: 18px;
    padding: 22px;
    margin: 30px 0 0;
    text-align: center;
  }
  .register-block h2 { color: #fff; opacity: 0.85; }
  .register-block p { color: rgba(255,255,255,0.9); font-size: 14px; margin: 0 0 16px; }

  footer.site-link { margin-top: 40px; padding-top: 20px; border-top: 1px solid #dfe4f3; font-size: 13px; color: #56607a; }
  footer.site-link a { color: #4338ca; font-weight: 600; text-decoration: none; }
`;

export default function CurrentEventLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
