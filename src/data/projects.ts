import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "campus-orbit",
    title: "Campus Orbit",
    slug: "campus-orbit",
    description: "A full-stack college discovery platform helping students search, compare and explore colleges with authentication, discussions, predictors and personalized dashboards.",
    longDescription: "Campus Orbit is a full-stack college discovery platform helping students search, compare and explore colleges with authentication, discussions, predictors and personalized dashboards.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Neon", "Vercel"],
    role: "Founder & Lead Developer",
    featured: true,
    images: { thumbnail: "/campus-orbit.jpg" },
    links: { github: "https://github.com/Bernardo-e/campus-orbit", live: "https://campus-orbit-nine.vercel.app/" },
    metrics: [
      { label: "Role", value: "Founder" },
      { label: "Type", value: "Flagship" },
      { label: "Status", value: "Deployed" }
    ],
    date: "2024",
    problem: "Students lack a unified, user-friendly system to search, compare, and explore higher education institutions, leading to confusion and suboptimal academic choices.",
    solution: "Built a college discovery portal with discussion forums, custom comparison matrices, college admission odds predictors, and personalized tracking dashboards.",
    features: [
      "Dynamic College Search & Filtering",
      "Interactive Discussion Forums & Peer Channels",
      "Admission Odds Predictor Algorithms",
      "Personalized Student Application Dashboards"
    ],
    challenges: "Handling structured database relations and search indexing dynamically across thousands of colleges with low response latency.",
    lessons: "Prisma ORM queries on Neon PostgreSQL scale well when combined with proper relational indexes and cached queries."
  },
  {
    id: "shadownet-ai",
    title: "ShadowNet AI",
    slug: "shadownet-ai",
    description: "AI-powered cybersecurity platform using digital twin concepts to simulate attacks, analyze vulnerabilities and visualize security risks.",
    longDescription: "ShadowNet AI is an AI-powered cybersecurity platform using digital twin concepts to simulate attacks, analyze vulnerabilities and visualize security risks in enterprise networks.",
    tags: ["Python", "FastAPI", "React", "NetworkX", "Pandas", "Scikit-learn"],
    role: "Hackathon Project",
    featured: true,
    images: { thumbnail: "" },
    links: { github: "https://github.com/Bernardo-e/shadownet" },
    metrics: [
      { label: "Type", value: "Hackathon" },
      { label: "Engine", value: "NetworkX" },
      { label: "Analytics", value: "Scikit-learn" }
    ],
    date: "2024",
    problem: "Visualizing threat propagation vectors across complex enterprise networks is difficult, leading to slow vulnerability containment times.",
    solution: "Developed a digital twin network simulation mapping attack routes, node risks, and vulnerability indexes dynamically.",
    features: [
      "Digital Twin Network Topology Maps",
      "Interactive Threat Route Simulation",
      "Automated Attack Path Risk Scoring",
      "FastAPI Performance Optimization"
    ],
    challenges: "Modeling graph path relationships and scoring node vulnerability risks in real time under simulated network load.",
    lessons: "Using NetworkX algorithms paired with Pandas allows for high-performance topological graphing and data structures."
  },
  {
    id: "berd-ai-resume",
    title: "BERD AI Resume",
    slug: "berd-ai-resume",
    description: "AI-powered resume builder designed to generate professional resumes with a modern user experience and intelligent content generation.",
    longDescription: "BERD AI Resume is an AI-powered resume builder designed to generate professional resumes with a modern user experience and intelligent content generation.",
    tags: ["React", "Node.js", "Express.js", "MongoDB", "AI Generation"],
    role: "Lead Developer",
    featured: true,
    images: { thumbnail: "" },
    links: { github: "https://github.com/Bernardo-e" },
    metrics: [
      { label: "Builder", value: "AI-Powered" },
      { label: "UI", value: "Modern UX" },
      { label: "Status", value: "Deployed" }
    ],
    date: "2024",
    problem: "Job applicants struggle to write targeted CV bullet points and format resume sheets according to modern recruiting standards.",
    solution: "Engineered a builder utility combining LLM prompt APIs with an interactive editor to suggest achievements and construct structured layouts.",
    features: [
      "Intelligent Content suggestions",
      "Modern Real-Time Document Formatter",
      "JSON Resume Schema Exports",
      "Tailored Role-Based Templates"
    ],
    challenges: "Formatting print stylesheets dynamically so the resulting PDF matches exactly what the user sees in the editor viewport.",
    lessons: "Strict CSS Page properties and print media triggers are essential to enforce correct layout formatting during PDF exports."
  },
  {
    id: "berd-habit",
    title: "BERD Habit",
    slug: "berd-habit",
    description: "Habit tracking application with plant-growth visualization, productivity tracking and clean interactive UI.",
    longDescription: "BERD Habit tracks tasks and daily routines, gamifying streak performance into interactive plant growth visualizers.",
    tags: ["React", "Tailwind CSS", "JavaScript", "Framer Motion"],
    role: "Lead Designer & Developer",
    featured: true,
    images: { thumbnail: "/berd-habit.jpg" },
    links: { github: "https://github.com/Bernardo-e/berd-habit", live: "https://berd-habit.vercel.app/" },
    metrics: [
      { label: "UI", value: "Interactive" },
      { label: "Gamification", value: "Plant Growth" },
      { label: "Status", value: "Live" }
    ],
    date: "2023",
    problem: "Habit trackers are usually dry logs, yielding low user retention rates over extended monitoring cycles.",
    solution: "Gamified Streaks with a progression system where routines feed growth matrices.",
    features: [
      "Streak Heatmap tracker",
      "Plant Growth Progression visuals",
      "Framer Motion Transitions",
      "Local Storage Data backup"
    ],
    challenges: "Writing clean progression algorithms that calculate streaks correctly across time zones.",
    lessons: "Handling JavaScript Date objects with UTC offsets prevents streak calculation errors during time conversions."
  },
  {
    id: "berd-focus",
    title: "BERD Focus",
    slug: "berd-focus",
    description: "Minimal productivity application designed to improve focus and time management.",
    longDescription: "BERD Focus is a minimalist pomodoro focus utility designed to secure deep-work flow states and log productive session intervals.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Web Audio"],
    role: "Solo Developer",
    featured: true,
    images: { thumbnail: "/berd-focus.jpg" },
    links: { github: "https://github.com/Bernardo-e/Berd-Focus", live: "https://berd-focus.vercel.app/" },
    metrics: [
      { label: "Style", value: "Minimalist" },
      { label: "Focus", value: "Pomodoro" },
      { label: "Status", value: "Live" }
    ],
    date: "2023",
    problem: "Frequent context switching and browser notifications erode deep work productivity periods.",
    solution: "Designed a clean Pomodoro utility with ambient audio loops and strict progress alerts.",
    features: [
      "Precision Interval focus timers",
      "Ambient Audio loops",
      "Persistent Session logs",
      "Responsive layout controls"
    ],
    challenges: "Configuring Web Audio context permissions cleanly without blocking during initial page load.",
    lessons: "Triggering Audio node initialization only after direct user interaction respects browser constraints and prevents launch crashes."
  },
  {
    id: "berd-todo-list",
    title: "BERD To Do List",
    slug: "berd-todo-list",
    description: "Modern task management application with intuitive UI, smooth interactions and productivity-focused workflow.",
    longDescription: "BERD To Do List streamlines daily tasks, incorporating smooth Framer Motion transitions and productivity metrics.",
    tags: ["React", "Tailwind CSS", "Framer Motion"],
    role: "Developer",
    featured: true,
    images: { thumbnail: "" },
    links: { github: "https://github.com/Bernardo-e" },
    metrics: [
      { label: "UX", value: "Smooth Transitions" },
      { label: "Workflow", value: "Productivity" },
      { label: "Status", value: "Live" }
    ],
    date: "2023",
    problem: "To-do lists are often cluttered and laggy, reducing the motivation to catalog daily achievements.",
    solution: "Built a fast, single-page checklist featuring animated states and task prioritization sorting.",
    features: [
      "Smooth Framer Motion Drag and Drop",
      "Priority status sorting",
      "Responsive layout grid",
      "Instant state updates"
    ],
    challenges: "Synchronizing React lists during drag-and-drop sort triggers without causing layout shifting.",
    lessons: "Framer Motion's LayoutId coordinate transitions keep list re-orderings smooth and prevent screen stutter."
  },
  {
    id: "berd-vault",
    title: "BERD Vault",
    slug: "berd-vault",
    description: "Student note-sharing platform focused on collaboration, exam preparation and community learning.",
    longDescription: "BERD Vault is a student note-sharing platform focused on collaboration, exam preparation and community learning.",
    tags: ["Node.js", "Express.js", "MongoDB", "RBAC"],
    role: "Lead Developer",
    featured: true,
    images: { thumbnail: "" },
    links: { github: "https://github.com/Bernardo-e" },
    metrics: [
      { label: "Focus", value: "Exam Prep" },
      { label: "Security", value: "RBAC" },
      { label: "Status", value: "In Development" }
    ],
    date: "2023",
    problem: "Students lack structured notes repositories, forcing them to rely on scattered chats and unverified documents before exams.",
    solution: "Constructing a secure notes repository featuring document moderation rules and role-based permissions.",
    features: [
      "Exam Mode note filters",
      "Secure RBAC credentials",
      "Upvoting & peer ratings",
      "MongoDB document catalog"
    ],
    challenges: "Designing clean API middlewares to intercept and moderate files dynamically based on student ratings.",
    lessons: "MongoDB aggregator expressions allow for clean sorting of documents based on upvote rates and date weights."
  }
];

export const featuredProjects = projects.filter(p => p.featured);
