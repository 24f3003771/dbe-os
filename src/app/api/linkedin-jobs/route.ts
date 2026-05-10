import { query } from 'linkedin-jobs-api';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') || 'internship';
    const location = searchParams.get('location') || 'India';

    const limit = searchParams.get('limit') || '25';

    try {
        const queryOptions = {
            keyword: keyword,
            location: location,
            dateSincePosted: 'past month', // Use lowercase as per docs
            limit: limit,
        };

        // If searching specifically for internships, include the filter
        if (keyword.toLowerCase().includes('intern') || keyword.toLowerCase().includes('student')) {
            (queryOptions as any).jobType = 'internship';
        }

        console.log(`Fetching LinkedIn jobs for: ${keyword} in ${location} (Limit: ${limit})`);
        const jobs = await query(queryOptions);
        
        // Normalize field names: the library returns `position` and `agoTime`
        // but our frontend reads `title` and `postDate`
        const normalized = Array.isArray(jobs)
            ? jobs.map((job: any) => ({
                title: job.position || job.title || 'Untitled Role',
                company: job.company || '',
                location: job.location || '',
                postDate: job.agoTime || job.postDate || job.date || '',
                jobUrl: job.jobUrl || job.url || '#',
                companyLogo: job.companyLogo || job.logo || '',
            }))
            : [];

        return NextResponse.json(normalized);
    } catch (error: any) {
        console.error('LinkedIn API Error:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch jobs from LinkedIn',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
