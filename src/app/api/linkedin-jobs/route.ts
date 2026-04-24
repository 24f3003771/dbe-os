import { query } from 'linkedin-jobs-api';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') || 'internship';
    const location = searchParams.get('location') || 'India';

    try {
        console.log(`Fetching LinkedIn jobs for: ${keyword} in ${location}`);
        const jobs = await query({
            keyword: keyword,
            location: location,
            dateSincePosted: 'past Month', // Increased range for better results during testing
            jobType: 'internship',
            limit: '20',
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
