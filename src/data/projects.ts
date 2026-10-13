export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  techStack: string[];
  githubUrl: string | null; // null if not available yet
  demoUrl: string | null;   // null if not available yet
  featured: boolean;
  category: "AI / Python" | "Computer Vision & IoT" | "Web Application";
  highlightBadge?: string;
  previewGradient: string;
}

export const projectsData: Project[] = [
  {
    id: "jobalign-ai",
    title: "JobAlign AI",
    tagline: "AI-assisted resume & job matching platform",
    description: "An AI-assisted resume and job matching platform that extracts relevant information from resumes, compares candidate skills with job requirements, and provides match scores with missing-skill insights.",
    techStack: ["Python", "Flask", "MySQL", "NLP Fundamentals", "HTML5", "CSS3", "JavaScript"],
    githubUrl: null, // To be added later
    demoUrl: null,   // Not available yet
    featured: true,
    category: "AI / Python",
    highlightBadge: "Python & NLP",
    previewGradient: "from-cyan-500/20 via-blue-500/20 to-indigo-500/20"
  },
  {
    id: "smart-farm-assistant",
    title: "Smart Farm Assistant",
    tagline: "Vision-based animal detection & crop protection",
    description: "A smart crop protection system that uses animal detection to help protect crops from potential threats. It uses computer vision to identify animals and can trigger alerts to notify the farmer.",
    techStack: ["Python", "YOLO", "OpenCV", "Flask", "ESP32-CAM", "Arduino"],
    githubUrl: "https://github.com/shannu0429-wq/sih-B47-2026",
    demoUrl: null,   // Not available yet
    featured: true,
    category: "Computer Vision & IoT",
    highlightBadge: "YOLO & OpenCV",
    previewGradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20"
  },
  {
    id: "bugflow",
    title: "BugFlow",
    tagline: "Modern software issue tracking & workflow manager",
    description: "A software issue-tracking platform designed to help teams report, organize, track, and manage software bugs efficiently.",
    techStack: ["React", "TypeScript", "Vite", "Zustand", "React Hook Form", "Zod", "Docker"],
    githubUrl: "https://github.com/shannu0429-wq/BugFlow-Nexus",
    demoUrl: null,   // Not available yet
    featured: true,
    category: "Web Application",
    highlightBadge: "React & TypeScript",
    previewGradient: "from-purple-500/20 via-violet-500/20 to-sky-500/20"
  }
];
