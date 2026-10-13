export interface SkillItem {
  name: string;
  isPrimary?: boolean;
  highlight?: boolean;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: SkillItem[];
  icon: string; // Lucide icon identifier
}

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    title: "Programming Languages",
    description: "Core languages for algorithmic logic, system scripting, and software construction.",
    icon: "Code2",
    skills: [
      { name: "Python", isPrimary: true, highlight: true },
      { name: "C" },
      { name: "JavaScript" },
      { name: "SQL" }
    ]
  },
  {
    id: "backend",
    title: "Backend Development",
    description: "Server-side services, RESTful API design, application logic, and microservices.",
    icon: "Server",
    skills: [
      { name: "Python", isPrimary: true, highlight: true },
      { name: "Flask", isPrimary: true, highlight: true },
      { name: "Node.js" },
      { name: "Express.js" }
    ]
  },
  {
    id: "ai-cv",
    title: "AI & Computer Vision",
    description: "Object detection, visual processing pipelines, and applied intelligence models.",
    icon: "Cpu",
    skills: [
      { name: "YOLO", highlight: true },
      { name: "OpenCV", highlight: true },
      { name: "NLP Fundamentals" }
    ]
  },
  {
    id: "frontend",
    title: "Frontend Development",
    description: "Interactive user interfaces, modern component architectures, and responsive web styling.",
    icon: "Layout",
    skills: [
      { name: "React.js", highlight: true },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
      { name: "HTML5" },
      { name: "CSS3" }
    ]
  },
  {
    id: "databases",
    title: "Databases & Storage",
    description: "Relational querying, schema design, and document-oriented databases.",
    icon: "Database",
    skills: [
      { name: "MySQL" },
      { name: "MongoDB" },
      { name: "Oracle SQL" }
    ]
  },
  {
    id: "tools",
    title: "Tools & Platforms",
    description: "Version control, containerization, cloud learning, and engineering environments.",
    icon: "Wrench",
    skills: [
      { name: "Git" },
      { name: "GitHub" },
      { name: "VS Code" },
      { name: "Docker" },
      { name: "Google Cloud Skills Boost" },
      { name: "Antigravity" }
    ]
  }
];

export const currentlyLearning: string[] = [
  "Data Structures and Algorithms (DSA)",
  "AI & Machine Learning (Deep Learning Foundations)",
  "Full-Stack Architectural Patterns"
];
