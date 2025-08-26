import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { createConfig, http } from 'wagmi';
import { mainnet, polygon, sepolia, optimism, arbitrum, base } from 'wagmi/chains';

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

export const rainbowConfig = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_PROJECT_NAME || '',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
});
