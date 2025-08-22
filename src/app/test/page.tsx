"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="relative p-6 min-h-[200px]">
      <div className="absolute top-0 right-0 mt-4 mr-2 z-10">
        {!isConnected ? (
          <button
            onClick={() => connect({ connector: connectors[0] })}
            disabled={isPending}
            className="px-4 py-2 rounded border border-blue-300 bg-blue-100 text-blue-900 font-semibold shadow transition-all duration-150
              hover:bg-blue-200 hover:scale-105 hover:shadow-lg
              active:bg-blue-300 active:scale-95
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Connect <span className="font-bold tracking-wide">MetaMask</span>
          </button>
        ) : (
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 rounded border border-red-300 bg-red-100 text-red-900 font-semibold shadow transition-all duration-150
              hover:bg-red-200 hover:scale-105 hover:shadow-lg
              active:bg-red-300 active:scale-95"
          >
            <span className="font-bold uppercase tracking-wide">Disconnect</span>
          </button>
        )}
      </div>
      {/* Main content below the button */}
      <div className="pt-20">
        {isConnected && <div>Connected: {address}</div>}
      </div>
    </div>
  );
}