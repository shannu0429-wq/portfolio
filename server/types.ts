export interface ProfileData {
  name: string;
  preferredName: string;
  title: string;
  tagline: string;
  careerGoal: string;
  heroIntro: string;
  about: {
    overview: string;
    focusAreas: string[];
    strengths: string[];
  };
  location: string;
  college: string;
  degree: string;
  branch: string;
  year: string;
  photoUrl: string;
  photoPlaceholderText: string;
  resumeAvailable: boolean;
  resumeUrl: string;
}

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
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  techStack: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  featured: boolean;
  category: "AI / Python" | "Computer Vision & IoT" | "Web Application";
  highlightBadge?: string;
  previewGradient: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  branch: string;
  currentYear: string;
  description: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
  skills?: string[];
  description?: string;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  label: string;
}

export interface PortfolioState {
  profile: ProfileData;
  skills: {
    categories: SkillCategory[];
    currentlyLearning: string[];
  };
  projects: Project[];
  education: EducationItem[];
  certifications: Certification[];
  socialLinks: SocialLink[];
  lastUpdated: string;
}
