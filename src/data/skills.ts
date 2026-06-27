export interface Skill {
  name: string;
  category: string;
  level: number; // 1-5
  icon?: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  color: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    color: "#0ea5e9",
    skills: [
      { name: "HTML", category: "frontend", level: 5 },
      { name: "CSS", category: "frontend", level: 5 },
      { name: "JavaScript", category: "frontend", level: 5 },
      { name: "TypeScript", category: "frontend", level: 5 },
      { name: "React", category: "frontend", level: 5 },
      { name: "Next.js", category: "frontend", level: 5 },
      { name: "Tailwind CSS", category: "frontend", level: 5 },
    ]
  },
  {
    id: "backend",
    label: "Backend",
    color: "#7c3aed",
    skills: [
      { name: "Node.js", category: "backend", level: 5 },
      { name: "Express.js", category: "backend", level: 5 },
      { name: "Python", category: "backend", level: 5 },
      { name: "FastAPI", category: "backend", level: 5 },
    ]
  },
  {
    id: "database",
    label: "Database",
    color: "#06b6d4",
    skills: [
      { name: "PostgreSQL", category: "database", level: 5 },
      { name: "MongoDB", category: "database", level: 5 },
      { name: "Prisma ORM", category: "database", level: 5 },
      { name: "Neon Database", category: "database", level: 5 },
    ]
  },
  {
    id: "tools",
    label: "Tools",
    color: "#3b82f6",
    skills: [
      { name: "Git", category: "tools", level: 5 },
      { name: "GitHub", category: "tools", level: 5 },
      { name: "VS Code", category: "tools", level: 5 },
      { name: "Vercel", category: "tools", level: 5 },
      { name: "Figma", category: "tools", level: 5 },
    ]
  }
];

export const allSkills = skillCategories.flatMap(c => c.skills);
