import { NextResponse } from 'next/server';

// Constants
const HYPERLIQUID_API_URL = 'https://api.hyperliquid.xyz/info';
const REQUEST_TIMEOUT = 10000; // 10 seconds

// Validation schema for clearinghouse state requests
interface ClearinghouseStateRequest {
  type: 'clearinghouseState';
  user: string;
}

function isValidClearinghouseStateRequest(body: unknown): body is ClearinghouseStateRequest {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as Record<string, unknown>).type === 'string' &&
    (body as Record<string, unknown>).type === 'clearinghouseState' &&
    typeof (body as Record<string, unknown>).user === 'string' &&
    ((body as Record<string, unknown>).user as string).length > 0
  );
}

export async function POST(req: Request): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    // Parse and validate request body
    let body: unknown;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        {
          error: 'Invalid JSON body',
          details: 'Request body must be valid JSON',
        },
        { status: 400 },
      );
    }

    // Validate request structure
    if (!isValidClearinghouseStateRequest(body)) {
      console.error('Invalid clearinghouse state request:', body);
      return NextResponse.json(
        {
          error: 'Invalid request format',
          details: 'Expected { type: "clearinghouseState", user: string }',
        },
        { status: 400 },
      );
    }

    console.log(`Fetching clearinghouse state for user: ${body.user}`);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const upstream = await fetch(HYPERLIQUID_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'IVX-Trading-App/1.0',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!upstream.ok) {
        const errorText = await upstream.text();
        let errorData: { error: string; details?: string } = { error: 'Upstream API error' };

        try {
          const parsedError = JSON.parse(errorText);
          errorData = { ...errorData, ...parsedError };
        } catch {
          errorData.details = errorText;
        }

        console.error(`Upstream API error (${upstream.status}):`, errorData);
        return NextResponse.json(errorData, { status: upstream.status });
      }

      const data = await upstream.json();
      const duration = Date.now() - startTime;

      console.log(`Successfully fetched clearinghouse state in ${duration}ms`);

      return NextResponse.json(data, {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Response-Time': `${duration}ms`,
        },
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('Request timeout after', REQUEST_TIMEOUT, 'ms');
        return NextResponse.json(
          { error: 'Request timeout', details: 'Upstream API did not respond in time' },
          { status: 504 },
        );
      }

      console.error('Fetch error:', fetchError);
      throw fetchError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`API route error after ${duration}ms:`, error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: 'Failed to process clearinghouse state request',
      },
      { status: 500 },
    );
  }
}
