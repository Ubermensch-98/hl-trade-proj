import { NextResponse } from 'next/server';

export async function POST(req: Request): Promise<NextResponse> {
  let body;
  try {
    body = await req.json();
    console.log('🎞🎞🎞 route.ts body:', body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const upstream = await fetch('https://api.hyperliquid.xyz/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!upstream.ok) {
      const errorData = await upstream.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: upstream.status });
    }

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch from upstream API' }, { status: 502 });
  }
}
