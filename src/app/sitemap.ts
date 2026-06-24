import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dbeos.in'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/deadlines`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quiz`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/notes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/developers`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...[
      'best-notes-platform-for-iim-bangalore-dbe',
      'iim-bangalore-bba-dbe',
      'dbe-semester-1-notes',
      'dbe-semester-2-notes',
      'dbe-statistics-notes',
      'dbe-economics-notes',
      'dbe-quiz-answers',
      'iim-bangalore-dbe-internship',
      'dbe-career-roadmap',
      'dbe-study-material',
      'college-hive-alternative',
      'ace-dbe-alternative'
    ].map((slug) => ({
      url: `${baseUrl}/p/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
