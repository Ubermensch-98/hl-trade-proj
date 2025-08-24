'use client';

import { CandlesChart } from "@/components/charts/candlesChart";

export default function Home() {
  return (
    <>
      <title>IVX Trade</title>
      <div
        className="absolute top-0 left-0 w-[60vw] h-fit min-w-[250px] min-h-[150px]
        bg-[#0b021d] shadow-lg p-2 z-10 flex flex-col justify-start"
      >
        <div className="flex-grow">
          <CandlesChart
            coin="BTC"
            interval="15m"
            startTime={Date.now() - 7 * 24 * 60 * 60 * 1000} // 7 days ago
            endTime={Date.now()}
          />
        </div>
      </div>
    </>
  );
}
