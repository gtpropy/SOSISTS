export const siteMeta = {
  name: "Innovation, Science & Technology Society",
  shortName: "ISTS",
  school: "SOS Hermann Minor School",
  motto: "Learn. Build. Innovate.",
  tagline: "A student-led, teacher-supervised platform for science, technology, robotics, research, and innovation.",
  founder: "Ryan Dhakal",
  founderRole: "Founder & Chair",
};

export const vision = {
  heading: "Vision",
  body: "A vibrant culture of scientific excellence and technological creativity at SOS Hermann Minor School — where students question, experiment, build, and lead with integrity.",
  aspirations: [
    "Scientific thinkers who investigate",
    "Innovators who solve real problems",
    "Confident, ethical, future-ready leaders",
  ],
};

export const mission = {
  heading: "Mission",
  intro:
    "A structured platform for hands-on STEM learning, research, and leadership — open to every student from Grade 6 and above.",
  items: [
    "Hands-on learning through experiments, workshops, and projects",
    "Emerging tech: AI, robotics, automation, cybersecurity",
    "Leadership and teamwork through student-led events",
    "An inclusive space for beginners and experts alike",
  ],
};

export interface ObjectiveGroup {
  id: string;
  number: string;
  title: string;
  intro: string;
  items: string[];
}

export const objectives: ObjectiveGroup[] = [
  {
    id: "academic",
    number: "01",
    title: "Academic",
    intro: "Connecting classroom concepts to practical application.",
    items: [
      "Project-based learning in science & computing",
      "Olympiad, quiz, and coding contest preparation",
      "Stronger analytical & presentation skills",
    ],
  },
  {
    id: "innovation",
    number: "02",
    title: "Innovation",
    intro: "Turning curiosity into real prototypes.",
    items: [
      "Identify real problems worth solving",
      "Design thinking & rapid prototyping",
      "One student-led innovation project per term",
    ],
  },
  {
    id: "technology",
    number: "03",
    title: "Technology",
    intro: "Technology as both a tool and a career path.",
    items: [
      "Programming, web dev, robotics, AI basics",
      "Beginner-friendly — no experience required",
      "Ethical, responsible use of technology",
    ],
  },
  {
    id: "competition",
    number: "04",
    title: "Competition",
    intro: "Testing skills, building confidence.",
    items: [
      "One major monthly hackathon / Olympiad / quiz",
      "Certificates & recognition for top performance",
      "A trained team representing the school externally",
    ],
  },
  {
    id: "leadership",
    number: "05",
    title: "Leadership",
    intro: "Student-run, faculty-supervised.",
    items: [
      "Real roles: President to project leads",
      "Seniors mentoring juniors",
      "Professionalism, accountability, ownership",
    ],
  },
  {
    id: "research",
    number: "06",
    title: "Research",
    intro: "Asking good questions, backing them with evidence.",
    items: [
      "Short research presentations each term",
      "Academic honesty & proper citation",
      "End-of-term research showcases",
    ],
  },
];

export interface FocusArea {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  activities: string[];
  accent: "primary" | "cyan" | "violet" | "lime";
}

export const focusAreas: FocusArea[] = [
  {
    id: "chemistry",
    number: "01",
    title: "Chemistry & Scientific Exploration",
    shortTitle: "Chemistry",
    description: "Safe, supervised demonstrations that build real scientific understanding.",
    activities: [
      "Safe reaction demonstrations",
      "Environmental & applied chemistry",
      "Science fair projects",
    ],
    accent: "lime",
  },
  {
    id: "physics-engineering",
    number: "02",
    title: "Physics & Engineering",
    shortTitle: "Physics & Engineering",
    description: "From theory to working models — circuits, structures, and machines.",
    activities: [
      "Circuits, electricity & renewable energy",
      "Engineering design challenges",
      "Build → test → improve → present",
    ],
    accent: "primary",
  },
  {
    id: "robotics",
    number: "03",
    title: "Robotics & Automation",
    shortTitle: "Robotics & Automation",
    description: "Electronics, sensors, and code combined to build automated systems.",
    activities: [
      "Arduino & microcontroller basics",
      "Sensor-based robotics builds",
      "Live demos at exhibitions",
    ],
    accent: "cyan",
  },
  {
    id: "innovation-research",
    number: "04",
    title: "Innovation & Research",
    shortTitle: "Innovation & Research",
    description: "Deep dives into emerging tech and real-world problem-solving.",
    activities: [
      "Research posters & presentations",
      "Innovation challenges",
      "Term-end showcases",
    ],
    accent: "violet",
  },
];

export interface EventBlock {
  id: string;
  cadence: string;
  title: string;
  description: string;
  details: string[];
}

export const events: EventBlock[] = [
  {
    id: "weekly",
    cadence: "Every Monday",
    title: "Weekly Innovation Seminars",
    description: "Short, interactive STEM talks during break time.",
    details: ["Student & guest speakers", "Open Q&A", "AI, robotics, space & more"],
  },
  {
    id: "monthly",
    cadence: "Once a Month",
    title: "Monthly Major Event",
    description: "One well-planned hackathon, Olympiad, or workshop.",
    details: ["Hackathons & coding contests", "Practical workshops", "Judged & certified"],
  },
  {
    id: "grand-term",
    cadence: "Every 4 Months",
    title: "Grand Term Event",
    description: "The flagship showcase — the best student work on display.",
    details: ["Science & innovation expo", "Awards ceremony", "Open to parents & guests"],
  },
  {
    id: "inter-school",
    cadence: "Ongoing",
    title: "Inter-School Collaboration",
    description: "Friendly competition and joint events with neighboring schools.",
    details: ["Quizzes & tournaments", "Joint workshops", "Wider STEM exposure"],
  },
];

export interface UpcomingEvent {
  id: string;
  status: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  meta: { label: string; value: string }[];
  registrationUrl?: string;
}

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: "innovation-challenge",
    status: "Registrations Open",
    title: "School Innovation Challenge",
    tagline: "Problem Statement: Smart Attendance & Classroom Display System",
    description:
      "Teams will design a system that automates classroom attendance and displays live class info on the smart board — replacing manual roll-call with something students actually build.",
    highlights: [
      "Barcode-based attendance using existing school ID cards",
      "Live smart-board display: schedule, teacher & substitute info",
      "Central dashboard for schedules, substitutes & notices",
      "Built for Android — the platform classroom smart boards run",
    ],
    meta: [
      { label: "Format", value: "Team Challenge" },
      { label: "Platform", value: "Android" },
      { label: "Hosted by", value: "ISTS" },
    ],
    registrationUrl: "https://forms.gle/GcPCBLfNXfyGcWdb7",
  },
];

export const membershipStatus = {
  open: false,
  label: "Applications Closed",
  message:
    "Membership for this cycle is closed — the current roster below is final. Follow ISTS announcements for the next opening.",
};

export type ExecMember = {
  name: string;
  role: string;
};

export const executiveTeam: ExecMember[] = [
  { name: "Ryan Rabi Dhakal", role: "President" },
  { name: "Aagaman Basnet", role: "Vice President" },
  { name: "Biplove Timilsina", role: "Secretary" },
  { name: "Prashish Khanal", role: "Joint Secretary" },
  { name: "Gaurab Sapkota", role: "Finance Coordinator" },
  { name: "Agrim Raj Tiwari", role: "IT & Robotics Coordinator" },
  { name: "Anuja Gautam", role: "Event Coordinator" },
  { name: "Prapti Poudel", role: "Media & Outreach" },
  { name: "Harshika Singh", role: "Media & Outreach" },
  { name: "Rajat Adhikari", role: "Media & Outreach" },
  { name: "Kristina Poudel", role: "Research Coordinator" },
];

export const roleDescriptions: Record<string, string> = {
  President: "Overall leadership and school administration liaison.",
  "Vice President": "Supports planning and execution.",
  Secretary: "Official records, meetings & communication.",
  "Joint Secretary": "Record-keeping & day-to-day coordination.",
  "Finance Coordinator": "Transparent financial tracking.",
  "IT & Robotics Coordinator": "Leads programming & robotics projects.",
  "Event Coordinator": "Plans seminars, workshops & term events.",
  "Media & Outreach": "Posters, announcements & promotion.",
  "Research Coordinator": "Guides research & showcase materials.",
  Member: "Active contributor to ISTS projects & events.",
};

export const generalMembers: ExecMember[] = [
  { name: "Jeewani Shah", role: "Member" },
  { name: "Suhani Gautam", role: "Member" },
  { name: "Prasin Sapkota", role: "Member" },
  { name: "Prashamsa Thapa", role: "Member" },
  { name: "Rabin Poudel", role: "Member" },
  { name: "Brabim Subedi", role: "Member" },
  { name: "Hashika Baral", role: "Member" },
];

export const eligibility = [
  "Grade 6 or above",
  "Curious about science, tech, or STEM",
  "Willing to show up and participate",
  "Respectful, disciplined, team-first",
];

export const memberExpectations = [
  "Attend seminars whenever possible",
  "One major activity per term, minimum",
  "Respect people, equipment & school property",
  "Academic honesty in all work",
];

export const safetyPolicies = [
  {
    title: "Chemistry",
    points: ["Teacher supervision always", "No unauthorized chemicals", "Immediate incident reporting"],
  },
  {
    title: "Electronics & Robotics",
    points: ["Low-voltage circuits only", "No mains electricity handling", "Supervisor sign-off before testing"],
  },
  {
    title: "General",
    points: ["Every activity planned & reviewed", "No risk to people or property", "Safe, ethical, responsible — always"],
  },
];

export interface JourneyStep {
  step: string;
  title: string;
  body: string;
  accent: "primary" | "cyan" | "violet" | "lime";
}

export const journey: JourneyStep[] = [
  {
    step: "01",
    title: "Learn",
    body: "Weekly seminars and hands-on fundamentals across chemistry, physics, robotics, and code — beginner-friendly, always.",
    accent: "primary",
  },
  {
    step: "02",
    title: "Build",
    body: "Monthly workshops turn theory into circuits, robots, and working software — real tools, real projects.",
    accent: "cyan",
  },
  {
    step: "03",
    title: "Innovate",
    body: "Original solutions to real problems — like this term's School Innovation Challenge.",
    accent: "violet",
  },
  {
    step: "04",
    title: "Showcase",
    body: "The Grand Term Event: present your work, compete, and get recognized.",
    accent: "lime",
  },
];

export const stats = [
  { label: "Grade & Above", value: "6+" },
  { label: "Focus Areas", value: "4" },
  { label: "Seminars / Year", value: "52" },
  { label: "Term Events", value: "3" },
];
