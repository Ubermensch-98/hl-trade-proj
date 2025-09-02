'use client';

import { useState, useEffect } from 'react';

import { makeInfoClient, makeUserClient } from '@/lib/hyperliquid';
import { useAccount, useWalletClient } from 'wagmi';
import { ButtonPro } from '@/components/reusable/ButtonPro';
import { customToast } from '@/components/reusable/CustomToast';
import { Badge } from '@/components/ui/badge';

export function ApproveAgentButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingApproval, setIsCheckingApproval] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const agentAddress = process.env.NEXT_PUBLIC_AGENT_ADDRESS as `0x${string}`;

  // Check if agent is approved
  useEffect(() => {
    const checkAgentApproval = async () => {
      if (!address || !agentAddress) return;

      setIsCheckingApproval(true);
      try {
        const info = makeInfoClient();
        const agents = await info.extraAgents({ user: address });
        const approved = agents.some((a) => a.address.toLowerCase() === agentAddress.toLowerCase());
        setIsApproved(approved);
      } catch (error) {
        console.error('Error checking agent approval:', error);
      } finally {
        setIsCheckingApproval(false);
      }
    };

    checkAgentApproval();
  }, [address, agentAddress]);

  // Approve the agent
  const onApprove = async () => {
    setIsLoading(true);
    if (!walletClient || !isConnected) {
      setIsLoading(false);
      customToast(
        {
          title: 'Wallet not connected',
          description: 'Please connect your wallet to continue.',
        },
        'warning',
      );
      return;
    }

    console.log('🚩🚩🚩 Agent address:', agentAddress);

    // Return early if agent address is missing
    if (!agentAddress) {
      setIsLoading(false);
      customToast(
        {
          title: 'Missing agent address',
          description: 'Please check your configuration.',
        },
        'error',
      );
      return;
    }

    // Using the user's wallet inside the ExchangeClient
    const exch = makeUserClient(walletClient, true); // true = testnet

    // L1-signed action (EIP-712)
    try {
      const res = await exch.approveAgent({
        agentAddress,
        agentName: 'IVX HL Agent',
      });
      if (res.status === 'ok') {
        setIsApproved(true); // Update approval state
        customToast(
          {
            title: 'Agent approved!',
            description: 'The agent has been successfully approved.',
          },
          'success',
        );
      } else {
        console.error('Approval failed:', res);
        customToast(
          {
            title: 'Approval failed',
            description: 'There was an error approving the agent.',
          },
          'error',
        );
      }
    } catch (error) {
      console.error('Approval error:', error);
      customToast(
        {
          title: 'Approval failed',
          description: 'There was an error approving the agent.',
        },
        'error',
      );
    }

    setIsLoading(false);
  };
  return (
    <>
      {isConnected && (
        <>
          {isApproved ? (
            <Badge variant="default" className="bg-green-500 text-white font-bold">
              Agent approved
            </Badge>
          ) : (
            <ButtonPro
              onClick={onApprove}
              isLoading={isLoading || isCheckingApproval}
              baseColor="green"
              className="text-[#feffff] font-bold"
              disabled={isCheckingApproval}
            >
              {isCheckingApproval ? 'Checking...' : 'Approve Agent'}
            </ButtonPro>
          )}
        </>
      )}
    </>
  );
}
