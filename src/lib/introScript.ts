export type Pose = "kneel" | "forge" | "stand" | "reach";
export type Motif = "none" | "wheel" | "compass" | "circuit";
export type BgStage = "ember" | "warm" | "cool";

export interface ScriptLine {
  start: number;
  text: string;
  pose: Pose;
  fireStage: number;
  motif: Motif;
  bg: BgStage;
}

export const AUDIO_DURATION = 26.67;

export const scriptLines: ScriptLine[] = [
  { start: 0.0, text: "Since the dawn of humankind, we have chased fire.", pose: "kneel", fireStage: 0, motif: "none", bg: "ember" },
  { start: 2.5, text: "First to survive.", pose: "kneel", fireStage: 1, motif: "none", bg: "ember" },
  { start: 4.25, text: "Then to see in the dark.", pose: "kneel", fireStage: 2, motif: "none", bg: "ember" },
  { start: 5.83, text: "Then to forge.", pose: "forge", fireStage: 3, motif: "none", bg: "warm" },
  { start: 9.4, text: "Every age since has told the same story—", pose: "stand", fireStage: 3, motif: "none", bg: "warm" },
  { start: 12.18, text: "a spark,", pose: "stand", fireStage: 3, motif: "wheel", bg: "warm" },
  { start: 13.15, text: "then a struggle,", pose: "stand", fireStage: 3, motif: "compass", bg: "warm" },
  { start: 14.23, text: "then something built.", pose: "stand", fireStage: 3, motif: "none", bg: "warm" },
  { start: 15.63, text: "The wheel.", pose: "stand", fireStage: 3, motif: "wheel", bg: "warm" },
  { start: 16.57, text: "The compass.", pose: "stand", fireStage: 3, motif: "compass", bg: "warm" },
  { start: 17.55, text: "The circuit.", pose: "stand", fireStage: 3.5, motif: "circuit", bg: "warm" },
  { start: 18.95, text: "Every leap forward looked impossible,", pose: "stand", fireStage: 4, motif: "circuit", bg: "cool" },
  { start: 21.51, text: "until someone lit it.", pose: "reach", fireStage: 4.5, motif: "none", bg: "cool" },
  { start: 23.4, text: "We don't light fires.", pose: "reach", fireStage: 5, motif: "none", bg: "cool" },
  { start: 24.94, text: "We build the next spark.", pose: "reach", fireStage: 6, motif: "none", bg: "cool" },
];

export function lineIndexAt(time: number): number {
  let idx = 0;
  for (let i = 0; i < scriptLines.length; i++) {
    if (time >= scriptLines[i].start) idx = i;
    else break;
  }
  return idx;
}
