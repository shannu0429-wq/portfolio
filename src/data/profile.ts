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

export const profileData: ProfileData = {
  name: "SOMISETTY SHANMUKHA",
  preferredName: "Shanmukha",
  title: "Python Developer | AI Enthusiast | Problem Solver",
  tagline: "Computer Science Engineering Student @ VVIT",
  careerGoal: "Seeking software development and Python developer internship opportunities where I can learn, contribute, and solve real-world challenges with clean, robust code.",
  heroIntro: "Build practical software solutions with Python, explore AI, and turn ideas into useful applications.",
  about: {
    overview: "I am a 3rd-year Computer Science and Engineering undergraduate at Vasireddy Venkatadri Institute of Technology (VVIT). My primary programming strength lies in Python development, complemented by hands-on experience in backend architectures with Flask, modern frontend workflows, and computer vision with YOLO and OpenCV. I focus on developing practical, dependable software systems that solve real problems.",
    focusAreas: [
      "Backend engineering and RESTful APIs using Python & Flask",
      "Computer Vision applications using YOLO & OpenCV",
      "Modern web interfaces with React, TypeScript & Tailwind CSS",
      "Algorithmic problem solving and Data Structures (DSA)"
    ],
    strengths: [
      "Clean, maintainable Python code",
      "Hands-on project development from ideation to implementation",
      "Quick adaptability to new frameworks and tools",
      "Analytical mindset and continuous learning habits"
    ]
  },
  location: "Andhra Pradesh, India",
  college: "Vasireddy Venkatadri Institute of Technology (VVIT)",
  degree: "B.Tech",
  branch: "Computer Science and Engineering (CSE)",
  year: "3rd Year",
  photoUrl: "/images/profile.jpg",
  photoPlaceholderText: "YOUR PHOTO HERE",
  resumeAvailable: false, // Set to true when public/resume.pdf is provided
  resumeUrl: "/resume.pdf"
};
