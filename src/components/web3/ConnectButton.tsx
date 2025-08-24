"use client";

import { wagmiConfig as config } from "@/config/wagmiConfig";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { toast } from "sonner";

export default function ConnectButton() {
  const { address, isConnected } = useAccount({ config });
  const { connect, connectors, isPending } = useConnect({
    config,
    mutation: {
      onSuccess: (data) => {
        toast.success("Wallet connected!", {
          description: data?.accounts[0] ? `Address: ${data.accounts[0]}` : undefined,
          className: "bg-blue-100 text-blue-900 border border-blue-300",
        });
      },
      onError: (error: Error) => {
        toast.error("Connection failed!", {
          description: error?.message,
          className: "bg-red-100 text-red-900 border border-red-300",
        });
      },
    },
  });
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm font-mono hidden sm:block">{`${address?.slice(0, 6)}...${address?.slice(-4)}`}</p>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 rounded-md border border-[#f284fd] bg-[#f284fd] text-white 
            font-semibold shadow transition-all duration-150
            hover:bg-[#e06be9] hover:scale-102 hover:shadow-lg
            active:bg-[#c85ad1] active:scale-98"
        >
          <span className="font-bold uppercase tracking-wide">Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      disabled={isPending}
      className="px-4 py-2 rounded-md border border-[#f284fd] bg-[#f284fd] text-white font-semibold shadow transition-all duration-150
        hover:bg-[#e06be9] hover:scale-102 hover:shadow-lg
        active:bg-[#c85ad1] active:scale-98
        disabled:opacity-60 disabled:cursor-not-allowed"
    >
      Connect <span className="font-bold tracking-wide">MetaMask</span>
    </button>
  );
}
