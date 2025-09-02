This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

**NOTE:** This app tests logic on the frontend and is not meant for production as of yet. It does not follow best practices in terms of _scalable_ and _secure_ application design.

## Getting Started

### Setting Up Evironment variables

Create a `env.local` file in the root directory and insert the below values.

```
# Reown Project
NEXT_PUBLIC_PROJECT_NAME="IVX Project"
NEXT_PUBLIC_PROJECT_ID="5cf5f206af8daa7230588061c469b4e9"

# Alchemy API Key
ALCHEMY_KEY=""

# Main Chain Addresses
NEXT_PUBLIC_ARBITRUM_ONE_ADDRESS="0xaf88d065e77c8cC2239327C5EDb3A432268e5831"

# Testnet Addresses
NEXT_PUBLIC_ARBITRUM_TESTNET_ADDRESS="0x1234567890abcdef1234567890abcdef12345678"

# Agent Address and Private Key
NEXT_PUBLIC_HL_AGENT_PRIVATE_KEY=""
NEXT_PUBLIC_AGENT_ADDRESS=""
```

**NOTE:** Private keys must never be stored in public environment variables! This project is to test logic and is not meant for production. Users' delegated agent wallets will be stored securely in a backend server with PK encrypted in a KMS.

### Running Agent Generation Scripts

Run `src\scripts\generateAgent.js` in the terminal to generate a wallet address and PK pair. Copy the generated address and PK and place in `env.local`.

### Running the App in dev

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
