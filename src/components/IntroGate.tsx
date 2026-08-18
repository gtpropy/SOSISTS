"use client";

import { useEffect, useState } from "react";
import { IntroSequence } from "@/components/IntroSequence";
import { SICAnnouncementModal } from "@/components/SICAnnouncementModal";
import { useMusic } from "@/components/MusicProvider";

const INTRO_SEEN_KEY = "ists-intro-seen";

export function IntroGate() {
  const [showIntro, setShowIntro] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const { attemptPlay } = useMusic();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (sessionStorage.getItem(INTRO_SEEN_KEY)) {
        setIntroFinished(true);
        attemptPlay();
      } else {
        setShowIntro(true);
      }
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem(INTRO_SEEN_KEY, "true");
    setShowIntro(false);
    setIntroFinished(true);
    attemptPlay();
  };

  return (
    <>
      {showIntro && <IntroSequence onComplete={handleComplete} />}
      {introFinished && <SICAnnouncementModal />}
    </>
  );
}
