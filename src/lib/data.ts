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

export const challenge: Challenge = {
  id: "innovation-challenge",
  slug: "innovation-challenge",
  edition: "SIC 2026",
  status: "Registrations Open",
  title: "School Innovation Challenge",
  tagline: "Solving a Problem at School — organised by ISTSOS",
  organizer: "ISTSOS",
  hook: "Got an idea for how our school could work better? Here's your chance to build it — and win a prize for it.",
  problemTitle: "Smart Attendance & Classroom Display System",
  problemBody:
    "Right now, attendance is taken by hand, and there's no easy way to know who's teaching a class, whether a substitute has stepped in, or how attendance is going. Your challenge: build a system that fixes this, using the classroom smart board and the barcode already printed on your school ID card.",
  requirements: [
    "Let a teacher manage everything — schedule, substitutes, notices — from one dashboard",
    "Take attendance automatically by scanning ID card barcodes",
    "Show the current subject, teacher, and time on the smart board",
    "Show if a substitute is covering the class",
    "Work on Android — that's what the smart boards run",
  ],
  howItWorks: [
    "Register your team (up to 4 people, Grades 6–12)",
    "Research the problem and come up with your solution",
    "Submit your idea as a PDF through the Google Form",
    "Present it to the judges on event day — the winner is announced the same day",
  ],
  simpleRules: [
    "Stick to the problem above — no side projects",
    "Attendance must use the ID card barcode, and your app must run on Android",
    "Do your own work — getting help is fine, just be upfront about it",
    "Don't damage school property or do anything unsafe",
    "Ask permission before taking photos, doing interviews, or testing anything on campus",
  ],
  quickFacts: [
    { label: "Venue", value: "AV Hall" },
    { label: "When", value: "Sunday, 11:00 AM – 2:00 PM" },
    { label: "Team Size", value: "Up to 4" },
    { label: "Eligibility", value: "Grades 6–12" },
  ],
  fullRules: {
    who: [
      "Open to students in Grades 6–12",
      "Teams of up to 4 members",
      "Members can be from different grades or sections",
    ],
    problemScope: [
      "This year's challenge is fixed: build a Smart Attendance & Classroom Display System",
      "Every team works on this same problem — you can't swap it out for a different idea",
    ],
    solutionMustDo: [
      "Let the teacher in charge manage everything — schedule, substitutes, notices — from one central dashboard",
      "Take attendance automatically using the barcode already on your school ID card — no new cards, no fingerprint scanners, no writing names on paper",
      "Show on the smart board: the current time, the subject and teacher for that period, and who's covering if there's a substitute",
      "Show live attendance for the class, right on the board",
      "Be able to send notices to a single class or to every class at once",
      "Run on Android, since that's what the classroom smart boards use",
      "Be realistic for students to actually build, install, and keep running",
    ],
    conduct: [
      "Do your own work. Looking things up, using AI tools, or asking for help is fine — just be upfront about it, don't pass it off as entirely solo",
      "Everything you present — research, data, demos — has to be real and true, no faking results",
      "Don't damage any school property",
      "No dangerous materials or methods: chemicals, open flames, high-voltage wiring, or anything unsafe is not allowed",
      "Get permission first before taking photos, interviewing anyone, or testing something on campus",
      "The school has the final say on whether and how the winning idea actually gets built",
    ],
  },
  registration: {
    url: "https://forms.gle/GcPCBLfNXfyGcWdb7",
    note: "Your idea proposal must be uploaded as a PDF through the same form. One submission per team.",
  },
  eventDaySchedule: [
    "Teams get 20–25 minutes to gather and finalize their presentation",
    "Teams are then called up one by one, in order of their team number",
    "Judges may ask a few questions after each presentation",
  ],
  judging: [
    "Understanding of the problem",
    "Research",
    "Creativity",
    "Feasibility",
    "Technical approach",
    "Presentation",
  ],
  prizes: {
    winner: "NRS 4,000 cash + a trophy",
    participation: "Every participating team receives a certificate",
  },
  contact: {
    name: "Anuja Gautam",
    role: "Event Coordinator, Class 11",
  },
};

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
