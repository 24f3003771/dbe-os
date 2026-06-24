import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('google-site-verification: google5bc632c88f1e1267.html', {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
