export interface Resume {
  basics: {
    name: string;
    label: string;
    email: string;
    phone: string;
    url: string;
    summary: string;
    location: {
      address: string;
      postalCode: string;
      city: string;
      countryCode: string;
      region: string;
    };
    profiles: Array<{
      network: string;
      username: string;
      url: string;
    }>;
  };
  work: Array<{
    name: string;
    position: string;
    url: string;
    startDate: string;
    endDate: string;
    summary: string;
    highlights: string[]; // Bullet points
    keywords?: string[]; // AI extracted keywords
  }>;
  education: Array<{
    institution: string;
    url: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate: string;
    score: string;
    courses: string[];
  }>;
  skills: Array<{
    name: string;
    level: string;
    keywords: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    highlights: string[];
    keywords?: string[];
    url: string;
  }>;
  languages: Array<{
    language: string;
    fluency: string;
  }>;
  interests: Array<{
    name: string;
    keywords: string[];
  }>;
  meta: {
    canonical: string;
    version: string;
    lastModified: string;
    atsScore?: number;
  };
}
