export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string; // Lucide icon identifier
  label: string;
}

export const socialLinks: SocialLink[] = [
  {
    id: "github",
    name: "GitHub",
    url: "https://github.com/shannu0429-wq",
    icon: "Github",
    label: "github.com/shannu0429-wq"
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/s-shanmukha-88397432a/",
    icon: "Linkedin",
    label: "linkedin.com/in/s-shanmukha-88397432a"
  },
  {
    id: "email",
    name: "Email",
    url: "mailto:shannu0429@gmail.com",
    icon: "Mail",
    label: "shannu0429@gmail.com"
  }
];
