import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const upstream = await fetch('https://api.hyperliquid.xyz/info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  // Pass through status and JSON
  const data = await upstream.json().catch(() => ({}));
  return NextResponse.json(data, { status: upstream.status });
}
