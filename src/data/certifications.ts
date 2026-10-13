export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
  skills?: string[];
  description?: string;
}

/**
 * Add your certifications here as you achieve them!
 * Example:
 * {
 *   id: "cert-1",
 *   title: "Python for Everybody",
 *   issuer: "University of Michigan / Coursera",
 *   issueDate: "2024",
 *   credentialUrl: "https://example.com/verify",
 *   skills: ["Python", "Data Structures"]
 * }
 */
export const certificationsData: Certification[] = [
  // Ready to be populated by user. Kept empty per instructions to avoid inventing credentials.
];
