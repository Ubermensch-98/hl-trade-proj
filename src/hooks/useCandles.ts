import { useQuery } from '@tanstack/react-query';

export type CandleParams = {
  coin: string; // e.g., "BTC"
  interval: string; // e.g., "15m"
  startTime: number; // epoch ms
  endTime: number; // epoch ms
};

export type CandleResp = {
  T: number; // end ms
  t: number; // start ms
  o: string; // open
  h: string; // high
  l: string; // low
  c: string; // close
  v: string; // volume
  n: number; // number of trades
  i: string; // interval
  s: string; // symbol
};

async function fetchCandles(params: CandleParams, signal?: AbortSignal): Promise<CandleResp[]> {
  const res = await fetch('https://api.hyperliquid.xyz/info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'candleSnapshot', req: params }),
    signal,
  });
  if (!res.ok) throw new Error(`Hyperliquid error: ${res.status}`);
  return res.json();
}

export function useCandles(params: CandleParams) {
  return useQuery({
    queryKey: ['hyperliquid:candles', params],
    queryFn: ({ signal }) => fetchCandles(params, signal),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    enabled: !!params.coin && !!params.interval && params.startTime < params.endTime,
  });
}
