export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  branch: string;
  currentYear: string;
  description: string;
  highlights: string[];
}

export const educationData: EducationItem[] = [
  {
    id: "vvit-btech",
    institution: "Vasireddy Venkatadri Institute of Technology (VVIT)",
    degree: "Bachelor of Technology (B.Tech)",
    branch: "Computer Science and Engineering (CSE)",
    currentYear: "3rd Year",
    description: "Building strong fundamentals in Computer Science with a practical focus on software development, Python programming, algorithms, database systems, and modern web technologies.",
    highlights: [
      "Core coursework in Data Structures, Object-Oriented Programming, and DBMS",
      "Practical project implementation combining machine learning & full-stack development",
      "Active focus on problem-solving, collaborative engineering, and continuous learning"
    ]
  }
];
