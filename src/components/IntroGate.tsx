"use client";

import { useEffect, useState } from "react";
import { IntroSequence } from "@/components/IntroSequence";
import { SICAnnouncementModal } from "@/components/SICAnnouncementModal";

const INTRO_SEEN_KEY = "ists-intro-seen";

export function IntroGate() {
  const [showIntro, setShowIntro] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (sessionStorage.getItem(INTRO_SEEN_KEY)) {
        setIntroFinished(true);
      } else {
        setShowIntro(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem(INTRO_SEEN_KEY, "true");
    setShowIntro(false);
    setIntroFinished(true);
  };

  return (
    <>
      {showIntro && <IntroSequence onComplete={handleComplete} />}
      {introFinished && <SICAnnouncementModal />}
    </>
  );
}
