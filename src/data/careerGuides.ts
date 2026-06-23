export interface CareerGuide {
  id: string;
  title: string;
  category: string;
  description: string;
  roleId: string;
  tags: string[];
}

export const careerGuides: CareerGuide[] = [
  // ── Engineering ──────────────────────────────────────────────────────────────
  {
    id: "RM_001",
    title: "Frontend Developer",
    category: "Engineering",
    roleId: "frontend",
    tags: ["react", "javascript", "css", "html"],
    description: "Step by step guide to becoming a modern frontend developer in 2024. Learn HTML, CSS, JavaScript, and popular frameworks like React and Vue."
  },
  {
    id: "RM_002",
    title: "Backend Developer",
    category: "Engineering",
    roleId: "backend",
    tags: ["node.js", "databases", "api", "architecture"],
    description: "Complete roadmap to becoming a backend engineer. Master server-side languages, databases, APIs, and system design."
  },
  {
    id: "RM_003",
    title: "DevOps Engineer",
    category: "Engineering",
    roleId: "devops",
    tags: ["ci/cd", "cloud", "docker", "kubernetes"],
    description: "Step by step guide for DevOps or Site Reliability Engineers. Learn CI/CD, containerization, infrastructure as code, and cloud providers."
  },
  {
    id: "RM_004",
    title: "Full Stack Developer",
    category: "Engineering",
    roleId: "full-stack",
    tags: ["frontend", "backend", "database", "deployment"],
    description: "The complete path to full stack development. Combines both frontend and backend architectures into a single cohesive guide."
  },
  {
    id: "RM_005",
    title: "AI & Data Scientist",
    category: "Engineering",
    roleId: "ai-data-scientist",
    tags: ["python", "machine learning", "data", "math"],
    description: "Roadmap to becoming an AI and Data Scientist. Learn mathematics, statistics, Python, machine learning, and deep learning."
  },
  {
    id: "RM_006",
    title: "Android Developer",
    category: "Engineering",
    roleId: "android",
    tags: ["kotlin", "mobile", "java", "android studio"],
    description: "Step by step guide to becoming an Android Developer. Learn Kotlin, Android SDK, and mobile app architecture."
  },
  {
    id: "RM_007",
    title: "iOS Developer",
    category: "Engineering",
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
  },

  // ── Business & Consulting ─────────────────────────────────────────────────
  {
    id: "RM_009",
    title: "Management Consultant",
    category: "Business & Consulting",
    roleId: "management-consultant",
    tags: ["problem solving", "strategy", "excel", "case interviews"],
    description: "Complete roadmap to cracking consulting. Master case interviews, MECE frameworks, Excel modeling, and client communication to land roles at MBB and Big 4."
  },
  {
    id: "RM_010",
    title: "Product Manager",
    category: "Business & Consulting",
    roleId: "product-manager-biz",
    tags: ["product", "ux", "analytics", "strategy"],
    description: "Learn how to build products people love. From customer discovery and wireframing to roadmapping, GTM, and product analytics."
  },
  {
    id: "RM_011",
    title: "Marketing Manager",
    category: "Business & Consulting",
    roleId: "marketing-manager",
    tags: ["branding", "digital marketing", "growth", "seo"],
    description: "The complete guide to modern marketing management. Master brand strategy, content, SEO, paid ads, and performance marketing analytics."
  },
  {
    id: "RM_012",
    title: "Growth Manager",
    category: "Business & Consulting",
    roleId: "growth-manager",
    tags: ["growth", "experimentation", "funnels", "retention"],
    description: "Learn the art and science of growth. Master growth loops, A/B testing, funnel optimization, retention, and product-led growth strategies."
  },
  {
    id: "RM_013",
    title: "Business Analyst",
    category: "Business & Consulting",
    roleId: "business-analyst",
    tags: ["excel", "sql", "analytics", "reporting"],
    description: "Step by step guide to becoming a Business Analyst. Learn Excel, SQL, data visualization, business metrics, and structured problem-solving."
  },

  // ── Finance & Investment ──────────────────────────────────────────────────
  {
    id: "RM_014",
    title: "Investment Banker",
    category: "Finance & Investment",
    roleId: "investment-banker",
    tags: ["finance", "valuation", "m&a", "modeling"],
    description: "The complete Investment Banking roadmap. Master financial statements, DCF modeling, M&A, LBO analysis, and how to build a world-class pitch book."
  },
  {
    id: "RM_015",
    title: "Equity Research Analyst",
    category: "Finance & Investment",
    roleId: "equity-research-analyst",
    tags: ["stocks", "finance", "research", "valuation"],
    description: "Learn to analyze stocks like a professional. Master financial statements, valuation methods, industry research, and writing compelling investment reports."
  },
  {
    id: "RM_016",
    title: "Venture Capital Analyst",
    category: "Finance & Investment",
    roleId: "venture-capital-analyst",
    tags: ["startups", "investing", "due diligence", "cap tables"],
    description: "Break into VC. Learn deal sourcing, startup evaluation, due diligence, cap tables, term sheets, and the economics of a VC fund."
  },
  {
    id: "RM_017",
    title: "Private Equity Analyst",
    category: "Finance & Investment",
    roleId: "private-equity-analyst",
    tags: ["finance", "lbo", "investments", "modeling"],
    description: "The complete Private Equity roadmap. Master LBO modeling, financial due diligence, deal structuring, portfolio operations, and exit strategies."
  },

  // ── Strategy & Leadership ─────────────────────────────────────────────────
  {
    id: "RM_018",
    title: "Corporate Strategy Manager",
    category: "Strategy & Leadership",
    roleId: "corporate-strategy-manager",
    tags: ["strategy", "business", "competitive analysis", "planning"],
    description: "Build the skills to lead corporate strategy. Learn competitive analysis, market sizing, strategic planning, M&A, and stakeholder management."
  },

  // ── Startup & Entrepreneurship ────────────────────────────────────────────
  {
    id: "RM_019",
    title: "Startup Founder",
    category: "Startup & Entrepreneurship",
    roleId: "startup-founder",
    tags: ["entrepreneurship", "business", "fundraising", "mvp"],
    description: "Everything you need to build a startup from zero to one. Learn idea validation, MVP building, fundraising, sales, team building, and scaling."
  },
  {
    id: "RM_020",
    title: "Chief of Staff",
    category: "Startup & Entrepreneurship",
    roleId: "chief-of-staff",
    tags: ["operations", "strategy", "leadership", "planning"],
    description: "The guide to becoming a world-class Chief of Staff. Master strategic planning, project management, communication, and founder office operations."
  },
  {
    id: "RM_021",
    title: "Business Development Manager",
    category: "Startup & Entrepreneurship",
    roleId: "business-development-manager",
    tags: ["partnerships", "sales", "b2b", "revenue growth"],
    description: "Learn how to drive revenue through partnerships and sales. Master lead generation, B2B sales, negotiation, partnerships, and revenue operations."
  },
];
