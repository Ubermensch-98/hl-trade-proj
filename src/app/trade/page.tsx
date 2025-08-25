'use client';

import { useState } from 'react';
import { CandlesChart } from '@/components/charts/CandlesChart';
import { AssetSymbol, CandlestickChartToolbar, Interval, StartTime } from '@/components/charts/ChartControls';
import ChartTopControls from '@/components/charts/ChartTopControls';

// Convert StartTime to milliseconds
function startTimeToMs(startTime: StartTime): number {
  const now = Date.now();
  switch (startTime) {
    case '1h':
      return now - 1 * 60 * 60 * 1000;
    case '8h':
      return now - 8 * 60 * 60 * 1000;
    case '12h':
      return now - 12 * 60 * 60 * 1000;
    case '1d':
      return now - 1 * 24 * 60 * 60 * 1000;
    case '1w':
      return now - 7 * 24 * 60 * 60 * 1000;
    case '1m':
      return now - 30 * 24 * 60 * 60 * 1000;
    default:
      return now - 1 * 24 * 60 * 60 * 1000; // Default to 1 day
  }
}

export default function Home() {
  const [interval, setInterval] = useState<Interval>('15m');
  const [startTime, setStartTime] = useState<StartTime>('1w');
  const [asset, setAsset] = useState<AssetSymbol>('BTC');

  const handleIntervalChange = (newInterval: Interval) => {
    setInterval(newInterval);
  };

  const handleStartTimeChange = (newStartTime: StartTime) => {
    setStartTime(newStartTime);
  };

  return (
    <>
      <title>IVX Trade</title>
      <div
        className="absolute top-0 left-0 w-[60vw] h-fit min-w-[250px] min-h-[150px]
        bg-[#0b021d] shadow-lg p-0 z-10 flex flex-col justify-start"
      >
        <div className="flex-grow">
          <ChartTopControls />
          <CandlesChart
            coin={asset}
            interval={interval}
            startTime={startTimeToMs(startTime)}
            endTime={Date.now()}
          />
          <CandlestickChartToolbar
            interval={interval}
            startTime={startTime}
            asset={asset}
            onIntervalChange={handleIntervalChange}
            onStartTimeChange={handleStartTimeChange}
            onAssetChange={setAsset}
          />
        </div>
      </div>
    </>
  );
}
