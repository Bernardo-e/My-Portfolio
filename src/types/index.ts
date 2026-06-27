export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  tags: string[];
  role: string;
  featured: boolean;
  images: {
    thumbnail: string;
    gallery?: string[];
  };
  links: {
    github?: string;
    live?: string;
  };
  metrics?: {
    label: string;
    value: string;
  }[];
  date: string;
  problem?: string;
  solution?: string;
  features?: string[];
  challenges?: string;
  lessons?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string; // "Present" or Date
  description: string[];
  skills: string[];
}

export interface SkillCategory {
  id: string;
  title: string;
  skills: {
    name: string;
    level?: number; // 1-5 or similar (optional)
    icon?: string; // name of Lucide icon
  }[];
}

export interface SiteConfig {
  name: string;
  role: string;
  tagline: string;
  about: string;
  socials: {
    github: string;
    linkedin: string;
    twitter?: string;
    email: string;
  };
}
