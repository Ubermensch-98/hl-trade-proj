'use client';

import * as hl from '@nktkas/hyperliquid';
import { makeInfoClient, makeL1Client } from '@/lib/hyperliquid';

/**
 * Hook to place orders on Hyperliquid using the @nktkas/hyperliquid SDK.
 * - Creates InfoClient and ExchangeClient (client-side, after wallet is ready)
 * - Supports limit (Gtc/Alo/Ioc) and "market-like" (IOC) orders
 * - Optionally sets leverage before placing an order
 *
 * NOTE: HL expects price/size as strings. You should pre-round to tick/lot rules in the UI.
 */
export function usePlaceOrder() {
  // Public data client
  const info = makeInfoClient();

  // Trading client (requires wallet)
  const exchange = makeL1Client();

  /*
   * Utility functions
   */
  // Utility to ensure exchange client is available
  function ensureExchange(): hl.ExchangeClient {
    if (!exchange) throw new Error('Connect your wallet first.');
    return exchange;
  }

  // Utility to convert number|string to string
  const toStr = (x: string | number) => (typeof x === 'number' ? String(x) : x);

  // Utility to set leverage for a specific asset
  async function maybeSetLeverage(asset: number, leverage?: number, isCross?: boolean) {
    if (leverage == null) return;
    // Sets/updates leverage for the given asset before placing the order
    await ensureExchange().updateLeverage({
      asset,
      leverage: leverage ?? 1,
      isCross: isCross ?? false,
    });
  }
  /********************************************************************/

  /**
   * Place a LIMIT order (chosen TIF).
   * Pass tif="Ioc" for an immediate-or-cancel (market-like) behavior.
   */
  async function placeLimit(args: {
    asset: number; // asset id (perp index id)
    side: 'buy' | 'sell'; // long/buy or short/sell
    size: string | number; // size as string
    price: string | number; // price as string
    tif?: 'Gtc' | 'Alo' | 'Ioc'; // default "Gtc"
    reduceOnly?: boolean;
    leverage?: number; // optional: set before placing
    vaultAddress?: `0x${string}`; // optional vault (if you use one)
    grouping?: 'na' | 'normalTpsl' | 'positionTpsl';
  }) {
    const {
      asset,
      side,
      size,
      price,
      tif = 'Gtc',
      reduceOnly = false,
      leverage,
      vaultAddress,
      grouping = 'na',
    } = args;

    await maybeSetLeverage(asset, leverage);

    const order = {
      a: asset,
      b: side === 'buy',
      p: toStr(price),
      s: toStr(size),
      r: reduceOnly,
      t: { limit: { tif } },
    } as const; // order shape per README example

    // POST /exchange via SDK
    return ensureExchange().order({ orders: [order], grouping, vaultAddress }); // :contentReference[oaicite:4]{index=4}
  }

  /**
   * Place a "market-like" order using IOC.
   * If you don't supply a price, we use a very aggressive cap so it fills at top of book.
   * For buys we cap very high; for sells we cap very low. You can pass your own cap if you prefer.
   */
  async function placeMarket(args: {
    asset: number;
    side: 'buy' | 'sell';
    size: string | number;
    capPrice?: string | number;
    reduceOnly?: boolean;
    leverage?: number;
    vaultAddress?: `0x${string}`;
    grouping?: 'na' | 'normalTpsl' | 'positionTpsl';
  }) {
    const {
      asset,
      side,
      size,
      capPrice,
      reduceOnly = false,
      leverage,
      vaultAddress,
      grouping = 'na',
    } = args;

    await maybeSetLeverage(asset, leverage);

    // Very aggressive price caps for IOC
    const price =
      capPrice != null
        ? toStr(capPrice)
        : side === 'buy'
          ? '999999999999' // very high cap for buy
          : '0'; // very low cap for sell

    const order = {
      a: asset,
      b: side === 'buy',
      p: price,
      s: toStr(size),
      r: reduceOnly,
      t: { limit: { tif: 'Ioc' as const } },
    };

    return ensureExchange().order({ orders: [order], grouping, vaultAddress });
  }

  return {
    info, // InfoClient for metadata, books, etc.
    exchange, // ExchangeClient if you need lower-level access (e.g., cancel/modify)
    placeLimit,
    placeMarket,
  };
}
