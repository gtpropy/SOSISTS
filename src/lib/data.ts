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
  body: [
    "The vision of the Innovation, Science & Technology Society (ISTS) is to establish a vibrant culture of scientific excellence, innovation, research, and technological creativity at SOS Hermann Minor School.",
    "ISTS envisions a school environment where students are encouraged to question deeply, experiment responsibly, build confidently, and think creatively. The society aims to develop future leaders who are capable of solving problems through science, technology, collaboration, and ethical innovation.",
    "The long-term vision of ISTS is to make SOS Hermann Minor School recognized not only for academic discipline but also for practical STEM learning, student-led innovation, research-based thinking, robotics, computing, and meaningful participation in science and technology competitions.",
  ],
  aspirations: [
    "Scientific thinkers who observe, analyze, and investigate.",
    "Innovators who design solutions to real problems.",
    "Technological learners who understand modern tools and future trends.",
    "Responsible leaders who work with discipline, integrity, and teamwork.",
    "Confident presenters who can communicate ideas clearly.",
    "Future-ready students prepared for higher education, competitions, and global challenges.",
  ],
};

export const mission = {
  heading: "Mission",
  intro:
    "The mission of the Innovation, Science & Technology Society (ISTS) is to provide students with a structured and inspiring platform to explore STEM subjects through practical learning, research, collaboration, innovation, and leadership.",
  items: [
    "Promote interest in science, technology, engineering, mathematics, research, and innovation among students from Grade 6 and above.",
    "Provide hands-on learning opportunities through experiments, workshops, demonstrations, projects, and competitions.",
    "Encourage students to explore emerging technologies such as artificial intelligence, robotics, automation, cybersecurity, renewable energy, and modern computing.",
    "Develop problem-solving skills by encouraging students to identify challenges and design practical solutions.",
    "Build leadership, teamwork, communication, and event management skills through student-led activities.",
    "Support students in preparing for science competitions, Olympiads, coding contests, robotics challenges, and innovation fairs.",
    "Create a safe, disciplined, and inclusive environment where beginners and experienced students can learn together.",
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
    number: "5.1",
    title: "Academic Objectives",
    intro:
      "The society will support academic growth by connecting classroom concepts with practical applications.",
    items: [
      "Strengthen understanding of science, mathematics, computing, and engineering through practical demonstrations and project-based learning.",
      "Organize weekly discussions that connect school syllabus topics with real-life applications.",
      "Develop better analytical thinking, observation, reasoning, and scientific explanation skills.",
      "Support students preparing for Olympiads, quiz competitions, coding contests, and STEM-related academic events.",
      "Encourage students to present scientific topics clearly, improving subject knowledge and communication.",
      "Develop a culture where academic excellence is supported by curiosity, questioning, and experimentation.",
    ],
  },
  {
    id: "innovation",
    number: "5.2",
    title: "Innovation Objectives",
    intro:
      "Innovation will be one of the central pillars of ISTS — students are encouraged to think beyond existing solutions.",
    items: [
      "Motivate students to identify problems in school, community, environment, and daily life.",
      "Guide students in developing simple prototypes, models, systems, or proposals as solutions.",
      "Promote design thinking, creativity, brainstorming, and structured problem-solving.",
      "Organize innovation challenges where students work individually or in teams.",
      "Develop at least one student-led innovation project per term.",
      "Encourage students to document ideas, test concepts, and improve designs through feedback.",
    ],
  },
  {
    id: "technology",
    number: "5.3",
    title: "Technology Objectives",
    intro:
      "ISTS will help students understand technology as both a learning tool and a field of future opportunity.",
    items: [
      "Introduce programming, web development, software tools, robotics, electronics, AI, and cybersecurity awareness.",
      "Conduct beginner-friendly sessions so students with no prior experience can start confidently.",
      "Organize workshops on Python, HTML/CSS, web development, Arduino, robotics, and AI fundamentals.",
      "Encourage responsible and ethical use of technology.",
      "Promote digital literacy and awareness of future technologies.",
      "Develop small technology-based projects such as websites, apps, automation systems, and sensor-based devices.",
    ],
  },
  {
    id: "competition",
    number: "5.4",
    title: "Competition Objectives",
    intro:
      "Competitions help students test their knowledge, build confidence, and represent their school with pride.",
    items: [
      "Prepare students for intra-school and inter-school science, technology, robotics, coding, and innovation competitions.",
      "Organize one major monthly event such as a hackathon, Olympiad, robotics competition, or STEM quiz.",
      "Provide opportunities in judging-based events, presentations, demonstrations, and team challenges.",
      "Recognize outstanding performance through certificates, awards, and public appreciation.",
      "Improve the school's performance and visibility in STEM-related competitions.",
      "Build a trained student team able to represent SOS Hermann Minor School externally.",
    ],
  },
  {
    id: "leadership",
    number: "5.5",
    title: "Leadership Objectives",
    intro:
      "ISTS will be a student-led society working under faculty supervision, teaching responsibility and leadership.",
    items: [
      "Develop student leaders capable of organizing events, managing teams, and communicating professionally.",
      "Provide leadership roles such as President, Vice President, Secretary, Coordinators, and team members.",
      "Encourage students to lead seminars, moderate discussions, and coordinate workshops.",
      "Develop professionalism, punctuality, teamwork, and accountability.",
      "Create a culture where senior students mentor junior students.",
      "Prepare students for leadership roles in higher education and future professional environments.",
    ],
  },
  {
    id: "research",
    number: "5.6",
    title: "Research Objectives",
    intro:
      "Research teaches students how to ask meaningful questions, gather information, and present findings.",
    items: [
      "Encourage exploration of scientific discoveries, emerging technologies, and environmental issues.",
      "Guide students in preparing short research presentations and project reports.",
      "Organize student research showcases at the end of each term.",
      "Promote proper citation, academic honesty, and evidence-based thinking.",
      "Encourage students to compare ideas, evaluate sources, and present conclusions responsibly.",
      "Develop research habits that benefit students in higher studies and competitions.",
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
    number: "7.1",
    title: "Chemistry & Scientific Exploration",
    shortTitle: "Chemistry",
    description:
      "Safe, supervised, and meaningful demonstrations that build curiosity and understanding through responsible scientific activity — never unsafe or uncontrolled experiments.",
    activities: [
      "Safe classroom demonstrations of chemical reactions",
      "Basic laboratory skill awareness",
      "Environmental chemistry: water testing, pollution awareness, waste management",
      "Acids and bases, indicators, crystallization, filtration, separation techniques",
      "Applied chemistry in medicine, agriculture, food, and industry",
      "Chemistry-based science fair projects and presentations",
    ],
    accent: "lime",
  },
  {
    id: "physics-engineering",
    number: "7.2",
    title: "Physics & Engineering",
    shortTitle: "Physics & Engineering",
    description:
      "Connecting theoretical concepts with practical models — understanding how scientific principles power machines, structures, circuits, and everyday technology.",
    activities: [
      "Simple mechanics: force, motion, levers, pulleys, energy",
      "Electricity demos: circuits, resistors, switches, LEDs, measurements",
      "Magnetism and electromagnetism-based projects",
      "Engineering design challenges: bridges, towers, vehicles",
      "Renewable energy models: solar-powered devices, wind demonstrations",
      "Design → test → improve → present problem-solving challenges",
    ],
    accent: "primary",
  },
  {
    id: "robotics",
    number: "7.4",
    title: "Robotics & Automation",
    shortTitle: "Robotics & Automation",
    description:
      "One of the most exciting focus areas — learning how electronics, programming, sensors, and mechanical design combine to create automated systems.",
    activities: [
      "Introduction to Arduino and microcontroller-based systems",
      "Basic electronics: LEDs, buzzers, resistors, motors, sensors, breadboards",
      "Sensor projects: obstacle detection, light/temperature sensing, line-following",
      "Robotics builds: simple moving robots, automated alarms, smart dustbins",
      "Understanding automation in industry, homes, agriculture, medicine",
      "Robotics demonstrations at exhibitions and grand term events",
    ],
    accent: "cyan",
  },
  {
    id: "innovation-research",
    number: "7.5",
    title: "Innovation & Research",
    shortTitle: "Innovation & Research",
    description:
      "Encouraging students to think deeply about problems and solutions — exploring emerging technologies, scientific breakthroughs, and real-world challenges.",
    activities: [
      "Student presentations on recent scientific discoveries and future technologies",
      "Research discussions: space exploration, climate change, AI, biotechnology, cybersecurity",
      "Innovation challenges proposing solutions to school or community problems",
      "Research poster presentations and project documentation",
      "Team-based problem-solving sessions",
      "Term-end innovation showcases of models, prototypes, and ideas",
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
    description:
      "Short, focused, interactive seminars during break time (~30–60 minutes) — the regular intellectual foundation of the society.",
    details: [
      "Explore STEM topics beyond textbooks",
      "Develop presentation and public speaking skills",
      "Discussion-based learning culture with open Q&A",
      "Guest speakers: teachers, alumni, STEM professionals, engineers",
      "Sample topics: AI, robotics, cybersecurity, space exploration, renewable energy, Arduino",
    ],
  },
  {
    id: "monthly",
    cadence: "Once a Month",
    title: "Monthly Major Event",
    description:
      "One well-planned monthly event to maintain quality, discipline, and sustainability instead of too many shallow activities.",
    details: [
      "Hackathons, Science Olympiads, coding & robotics competitions",
      "STEM quizzes, science model competitions, innovation challenges",
      "Research showcases and practical workshops (Python, Arduino, AI, web dev)",
      "Planned by the executive committee under faculty supervision",
      "Judged on creativity, accuracy, teamwork, and presentation quality",
    ],
  },
  {
    id: "grand-term",
    cadence: "Every 4 Months",
    title: "Grand Term Event",
    description:
      "The flagship program of the society — showcasing the best student work before teachers, school leaders, parents, and guests.",
    details: [
      "Science Expo, STEM Fair, Innovation Showcase, Robotics Demonstrations",
      "Research presentations, hackathons, Olympiads, technology exhibitions",
      "Awards ceremony and guest speaker sessions",
      "Categories: Best Innovation Project, Best Robotics Demo, Best Research Presentation, Most Promising Young Scientist",
    ],
  },
  {
    id: "inter-school",
    cadence: "Ongoing",
    title: "Inter-School Collaboration",
    description:
      "Respectful, meaningful collaboration with neighboring schools, subject to administration approval.",
    details: [
      "Inter-school STEM quizzes and coding competitions",
      "Science Olympiads and robotics tournaments",
      "Innovation expos, joint workshops, and friendly challenges",
      "Wider exposure and stronger school reputation in STEM education",
    ],
  },
];

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
  President:
    "Provides overall leadership, coordinates with faculty supervisors, and represents ISTS before the school administration.",
  "Vice President":
    "Supports the President in planning and execution, and steps in during the President's absence.",
  Secretary:
    "Maintains official records of meetings, membership, attendance, and society communication.",
  "Joint Secretary":
    "Assists the Secretary with record-keeping, notices, and day-to-day organizational coordination.",
  "Finance Coordinator":
    "Maintains transparent financial records for approved expenses, sponsorships, and event resources.",
  "IT & Robotics Coordinator":
    "Leads programming, web development, electronics, Arduino, and robotics project teams.",
  "Event Coordinator":
    "Plans and manages seminars, competitions, workshops, and term-end programs.",
  "Media & Outreach":
    "Prepares posters, announcements, reports, and promotional content for approved school channels.",
  "Research Coordinator":
    "Guides research presentations, project reports, and term showcase materials.",
  Member: "Active contributor to ISTS seminars, projects, and events.",
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
  "Currently studying in Grade 6 or above.",
  "Show interest in science, technology, innovation, research, robotics, computing, or STEM.",
  "Willing to participate actively in seminars, workshops, projects, and competitions.",
  "Agree to follow the rules, safety policies, and code of conduct of the society.",
  "Demonstrate discipline, respect, teamwork, and responsibility.",
];

export const memberExpectations = [
  "Attend regular club meetings and weekly seminars whenever possible.",
  "Participate in at least one major activity, competition, workshop, or project per term.",
  "Respect teachers, coordinators, fellow members, guests, equipment, and school property.",
  "Work responsibly during experiments, electronics activities, robotics projects, and events.",
  "Maintain academic honesty in research, presentations, and competitions.",
  "Support beginners and encourage teamwork rather than unhealthy competition.",
  "Represent the school positively during inter-school events and collaborations.",
];

export const safetyPolicies = [
  {
    title: "Chemistry Safety",
    points: [
      "Teacher supervision at all times.",
      "No handling of dangerous chemicals without permission.",
      "No mixing of unknown substances, fire, explosion, or toxic-gas experiments.",
      "Proper disposal of materials and immediate reporting of spills or accidents.",
    ],
  },
  {
    title: "Electronics & Robotics Safety",
    points: [
      "Use of low-voltage circuits only.",
      "No direct handling of mains electricity.",
      "Supervisor approval required before testing circuits.",
      "Safe storage of tools and components at all times.",
    ],
  },
  {
    title: "Responsible Experimentation",
    points: [
      "All experiments, demonstrations, and projects must be planned and reviewed.",
      "Any activity that risks students, property, or the environment is not allowed.",
      "Principle: no experiment is successful if it is not safe, ethical, and responsible.",
    ],
  },
];

export const stats = [
  { label: "Grade & Above", value: "6+" },
  { label: "Core Focus Areas", value: "4" },
  { label: "Weekly Seminars", value: "52/yr" },
  { label: "Grand Term Events", value: "3/yr" },
];
