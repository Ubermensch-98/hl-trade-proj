import { useAccount } from 'wagmi';
import { usePerpSummary } from '@/hooks/usePerpSummary';
import { Badge } from '@/components/ui/badge';

export function HyperliquidFunds(Props: { dex?: string }) {
  const { address, isConnected } = useAccount();

  // console.log("💎💎💎 DEX in HLFunds:", Props.dex);
  // console.log("🚩🚩🚩 Address in HLFunds:", String(address));

  const { data } = usePerpSummary({ type: 'clearinghouseState', user: String(address), dex: Props.dex });

  // console.log("💿💿💿 Data:", JSON.stringify(data));

  return (
    
    <div className="flex flex-col items-center gap-1">
      <p className="font-bold text-[#96fce4]">HL Balance</p>
        <Badge className='px-2 py-1 w-full bg-[#f9c3ff] text-[#0b021d]'>
          {isConnected ? (
            <>
              <p className='text-[0.9rem] font-semibold text-[#0b021d]'>{data?.withdrawable || 'SRVR ERROR'}</p>
            </>
          ) : (
            <p>Not connected</p>
          )}
        </Badge>
    </div>
  );
}
