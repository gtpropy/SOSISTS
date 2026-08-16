import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SoundProvider } from "@/components/SoundProvider";
import { CodeBackground } from "@/components/CodeBackground";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { IntroGate } from "@/components/IntroGate";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SoundProvider>
          <CodeBackground />
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <IntroGate />
        </SoundProvider>
      </body>
    </html>
  );
}
