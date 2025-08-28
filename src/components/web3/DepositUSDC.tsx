'use client';

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

import { DepositCard } from '@/components/web3/DepositCard';

// Chain IDs
const ETHEREUM = 1;
const ARBITRUM_ONE = 42161;
const ARBITRUM_SEPOLIA = 421614;

// USDC addresses per chain
const USDC_ADDRESSES: Partial<Record<number, Address>> = {
  [ETHEREUM]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Ethereum
  [ARBITRUM_ONE]: '0xAf88d065e77c8cC2239327C5EDb3A432268e5831', // Arbitrum One
  [ARBITRUM_SEPOLIA]: '0x1baAbB04529D43a73232B713C0FE471f7c7334d5', // Arbitrum Sepolia
};

// Mainnet and Testnet Contracts
const CONTRACTS: Record<number, { USDC: `0x${string}`; BRIDGE2: `0x${string}` }> = {
  [ARBITRUM_ONE]: {
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // native USDC
    BRIDGE2: '0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7',
  },
  [ARBITRUM_SEPOLIA]: {
    USDC: '0x1baAbB04529D43a73232B713C0FE471f7c7334d5', // USDC2 (test)
    BRIDGE2: '0x08cfc1B6b2dCF36A1480b99353A354AA8AC56f89',
  },
};

export function DepositUSDC({
  defaultNetwork = 'mainnet',
}: {
  defaultNetwork?: 'testnet' | 'mainnet';
}) {
  const [network, setNetwork] = useState<'testnet' | 'mainnet'>(defaultNetwork);
  const [depositError, setDepositError] = useState<string | null>(null);

  const chainId = network === 'mainnet' ? ARBITRUM_ONE : ARBITRUM_SEPOLIA;
  const token = USDC_ADDRESSES[chainId];

  // console.log('📃📃📃 Token address:', token);
  // console.log('📃📃📃 Chain ID:', chainId);

  // Account
  const { address, chainId: activeChainId } = useAccount();
  // Public client
  const publicClient = usePublicClient({ chainId: chainId });
  // Switch chain
  const { switchChainAsync } = useSwitchChain();
  // Write contract
  const { writeContractAsync, data: hash, isPending: writeIsPending } = useWriteContract();
  // Wait for transaction
  const { isLoading: waiting, isSuccess } = useWaitForTransactionReceipt({ hash });

  console.log('📃📃📃 useAccount address:', address);

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
  if (!token) return <div>USDC isn’t on this chain (in this mapping)</div>;
  if (readIsPending) return <div>Loading…</div>;
  if (readError) return <div>Failed to fetch balance</div>;

  // Set up balance data
  const [balRes, decRes] = readData ?? [];
  const raw = balRes?.result as bigint | undefined;
  const decimals = Number(decRes?.result ?? 6);
  const balance = raw ? Number(formatUnits(raw, decimals)) : 0;

  // console.log('📃📃📃 balRes and decRes:', balRes, decRes);

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

      // console.log('💰💰💰 Parsed amount:', value);

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

      // Preview gas usage and fee (in ETH)
      const estGas =
        sim.result === true
          ? sim.request.gas
          : await publicClient.estimateGas({ ...sim.request, to: USDC });
      console.log('💵💵💵 Estimated gas:', estGas);

      // Return early if gas estimation fails
      if (!estGas) {
        setDepositError('Unable to estimate gas. Please try again.');
        return;
      }

      // Estimate fees
      const fees = await publicClient.estimateFeesPerGas();
      const maxFeePerGas = fees.maxFeePerGas ?? fees.gasPrice!;

      // Total fee upper bound (ETH): estGas * maxFeePerGas
      const totalFeeWei = estGas * maxFeePerGas;
      const totalFeeEth = Number(formatUnits(totalFeeWei, 18));
      console.log(
        '💵💵💵 Estimated fee (ETH):',
        totalFeeEth,
        '\n💵💵💵 Estimated fee (Wei):',
        totalFeeWei,
      );

      // Transfer USDC to the Bridge2 contract
      const txHash = await writeContractAsync(sim.request);

      console.log('📈📈📈 Sent deposit tx:', txHash);
    } catch (err) {
      console.error(err);
      setDepositError('Deposit failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <DepositCard
        defaultNetwork={network}
        onNetworkChange={setNetwork}
        buttonText={writeIsPending || waiting ? 'Depositing…' : 'Deposit'}
        balance={balance}
        minDeposit={5}
        onConfirmDeposit={handleConfirmDeposit}
      />

      {isSuccess && (
        <p className="text-green-400 text-center">
          Deposit sent. Credit should appear in ~1 minute.
        </p>
      )}
      {depositError && <p className="text-red-400 text-center">{depositError}</p>}
    </div>
  );
}
