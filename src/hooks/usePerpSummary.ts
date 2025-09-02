import { useQuery } from '@tanstack/react-query';

type NumericString = `${number}`;

export type PerpSummaryParams = {
  type: 'clearinghouseState';
  user: string; // User's account address (e.g., "0xabc..." )
  dex?: string; // Decentralized exchange identifier
  enabled?: boolean; // Optional parameter to enable/disable the query
};

export type PerpSummaryResponse = {
  assetPositions: Array<{
    position: {
      coin: string;
      cumFunding: {
        allTime: NumericString;
        sinceChange: NumericString;
        sinceOpen: NumericString;
      };
      entryPx: NumericString;
      leverage: {
        rawUsd: NumericString;
        type: 'isolated' | 'cross' | (string & {});
        value: number;
      };
      liquidationPx: NumericString;
      marginUsed: NumericString;
      maxLeverage: number;
      positionValue: NumericString;
      returnOnEquity: NumericString;
      szi: NumericString;
      unrealizedPnl: NumericString;
    };
    type: 'oneWay' | 'hedged' | (string & {});
  }>;
  crossMaintenanceMarginUsed: NumericString;
  crossMarginSummary: {
    accountValue: NumericString;
    totalMarginUsed: NumericString;
    totalNtlPos: NumericString;
    totalRawUsd: NumericString;
  };
  marginSummary: {
    accountValue: NumericString;
    totalMarginUsed: NumericString;
    totalNtlPos: NumericString;
    totalRawUsd: NumericString;
  };
  time: number; // epoch millis
  withdrawable: NumericString;
};

async function fetchPerpSummary(
  params: Omit<PerpSummaryParams, 'enabled'>,
  signal?: AbortSignal,
): Promise<PerpSummaryResponse> {
  console.log('🎞🎞🎞 fetchPerpSummary params:', params);
  const res = await fetch('/api/hyperliquid/info/clearinghouseState', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...params }),
    signal,
  });
  console.log('🎞🎞🎞 fetchPerpSummary res:', res);

  if (!res.ok) throw new Error(`Hyperliquid error: ${res.status}`);

  return res.json();
}

export function usePerpSummary(params: PerpSummaryParams) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: ['hyperliquid:perpSummary', queryParams],
    queryFn: ({ signal }) => fetchPerpSummary(queryParams, signal),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    enabled,
  });
}
