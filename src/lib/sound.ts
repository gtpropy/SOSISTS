"use client";

type WaveType = OscillatorType;

interface Blip {
  freq: number;
  end?: number;
  duration: number;
  type?: WaveType;
  gain?: number;
  delay?: number;
}

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  if (!ctx) ctx = new AudioCtor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function playBlip({ freq, end, duration, type = "sine", gain = 0.05, delay = 0 }: Blip) {
  const audioCtx = getContext();
  if (!audioCtx) return;

  const startTime = audioCtx.currentTime + delay;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  if (end) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(end, 1), startTime + duration);
  }

  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(gain, startTime + 0.008);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

export const sfx = {
  hover: () => playBlip({ freq: 920, end: 1180, duration: 0.06, type: "sine", gain: 0.035 }),
  click: () => {
    playBlip({ freq: 1400, end: 700, duration: 0.09, type: "triangle", gain: 0.06 });
  },
  toggleOn: () => {
    playBlip({ freq: 660, end: 1320, duration: 0.12, type: "square", gain: 0.045 });
  },
  toggleOff: () => {
    playBlip({ freq: 780, end: 320, duration: 0.12, type: "square", gain: 0.045 });
  },
  navigate: () => {
    playBlip({ freq: 500, end: 900, duration: 0.14, type: "sawtooth", gain: 0.03 });
    playBlip({ freq: 1000, end: 1500, duration: 0.1, type: "sine", gain: 0.025, delay: 0.05 });
  },
  success: () => {
    playBlip({ freq: 523, duration: 0.1, type: "sine", gain: 0.05 });
    playBlip({ freq: 659, duration: 0.1, type: "sine", gain: 0.05, delay: 0.09 });
    playBlip({ freq: 784, duration: 0.16, type: "sine", gain: 0.05, delay: 0.18 });
  },
  type: () => {
    const freq = 1800 + Math.random() * 600;
    playBlip({ freq, duration: 0.02, type: "square", gain: 0.018 });
  },
  open: () => {
    playBlip({ freq: 400, end: 800, duration: 0.18, type: "sine", gain: 0.04 });
  },
};

export function primeAudio() {
  getContext();
}
