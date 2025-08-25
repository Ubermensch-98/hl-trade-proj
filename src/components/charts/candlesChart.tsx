/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  createChart,
  ISeriesApi,
  UTCTimestamp,
  CandlestickData,
  CrosshairMode,
  CandlestickSeries,
} from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import { CandleParams, useCandles } from '@/hooks/useCandles';

function toCandlestickSeries(raw: any[]): CandlestickData[] {
  // Ensure ascending by time; convert ms → seconds
  const sorted = [...raw].sort((a, b) => a.t - b.t);
  return sorted.map((d) => ({
    time: Math.floor(d.t / 1000) as UTCTimestamp,
    open: parseFloat(d.o),
    high: parseFloat(d.h),
    low: parseFloat(d.l),
    close: parseFloat(d.c),
  }));
}

export function CandlesChart(props: CandleParams) {
  const containerRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);

  const { data, isLoading, error } = useCandles(props);

  // Create chart once
  useEffect(() => {
    if (!containerRef.current || chartRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      layout: {
        background: { color: '#151C28' },
        textColor: 'rgba(255, 255, 255, 0.9)',
      },
      grid: {
        vertLines: {
          color: '#334158',
        },
        horzLines: {
          color: '#334158',
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      timeScale: {
        borderColor: '#485c7b',
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#4bffb5',
      downColor: '#ff4976',
      borderDownColor: '#ff4976',
      borderUpColor: '#4bffb5',
      wickDownColor: '#838ca1',
      wickUpColor: '#838ca1',
      priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
    });

    chartRef.current = chart;
    seriesRef.current = candleSeries;

    // Resize handling
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        chart.applyOptions({ width, height: Math.max(300, height) });
      }
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current || !data) return;
    const candles = toCandlestickSeries(data);
    seriesRef.current.setData(candles);
    chartRef.current?.timeScale().fitContent();
  }, [data]);

  if (error) return <div>Failed to load candles.</div>;
  return (
    <div className="flex flex-col w-full h-[420px] border border-l-0 border-t-0 border-[#F9C3FE] relative">
      {isLoading && <div className="absolute inset-0 grid place-items-center">Loading…</div>}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
