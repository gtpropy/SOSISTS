import type { ReactNode } from "react";
import type { Metadata } from "next";
import "../globals.css";
import { SoundProvider } from "@/components/SoundProvider";
import { MusicProvider } from "@/components/MusicProvider";
import { CodeBackground } from "@/components/CodeBackground";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { EventAnnouncementModal } from "@/components/EventAnnouncementModal";
import { CommandPalette } from "@/components/CommandPalette";
import { JourneyModeProvider } from "@/components/JourneyModeProvider";
import { JourneyModeOverlay } from "@/components/JourneyModeOverlay";
import { AdminProvider } from "@/components/AdminProvider";
import { AdminKeyModal } from "@/components/AdminKeyModal";
import { AdminBar } from "@/components/AdminBar";

export const metadata: Metadata = {
  title: "ISTS — Innovation, Science & Technology Society | SOS Hermann Gmeiner School",
  description:
    "Innovation, Science & Technology Society (ISTS) at SOS Hermann Gmeiner School, Pokhara-15, Rambazar — a student-led, teacher-supervised platform for science, robotics, coding, research, and innovation. Learn. Build. Innovate.",
  keywords: [
    "ISTS",
    "Innovation Science Technology Society",
    "SOS Hermann Gmeiner School",
    "Pokhara",
    "STEM club",
    "robotics club",
    "science club Nepal",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SoundProvider>
          <MusicProvider>
            <JourneyModeProvider>
              <AdminProvider>
                <CodeBackground />
                <Nav />
                <main className="flex-1">{children}</main>
                <Footer />
                <EventAnnouncementModal />
                <CommandPalette />
                <JourneyModeOverlay />
                <AdminKeyModal />
                <AdminBar />
              </AdminProvider>
            </JourneyModeProvider>
          </MusicProvider>
        </SoundProvider>
      </body>
    </html>
  );
}
