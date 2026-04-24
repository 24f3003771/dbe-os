import { query } from 'linkedin-jobs-api';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') || 'internship';
    const location = searchParams.get('location') || 'India';

    const limit = searchParams.get('limit') || '25';

    try {
        console.log(`Fetching LinkedIn jobs for: ${keyword} in ${location} (Limit: ${limit})`);
        const jobs = await query({
            keyword: keyword,
            location: location,
            dateSincePosted: 'past Month', // Covers the 15-day window
            jobType: 'internship',
            limit: limit,
        });
        
        return NextResponse.json(jobs);
    } catch (error: any) {
        console.error('LinkedIn API Error:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch jobs from LinkedIn',
            details: error.message 
        }, { status: 500 });
    }
}
