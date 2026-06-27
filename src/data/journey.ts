export interface JourneyEntry {
  id: string;
  year: string;
  role: string;
  company: string;
  location: string;
  type: "work" | "education" | "startup" | "milestone";
  description: string;
  highlight?: string; // Key achievement
}

export const journeyEntries: JourneyEntry[] = [
  {
    id: "programming-start",
    year: "2019",
    role: "Started Programming",
    company: "Self-Taught",
    location: "Home",
    type: "milestone",
    description: "Wrote my very first lines of code. Discovered a deep fascination for turning concepts and logical structures into tangible programs.",
    highlight: "Hello World"
  },
  {
    id: "html-css",
    year: "2020",
    role: "HTML & CSS",
    company: "Foundational Design",
    location: "Remote",
    type: "education",
    description: "Learned the core building blocks of the web. Focused on semantic markup, responsive layouts, and structured CSS design systems.",
    highlight: "Web Fundamentals"
  },
  {
    id: "javascript",
    year: "2021",
    role: "JavaScript",
    company: "Logic & Algorithms",
    location: "Remote",
    type: "education",
    description: "Dived deep into DOM manipulation, asynchronous programming, APIs, and data structures. Started building dynamic web tools.",
    highlight: "Dynamic Applications"
  },
  {
    id: "react",
    year: "2022",
    role: "React",
    company: "Component Architecture",
    location: "Remote",
    type: "milestone",
    description: "Adopted component-driven frontend architecture. Mastered hooks, global states, and high-performance client rendering patterns.",
    highlight: "Single Page Apps"
  },
  {
    id: "nextjs",
    year: "2023",
    role: "Next.js",
    company: "Production Frameworks",
    location: "Remote",
    type: "work",
    description: "Transitioned to Next.js for server-side rendering, routing, API optimization, and edge hosting. Built high-performance, SEO-friendly applications.",
    highlight: "Full Stack Apps"
  },
  {
    id: "campus-orbit",
    year: "2023",
    role: "Campus Orbit",
    company: "Founder & Lead Engineer",
    location: "Chennai, India",
    type: "startup",
    description: "Created and launched a unified academic operations platform orchestrating semester planning, exam dashboards, study spaces, and notifications.",
    highlight: "40+ Beta Testers"
  },
  {
    id: "hackathon-win",
    year: "2024",
    role: "Hackathon Winner",
    company: "SIMATS (Saveetha Engineering College)",
    location: "Chennai, India",
    type: "milestone",
    description: "Secured first place in a university-wide 36-hour hackathon, designing and deploying an automated threat containment solution for network security.",
    highlight: "1st Place Winner"
  },
  {
    id: "product-building",
    year: "2025",
    role: "Building Products",
    company: "Product Engineering",
    location: "Remote",
    type: "work",
    description: "Created and scaled ShadowNet AI, BERD Habit, and BERD Focus, focusing on end-to-end user experience, database systems, and ML capabilities.",
    highlight: "Multiple SaaS Shipped"
  },
  {
    id: "internship-search",
    year: "2026",
    role: "Seeking Internship",
    company: "Next Career Chapter",
    location: "Worldwide / Hybrid",
    type: "milestone",
    description: "Looking for an internship opportunity at a high-growth tech organization to solve complex engineering challenges and collaborate on real-world products.",
    highlight: "Open to Internships"
  }
];
