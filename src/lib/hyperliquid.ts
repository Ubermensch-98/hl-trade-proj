// import "server-only"
import * as hl from '@nktkas/hyperliquid';
import { WalletClient, Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Stateless transport
export const http = new hl.HttpTransport();

// TODO: Redis caching when scaling
// Global, externalized nonce source
async function nextNonce() {
  return Date.now(); // placeholder
}

const rawEnv = (process.env.NEXT_PUBLIC_HL_AGENT_PRIVATE_KEY ?? '').trim();

// Optional: strip accidental wrapping quotes
const unquoted = rawEnv.replace(/^['"]|['"]$/g, '');

// Add 0x if missing
const normalized = unquoted.startsWith('0x') ? unquoted : `0x${unquoted}`;

// Validate length & charset
if (!/^0x[0-9a-fA-F]{64}$/.test(normalized)) {
  console.error('Invalid HL_AGENT_PRIVATE_KEY:', { normalized });
  throw new Error('HL_AGENT_PRIVATE_KEY must be a 32-byte hex string (0x + 64 hex chars).');
}

const hlAgentAccount = privateKeyToAccount(normalized as Hex);

// Info client factory
export function makeInfoClient() {
  return new hl.InfoClient({
    transport: http,
  });
}

// L1 (server) client factory
export function makeL1Client() {
  return new hl.ExchangeClient({
    wallet: hlAgentAccount, // server-only
    transport: http,
    signatureChainId: '0x539', // 1337 for L1 signatures
    nonceManager: nextNonce,
  });
}

// User-signed (client) factory
export function makeUserClient(walletClient: WalletClient, isTestnet: boolean = false) {
  return new hl.ExchangeClient({
    wallet: walletClient, // user's wallet
    transport: http,
    isTestnet: isTestnet,
  });
}
