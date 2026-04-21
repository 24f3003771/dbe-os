export interface CareerGuide {
  id: string;
  title: string;
  company: string;
  year: number;
  category: string;
  pages: number;
  format: string;
  url: string;
  tags: string[];
  description: string;
  localPath: string;
}

export const careerGuides: CareerGuide[] = [
  {
    id: "CG_001",
    title: "Social Trends 2024 Report",
    company: "Hootsuite",
    year: 2024,
    category: "Social Media",
    pages: 45,
    format: "PDF",
    url: "https://hootsuite.widen.net/s/mgqjjznhsx/hootsuitesocialtrends2024_report_en",
    tags: ["trends", "social media", "strategy"],
    description: "Hootsuite's comprehensive guide to social media trends and strategy for 2024.",
    localPath: "/career-guides/Hootsuite_Social_Trends_2024.pdf"
  },
  {
    id: "CG_002",
    title: "Consumer Trends 2024",
    company: "HubSpot",
    year: 2024,
    category: "Marketing",
    pages: 38,
    format: "PDF",
    url: "https://www.hubspot.com/hubfs/HSCM%20Hopin/2024_Social_Media_Trends_Report.pdf",
    tags: ["consumer", "marketing", "trends"],
    description: "Insights into consumer behavior and marketing trends for the upcoming year.",
    localPath: "/career-guides/HubSpot_Consumer_Trends_2024.pdf"
  },
  {
    id: "CG_003",
    title: "Social Trends 2025 Preview",
    company: "HubSpot",
    year: 2025,
    category: "Social Media",
    pages: 12,
    format: "PDF",
    url: "https://www.hubspot.com/social-media-trends",
    tags: ["trends", "future", "social"],
    description: "Forward-looking social media insights for 2025 from the HubSpot team.",
    localPath: "/career-guides/HubSpot_Social_Trends_2025.pdf"
  },
  {
    id: "CG_004",
    title: "B2B Marketing Benchmark 2024",
    company: "LinkedIn",
    year: 2024,
    category: "B2B",
    pages: 52,
    format: "PDF",
    url: "https://business.linkedin.com/marketing-solutions/growth-guide",
    tags: ["B2B", "LinkedIn", "benchmarks"],
    description: "Critical benchmarks and strategies for B2B marketers on LinkedIn.",
    localPath: "/career-guides/LinkedIn_B2B_Benchmark_2024.pdf"
  },
  {
    id: "CG_005",
    title: "Marketing Solutions Growth Guide",
    company: "LinkedIn",
    year: 2024,
    category: "Growth",
    pages: 20,
    format: "PDF",
    url: "https://business.linkedin.com/marketing-solutions/growth-guide",
    tags: ["growth", "advertising", "LinkedIn"],
    description: "Strategic guide for scaling marketing efforts using LinkedIn solutions.",
    localPath: "/career-guides/LinkedIn_Growth_Guide.pdf"
  },
  {
    id: "CG_006",
    title: "Pinterest Presents 2024",
    company: "Pinterest",
    year: 2024,
    category: "Inspiration",
    pages: 35,
    format: "PDF",
    url: "https://business.pinterest.com/en-in/pinterest-presents-2024",
    tags: ["creative", "visual", "trends"],
    description: "Visual discovery trends and creative inspiration from Pinterest's annual event.",
    localPath: "/career-guides/Pinterest_Presents_2024.pdf"
  },
  {
    id: "CG_007",
    title: "Sprout Social Index XIX",
    company: "Sprout Social",
    year: 2024,
    category: "Social Media",
    pages: 60,
    format: "PDF",
    url: "https://sproutsocial.com/index/",
    tags: ["index", "social data", "engagement"],
    description: "Deep dive into social media data, engagement metrics, and consumer expectations.",
    localPath: "/career-guides/Sprout_Social_Index_XIX.pdf"
  }
];
