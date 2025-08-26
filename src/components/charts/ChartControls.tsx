'use client';

import Image from 'next/image';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Check, ChevronsUpDown } from 'lucide-react';
import { TokenBTC, TokenETH } from '@web3icons/react';

export type Interval = '1m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '8h' | '12h' | '1d';
export type StartTime = '1h' | '8h' | '12h' | '1d' | '1w' | '1m';
export type AssetSymbol = 'ETH' | 'BTC' | 'HYPE';

const INTERVALS: Interval[] = ['1m', '5m', '15m', '30m', '1h', '2h', '4h', '8h', '12h', '1d'];
const START_TIMES: StartTime[] = ['1h', '8h', '12h', '1d', '1w', '1m'];

interface CandlestickChartToolbarProps {
  interval?: Interval;
  startTime?: StartTime;
  asset?: AssetSymbol;
  onIntervalChange?: (value: Interval) => void;
  onStartTimeChange?: (value: StartTime) => void;
  onAssetChange?: (value: AssetSymbol) => void;
  className?: string;
}

export function CandlestickChartToolbar({
  interval: intervalProp,
  startTime: startTimeProp,
  onIntervalChange,
  onStartTimeChange,
  onAssetChange,
  className = '',
}: CandlestickChartToolbarProps) {
  const [asset, setAsset] = React.useState<string | undefined>(undefined);
  const [interval, setInterval] = React.useState<Interval>(intervalProp ?? '1h');
  const [startTime, setStartTime] = React.useState<StartTime>(startTimeProp ?? '1d');
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (intervalProp) setInterval(intervalProp);
  }, [intervalProp]);

  React.useEffect(() => {
    if (startTimeProp) setStartTime(startTimeProp);
  }, [startTimeProp]);

  const handleIntervalChange = (value: Interval) => {
    if (!intervalProp) setInterval(value);
    onIntervalChange?.(value);
    setOpen(false);
  };

  const handleStartTimeChange = (value: string) => {
    if (!value) return; // prevent deselect for single-type group
    if (!startTimeProp) setStartTime(value as StartTime);
    onStartTimeChange?.(value as StartTime);
  };

  const handleAssetChange = (value: string) => {
    if (!value) return; // prevent deselect for single-type group
    onAssetChange?.(value as AssetSymbol);
    setAsset(value as AssetSymbol);
  };

  return (
    <div
      className={`w-full flex flex-wrap items-center gap-6 rounded-br-lg 
        border border-l-0 border-[#F9C3FE] bg-[#0f0f0f] p-2 md:p-3 ${className}`}
    >
      {/* Interval combobox */}
      <div className="flex items-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            asChild
            className="bg-[#0b021d] text-[#F9C3FE] 
          border border-[#F9C3FE] hover:bg-[#F9C3FE] hover:text-[#140929] cursor-pointer"
          >
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[130px] justify-between"
            >
              {interval}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-0 border-0" align="start">
            <Command className="bg-[#EF5EFD]">
              <CommandInput
                placeholder="Search interval..."
                className="text-[#0b021d] placeholder:text-[#0b021d] border-0"
              />
              <CommandList className="bg-[#EF5EFD] border-0">
                <CommandEmpty>No interval found.</CommandEmpty>
                <CommandGroup>
                  {INTERVALS.map((item) => (
                    <CommandItem
                      key={item}
                      value={item}
                      onSelect={(val) => handleIntervalChange(val as Interval)}
                      className="font-semibold text-[#0b021d] 
                      data-[selected=true]:bg-[#F9C3FE] data-[selected=true]:text-[#140929]"
                    >
                      <Check
                        className={`mr-2 h-6 w-6 ${interval === item ? 'opacity-100' : 'opacity-0'}`}
                      />
                      {item}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Start time toggle group (single-select) */}
      <div className="flex items-center">
        <ToggleGroup
          type="single"
          value={startTime}
          onValueChange={handleStartTimeChange}
          variant="outline"
          className="flex border border-[#F9C3FE] cursor-pointer"
        >
          {START_TIMES.map((t) => (
            <ToggleGroupItem
              key={t}
              value={t}
              aria-label={`Set start time to ${t}`}
              className="px-3 text-[#F9C3FE] bg-[#0b021d]
              hover:bg-[#F9C3FE] hover:text-[#140929]
              data-[state=on]:bg-[#F9C3FE] data-[state=on]:text-[#140929]
              cursor-pointer"
            >
              {t}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Asset toggle group on the right */}
      <div className="flex items-center gap-2 ml-auto">
        <ToggleGroup
          type="single"
          defaultValue="ETH"
          value={asset}
          onValueChange={handleAssetChange}
          variant="outline"
          className="flex border border-[#F9C3FE] cursor-pointer"
        >
          <ToggleGroupItem
            value="ETH"
            aria-label="Select ETH"
            className="px-3 text-[#F9C3FE] bg-[#0b021d]
              hover:bg-[#F9C3FE] hover:text-[#140929]
              data-[state=on]:bg-[#F9C3FE] data-[state=on]:text-[#140929]
              cursor-pointer"
          >
            <TokenETH className="mr-1 h-6 w-6" />
            ETH
          </ToggleGroupItem>

          <ToggleGroupItem
            value="BTC"
            aria-label="Select BTC (Bitcoin)"
            className="px-3 text-[#F9C3FE] bg-[#0b021d]
              hover:bg-[#F9C3FE] hover:text-[#140929]
              data-[state=on]:bg-[#F9C3FE] data-[state=on]:text-[#140929]
              cursor-pointer"
          >
            <TokenBTC className="mr-1 h-6 w-6" />
            BTC
          </ToggleGroupItem>

          <ToggleGroupItem
            value="HYPE"
            aria-label="Select HYPE"
            className="px-3 text-[#F9C3FE] bg-[#0b021d]
              hover:bg-[#F9C3FE] hover:text-[#140929]
              data-[state=on]:bg-[#F9C3FE] data-[state=on]:text-[#140929]
              cursor-pointer"
          >
            <Image
              src="/HL_symbol_dark green.svg"
              alt="Hype"
              width={12}
              height={12}
              className="mr-1 h-4 w-4"
            />
            HYPE
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
