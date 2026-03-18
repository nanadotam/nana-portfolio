import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Get IP from various headers (works with proxies/cloudflare)
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      req.headers.get('cf-connecting-ip') ||
      req.ip ||
      'unknown';

    return NextResponse.json({ ip });
  } catch (error) {
    console.error('IP fetch error:', error);
    return NextResponse.json({ ip: 'unknown' }, { status: 200 });
  }
}
