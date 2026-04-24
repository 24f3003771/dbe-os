import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const opportunity = searchParams.get('opportunity') || 'competitions';
    const oppstatus = searchParams.get('oppstatus') || 'open';
    const category = searchParams.get('category') || '';
    const query = searchParams.get('q') || '';
    const page = searchParams.get('page') || '1';

    // Build the Unstop API URL
    const unstopUrl = new URL('https://unstop.com/api/public/opportunity/search-result');
    unstopUrl.searchParams.append('opportunity', opportunity);
    unstopUrl.searchParams.append('oppstatus', oppstatus);
    unstopUrl.searchParams.append('page', page);
    unstopUrl.searchParams.append('per_page', '15');
    
    if (category) unstopUrl.searchParams.append('category', category);
    if (query) unstopUrl.searchParams.append('q', query);

    try {
        const response = await fetch(unstopUrl.toString(), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://unstop.com/'
            }
        });

        if (!response.ok) {
            throw new Error(`Unstop API responded with ${response.status}`);
        }

        const data = await response.json();
        
        // Transform Unstop data to a cleaner format for our frontend
        const competitions = data?.data?.data?.map((item: any) => ({
            id: item.id,
            title: item.title,
            organizer: item.organisation?.name,
            logo: item.organisation?.logo_url,
            banner: item.banner_url,
            deadline: item.regn_end_date,
            url: `https://unstop.com/${item.public_url}`,
            category: item.category?.name,
            opportunity_type: item.opportunity_type,
            prizes: item.prizes_description,
            mode: item.mode,
            views: item.views_count,
            daysLeft: item.days_left
        })) || [];

        return NextResponse.json(competitions);
    } catch (error: any) {
        console.error('Unstop Fetch Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
