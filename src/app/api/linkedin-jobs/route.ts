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
        
        return NextResponse.json(jobs);
    } catch (error: any) {
        console.error('LinkedIn API Error:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch jobs from LinkedIn',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
