import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, arbitrum } from 'wagmi/chains';

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
});

export const rainbowConfig = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_PROJECT_NAME || '',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '', // WalletConnect Cloud projectId
  chains: [
    arbitrum,
    sepolia,
    // mainnet,
    // polygon,
    // optimism,
    // base
  ],
  transports: {
    [arbitrum.id]: http(),
    [sepolia.id]: http(),
    // [mainnet.id]: http(),
    // [polygon.id]: http(),
    // [optimism.id]: http(),
    // [base.id]: http(),
  },
  ssr: true,
});

// TODO: Figure out how to move forward with transports
// export const rainbowConfig = getDefaultConfig({
//   appName: process.env.NEXT_PUBLIC_PROJECT_NAME || '',
//   projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '', // WalletConnect Cloud projectId
//   chains: [mainnet, sepolia, polygon, optimism, arbitrum, base],
//   transports: {
//     // Alchemy
//     [arbitrum.id]: http(`https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`),
//     [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`),
//     // [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`),
//     // [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`),
//     // [optimism.id]: http(`https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`),
//     // [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`),
//   },
//   ssr: true,
// });
