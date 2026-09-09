import {
  executiveTeam,
  generalMembers,
  focusAreas,
  objectives,
  events,
  challenge,
} from "@/lib/data";

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  href: string;
  sectionId?: string;
  keywords: string;
}

const pages: SearchResult[] = [
  { id: "page-home", title: "Home", subtitle: "Overview & hero", category: "Page", href: "/", keywords: "home overview hero" },
  { id: "page-about", title: "About", subtitle: "Vision, mission & objectives", category: "Page", href: "/about", keywords: "about vision mission objectives" },
  { id: "page-focus", title: "Focus Areas", subtitle: "Chemistry, physics, robotics, research", category: "Page", href: "/focus-areas", keywords: "focus areas chemistry physics engineering robotics research" },
  { id: "page-events", title: "Events", subtitle: "Seminars, monthly events, term showcase", category: "Page", href: "/events", keywords: "events seminars workshops schedule" },
  { id: "page-sic", title: "SIC 2026", subtitle: "School Innovation Challenge recap", category: "Page", href: "/innovation-challenge", keywords: "sic 2026 innovation challenge hackathon rules prizes recap photos success" },
  { id: "page-team", title: "Team", subtitle: "Executive committee & members", category: "Page", href: "/team", keywords: "team executive committee members" },
  { id: "page-join", title: "Membership", subtitle: "Eligibility, expectations & safety", category: "Page", href: "/join", keywords: "join membership eligibility expectations safety" },
];

const sections: SearchResult[] = [
  { id: "sec-hero", title: "Hero", subtitle: "Homepage top", category: "Section", href: "/", sectionId: "section-hero", keywords: "hero top start" },
  { id: "sec-gallery", title: "Gallery", subtitle: "A quick look inside ISTS", category: "Section", href: "/", sectionId: "section-gallery", keywords: "gallery photos showcase inside" },
  { id: "sec-upcoming", title: "SIC Recap", subtitle: "How the SIC 2026 challenge went", category: "Section", href: "/", sectionId: "section-upcoming", keywords: "recap events challenge photos success how it went" },
  { id: "sec-journey", title: "How It Works", subtitle: "Learn, Build, Innovate, Showcase", category: "Section", href: "/", sectionId: "section-journey", keywords: "how it works learn build innovate showcase scrollytelling" },
  { id: "sec-focus", title: "Focus Areas Grid", category: "Section", href: "/", sectionId: "section-focus", keywords: "focus areas grid disciplines" },
  { id: "sec-team", title: "Team Teaser", category: "Section", href: "/", sectionId: "section-team-teaser", keywords: "team teaser executive committee" },
  { id: "sec-cta", title: "Closing CTA", category: "Section", href: "/", sectionId: "section-cta", keywords: "cta photos recap build something" },
];

const teamResults: SearchResult[] = [...executiveTeam, ...generalMembers].map((m, i) => ({
  id: `team-${i}`,
  title: m.name,
  subtitle: m.role,
  category: "Team",
  href: "/team",
  keywords: `${m.name} ${m.role}`.toLowerCase(),
}));

const focusResults: SearchResult[] = focusAreas.map((f) => ({
  id: `focus-${f.id}`,
  title: f.title,
  subtitle: f.description,
  category: "Focus Area",
  href: "/focus-areas",
  keywords: `${f.title} ${f.shortTitle} ${f.description} ${f.activities.join(" ")}`.toLowerCase(),
}));

const objectiveResults: SearchResult[] = objectives.map((o) => ({
  id: `obj-${o.id}`,
  title: o.title,
  subtitle: o.intro,
  category: "Objective",
  href: "/about",
  keywords: `${o.title} ${o.intro} ${o.items.join(" ")}`.toLowerCase(),
}));

const eventResults: SearchResult[] = events.map((e) => ({
  id: `event-${e.id}`,
  title: e.title,
  subtitle: e.cadence,
  category: "Event",
  href: "/events",
  keywords: `${e.title} ${e.cadence} ${e.description} ${e.details.join(" ")}`.toLowerCase(),
}));

const challengeResults: SearchResult[] = [
  { id: "chal-prizes", title: "SIC 2026 Prizes", subtitle: challenge.prizes.winner, category: "Challenge", href: "/innovation-challenge", keywords: `prizes reward ${challenge.prizes.winner} ${challenge.prizes.participation}`.toLowerCase() },
  { id: "chal-rules", title: "SIC 2026 Rules", subtitle: "Full rules & conduct", category: "Challenge", href: "/innovation-challenge", keywords: "rules conduct eligibility scope" },
  { id: "chal-photos", title: "SIC 2026 Photos", subtitle: "Event recap gallery", category: "Challenge", href: "/events", keywords: "photos gallery recap pictures images success highlights" },
  { id: "chal-judging", title: "SIC 2026 Judging Criteria", subtitle: challenge.judging.join(", "), category: "Challenge", href: "/innovation-challenge", keywords: `judging criteria ${challenge.judging.join(" ")}`.toLowerCase() },
];

export const searchIndex: SearchResult[] = [
  ...pages,
  ...sections,
  ...focusResults,
  ...objectiveResults,
  ...eventResults,
  ...challengeResults,
  ...teamResults,
];

export function searchContent(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return searchIndex
    .filter((r) => r.title.toLowerCase().includes(q) || r.keywords.includes(q))
    .slice(0, 8);
}
