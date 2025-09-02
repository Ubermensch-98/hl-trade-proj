'use client';

// debugger;
import { useState } from 'react';
import {
  useAccount,
  useSwitchChain,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContracts,
  usePublicClient,
} from 'wagmi';
import { getAddress, erc20Abi, formatUnits, type Address } from 'viem';
import { parseUnits } from 'viem';
// Components
import { DepositCard } from '@/components/web3/DepositCard';
import { DepositCardSkeleton } from '@/components/skeletons/DepositCardSkeleton';
import { DepositCardMissing } from '@/components/skeletons/DepositCardMissing';

// Chain IDs
const ETHEREUM = 1;
const ARBITRUM_ONE = 42161;
const ARBITRUM_SEPOLIA = 421614;

// USDC addresses per chain
const USDC_ADDRESSES: Partial<Record<number, Address>> = {
  [ETHEREUM]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Ethereum
  [ARBITRUM_ONE]: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // Arbitrum One
  [ARBITRUM_SEPOLIA]: '0x1baAbB04529D43a73232B713C0FE471f7c7334d5', // Arbitrum Sepolia
} as const;

// Mainnet and Testnet Contracts
const CONTRACTS: Record<number, { USDC: `0x${string}`; BRIDGE2: `0x${string}` }> = {
  [ARBITRUM_ONE]: {
    USDC: USDC_ADDRESSES[ARBITRUM_ONE]!, // native USDC
    BRIDGE2: '0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7',
  },
  [ARBITRUM_SEPOLIA]: {
    USDC: USDC_ADDRESSES[ARBITRUM_SEPOLIA]!, // USDC2 (test)
    BRIDGE2: '0x08cfc1B6b2dCF36A1480b99353A354AA8AC56f89',
  },
} as const;

export function DepositUSDC({
  defaultNetwork = 'mainnet',
}: {
  defaultNetwork?: 'testnet' | 'mainnet';
}) {
  const [network, setNetwork] = useState<'testnet' | 'mainnet'>(defaultNetwork);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [depositError, setDepositError] = useState<string | null>(null);

  const chainId = network === 'mainnet' ? ARBITRUM_ONE : ARBITRUM_SEPOLIA;
  const token = USDC_ADDRESSES[chainId];

  // console.log('📃📃📃 Token address:', token);
  // console.log('📃📃📃 Chain ID:', chainId);

  // Account
  const { address, isConnected: isWalletConnected, chainId: activeChainId } = useAccount();
  // Public client
  const publicClient = usePublicClient({ chainId: chainId });
  // Switch chain
  const { switchChainAsync } = useSwitchChain();
  // Write contract
  const { writeContractAsync, isPending: writeIsPending } = useWriteContract();
  // Wait for transaction
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } =
    useWaitForTransactionReceipt({ hash: txHash });

  // console.log('📃📃📃 useAccount address:', address);

  // Make sure addresses are parsed
  const tokenAddr: Address | undefined = token ? getAddress(token) : undefined;
  const userAddr: Address | undefined = address ? getAddress(address) : undefined;

  /*
  Read balance logic
  */
  const {
    data: readData,
    isLoading: readIsPending,
    isError: readError,
  } = useReadContracts({
    contracts:
      tokenAddr && userAddr
        ? ([
            { address: tokenAddr, abi: erc20Abi, functionName: 'balanceOf', args: [userAddr] },
            { address: tokenAddr, abi: erc20Abi, functionName: 'decimals' },
          ] as const)
        : undefined,
    // TanStack Query options
    query: {
      enabled: Boolean(tokenAddr && userAddr),
      refetchOnWindowFocus: false,
      staleTime: 5_000,
    },
  });

  // console.log('📃📃📃 Read contracts data:', readData);

  // Return early if there's an issue
  if (!token) return <div>USDC isn&apos;t on this chain (in this mapping)</div>;
  if (readIsPending) return <DepositCardSkeleton />;
  if (readError) return <DepositCardMissing cardText="Failed to fetch balance" />;

  // Set up balance data
  const [balRes, decRes] = readData ?? [];
  const raw = balRes?.result as bigint | undefined;
  const decimals = Number(decRes?.result ?? 6);
  const balance = raw ? Number(formatUnits(raw, decimals)) : 0;

  // Logs for debugging
  // console.log(
  //   '📃📃📃 balRes and decRes:',
  //   `💳💳💳 balRes: ${balRes?.result}\n🧮🧮🧮 decRes: ${decRes?.result}`,
  // );
  // console.log('🥩⚖🥩⚖🥩⚖ User raw balance:', raw);
  // console.log('⚖⚖⚖ User balance:', balance);

  /*
  Deposit logic
  */
  const handleConfirmDeposit = async ({
    amount,
    network: selectedNetwork = 'mainnet',
  }: {
    amount: number;
    network: 'testnet' | 'mainnet';
  }) => {
    setDepositError(null);
    try {
      if (!address) {
        setDepositError('Connect your wallet first.');
        return;
      }

      const targetChainId = selectedNetwork === 'mainnet' ? ARBITRUM_ONE : ARBITRUM_SEPOLIA;
      const value = parseUnits(amount.toString(), decimals);

      if (activeChainId !== targetChainId) {
        await switchChainAsync({ chainId: targetChainId });
      }

      // Map contract addresses
      const { USDC: USDC, BRIDGE2: BRIDGE2 } = CONTRACTS[targetChainId];

      // Check if publicClient is available
      if (!publicClient) {
        setDepositError('Network client not available. Please try again.');
        return;
      }

      // Simulate the call to get a request with correct gas params
      const sim = await publicClient.simulateContract({
        address: USDC,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [BRIDGE2, value],
        account: address as Address,
      });

      // Log for debugging
      // console.log('✨✨✨ sim.result:', sim);

      // Estimate gas
      const estimatedGas = await publicClient.estimateContractGas({
        address: USDC, // <- USDC token contract
        abi: erc20Abi,
        functionName: 'transfer',
        args: [BRIDGE2, value],
        account: address as Address,
      });

      let maxFeePerGas: bigint;
      try {
        const fees = await publicClient.estimateFeesPerGas();
        maxFeePerGas = fees.maxFeePerGas ?? fees.gasPrice!;
      } catch {
        maxFeePerGas = await publicClient.getGasPrice();
      }
      const totalFeeWei = estimatedGas * maxFeePerGas;
      const totalFeeEth = Number(formatUnits(totalFeeWei, 18));
      console.log(
        '💵💵💵 Estimated fee (ETH):',
        totalFeeEth,
        '\n💵💵💵 Estimated fee (Wei):',
        totalFeeWei,
      );

      // Transfer USDC to the Bridge2 contract
      const txHash = await writeContractAsync(sim.request);
      setTxHash(txHash);
      console.log('📈📈📈 Sent deposit tx:', txHash);
    } catch (err) {
      console.error(err);
      setDepositError('Deposit failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {isWalletConnected ? (
        <DepositCard
          defaultNetwork={network}
          onNetworkChange={setNetwork}
          onConfirmDeposit={handleConfirmDeposit}
          buttonText={writeIsPending || isTransactionLoading ? 'Depositing…' : 'Deposit'}
          balance={balance}
          minDeposit={5}
        />
      ) : (
        <DepositCardMissing />
      )}

      {/* Success message */}
      {isTransactionSuccess && (
        <p className="text-green-400 text-center font-bold">
          Deposit sent. Credit should appear in ~1 minute.
        </p>
      )}
      {/* Transaction link */}
      {txHash && (
        <a
          href={`https://arbiscan.io/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 underline"
        >
          View on Arbiscan
        </a>
      )}
      {/* Error message */}
      {depositError && <p className="text-red-400 text-center font-bold">{depositError}</p>}
    </div>
  );
}
