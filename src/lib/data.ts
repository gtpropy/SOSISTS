import content from "@/content/site.json";

export const siteMeta = content.siteMeta;
export const vision = content.vision;
export const mission = content.mission;

export interface ObjectiveGroup {
  id: string;
  number: string;
  title: string;
  intro: string;
  items: string[];
}

export const objectives: ObjectiveGroup[] = content.objectives;

export interface FocusArea {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  activities: string[];
  accent: "primary" | "cyan" | "violet" | "lime";
}

export const focusAreas: FocusArea[] = content.focusAreas as FocusArea[];

export interface EventBlock {
  id: string;
  cadence: string;
  title: string;
  description: string;
  details: string[];
}

export const events: EventBlock[] = content.events;

export interface Challenge {
  id: string;
  slug: string;
  edition: string;
  status: string;
  title: string;
  tagline: string;
  organizer: string;
  hook: string;
  problemTitle: string;
  problemBody: string;
  requirements: string[];
  howItWorks: string[];
  simpleRules: string[];
  quickFacts: { label: string; value: string }[];
  fullRules: {
    who: string[];
    problemScope: string[];
    solutionMustDo: string[];
    conduct: string[];
  };
  registration: {
    url: string;
    note: string;
  };
  eventDaySchedule: string[];
  judging: string[];
  prizes: {
    winner: string;
    participation: string;
  };
  contact: {
    name: string;
    role: string;
  };
}

export const challenge: Challenge = content.challenge;

export const membershipStatus = content.membershipStatus;

export type ExecMember = {
  name: string;
  role: string;
};

export const executiveTeam: ExecMember[] = content.executiveTeam;

export const roleDescriptions: Record<string, string> = content.roleDescriptions;

export const generalMembers: ExecMember[] = content.generalMembers;

export const eligibility: string[] = content.eligibility;

export const memberExpectations: string[] = content.memberExpectations;

export const safetyPolicies: { title: string; points: string[] }[] = content.safetyPolicies;

export interface JourneyStep {
  step: string;
  title: string;
  body: string;
  accent: "primary" | "cyan" | "violet" | "lime";
}

export const journey: JourneyStep[] = content.journey as JourneyStep[];

export const stats: { label: string; value: string }[] = content.stats;
