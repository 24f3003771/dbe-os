export interface CareerGuide {
  id: string;
  title: string;
  category: string;
  description: string;
  roleId: string;
  tags: string[];
}

export const careerGuides: CareerGuide[] = [
  {
    id: "RM_001",
    title: "Frontend Developer",
    category: "Web Development",
    roleId: "frontend",
    tags: ["react", "javascript", "css", "html"],
    description: "Step by step guide to becoming a modern frontend developer in 2024. Learn HTML, CSS, JavaScript, and popular frameworks like React and Vue."
  },
  {
    id: "RM_002",
    title: "Backend Developer",
    category: "Web Development",
    roleId: "backend",
    tags: ["node.js", "databases", "api", "architecture"],
    description: "Complete roadmap to becoming a backend engineer. Master server-side languages, databases, APIs, and system design."
  },
  {
    id: "RM_003",
    title: "DevOps Engineer",
    category: "Operations",
    roleId: "devops",
    tags: ["ci/cd", "cloud", "docker", "kubernetes"],
    description: "Step by step guide for DevOps or Site Reliability Engineers. Learn CI/CD, containerization, infrastructure as code, and cloud providers."
  },
  {
    id: "RM_004",
    title: "Full Stack Developer",
    category: "Web Development",
    roleId: "full-stack",
    tags: ["frontend", "backend", "database", "deployment"],
    description: "The complete path to full stack development. Combines both frontend and backend architectures into a single cohesive guide."
  },
  {
    id: "RM_005",
    title: "AI & Data Scientist",
    category: "Data & AI",
    roleId: "ai-data-scientist",
    tags: ["python", "machine learning", "data", "math"],
    description: "Roadmap to becoming an AI and Data Scientist. Learn mathematics, statistics, Python, machine learning, and deep learning."
  },
  {
    id: "RM_006",
    title: "Android Developer",
    category: "Mobile",
    roleId: "android",
    tags: ["kotlin", "mobile", "java", "android studio"],
    description: "Step by step guide to becoming an Android Developer. Learn Kotlin, Android SDK, and mobile app architecture."
  },
  {
    id: "RM_007",
    title: "iOS Developer",
    category: "Mobile",
    roleId: "ios",
    tags: ["swift", "mobile", "apple", "xcode"],
    description: "Step by step guide to becoming an iOS Developer. Learn Swift, iOS SDK, and the Apple ecosystem."
  },
  {
    id: "RM_008",
    title: "Software Architect",
    category: "Engineering",
    roleId: "software-architect",
    tags: ["system design", "patterns", "leadership", "scale"],
    description: "Roadmap to becoming a Software Architect. Master design patterns, system design, scalability, and technical leadership."
  }
];
