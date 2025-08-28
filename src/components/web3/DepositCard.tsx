'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { BadgeCheckIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export interface DepositCardProps {
  defaultNetwork?: 'testnet' | 'mainnet';
  onNetworkChange?: (value: 'testnet' | 'mainnet') => void;
  buttonText?: string;
  balance?: number; // used as "max"
  minDeposit?: number; // used as "min"
  onConfirmDeposit?: (payload: { amount: number; network: 'testnet' | 'mainnet' }) => void;
}

export function DepositCard({
  defaultNetwork = 'testnet',
  onNetworkChange,
  buttonText = 'Deposit',
  balance = 0.0,
  minDeposit = 5,
  onConfirmDeposit,
}: DepositCardProps) {
  // true = mainnet, false = testnet
  const [isMainnet, setIsMainnet] = useState(defaultNetwork === 'mainnet');
  const networkLabel = isMainnet ? 'Mainnet' : 'Testnet';

  // dialog + form state
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const amountRef = useRef<HTMLInputElement>(null);

  const validate = (v: string) => {
    if (v === '') return 'Amount is required';
    const n = Number(v);
    if (Number.isNaN(n)) return 'Enter a valid number';
    if (n <= 0) return 'Amount must be greater than zero';
    if (n > balance) return `Insufficient balance (max ${balance} USDC)`;
    if (n < minDeposit) return `Minimum is ${minDeposit} USDC`;
    return '';
  };

  const handleNetworkToggle = (checked: boolean) => {
    setIsMainnet(checked);
    const networkValue = checked ? 'mainnet' : 'testnet';
    onNetworkChange?.(networkValue);
    console.log('Network changed to:', networkValue);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setAmount(v);
    console.log('Amount changed to:', v);
    setError(validate(v));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const vError = validate(amount);
    if (vError) {
      console.error('Validation error:', vError);
      setError(vError);
      amountRef.current?.focus();
      return;
    }
    const n = Number(amount);
    const network = isMainnet ? 'mainnet' : 'testnet';
    onConfirmDeposit?.({ amount: n, network: network });
    console.log('Deposit confirmed:', { amount: n, network: network });
    setOpen(false); // close only on success
  };

  return (
    <Card
      className="gap-2 min-w-[320px] w-[18rem] sm:w-[20rem] md:w-[22rem]
      bg-[#291a43] my-2 sm:my-4 md:my-6 mr-2 sm:mr-4 md:mr-6 p-4 border-[#f9c3ff]/20"
    >
      <CardHeader>
        <div className="flex flex-row justify-between">
          <CardTitle className="my-auto text-lg text-[#feffff]">Balance </CardTitle>
          <Badge
            variant="secondary"
            className="grow-[0.8] justify-start py-1 text-[1rem] font-bold
                        bg-[#f9c3ff] text-[#feffff]"
          >
            <BadgeCheckIcon />
            {balance} <span className="ml-auto text-sm font-black text-[#08041d]">USDC</span>
          </Badge>
        </div>
      </CardHeader>

      <CardHeader>
        <CardDescription className="text-center text-[#f9c3ff]/80" aria-live="polite">
          Currently connected to {networkLabel}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 flex justify-center items-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              onClick={() => setOpen(true)}
              variant="default"
              className="bg-[#f9c3ff] hover:bg-[#f9c3ff]/90 text-[#291a43] font-semibold"
            >
              {buttonText}
            </Button>
          </DialogTrigger>

          <DialogContent className="[&>button]:hidden gap-2 sm:max-w-[425px] bg-[#291a43] border border-[#f9c3ff] p-4">
            <form onSubmit={handleSubmit} noValidate>
              <DialogHeader>
                <DialogTitle className="text-center text-[#feffff]">Deposit USDC</DialogTitle>
                <DialogDescription className="text-center text-[#f9c3ff]/80 mb-4 ">
                  You need to deposit a minimum of {minDeposit} USDC
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="amount" className="text-[#feffff]">
                    Amount
                  </Label>

                  <div className="relative">
                    <Input
                      ref={amountRef}
                      id="amount"
                      name="amount"
                      type="number"
                      value={amount}
                      onChange={handleAmountChange}
                      min={0}
                      max={balance}
                      step="1"
                      className="bg-[#f9c3ff] text-[#291a43] font-bold pr-24"
                      aria-required="true"
                      aria-invalid={!!error}
                      aria-describedby={`amount-max${error ? ' amount-error' : ''}`}
                    />
                    <span
                      id="amount-max"
                      className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-[#291a43]/70"
                    >
                      Max: {balance}
                    </span>
                  </div>

                  {error && (
                    <p
                      id="amount-error"
                      className="text-sm text-red-300"
                      role="alert"
                      aria-live="polite"
                    >
                      {error}
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter className="mt-4 flex justify-between">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-[#291a43] border-[#f9c3ff] bg-[#f9c3ff] hover:bg-[#f9c3ff]/90"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={!!error || amount === ''}
                  className="bg-[#F170FF] text-[#210314] font-semibold hover:bg-[#F170FF]/90"
                >
                  Confirm
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>

      <CardFooter className="p-0 pt-0 justify-end">
        <div className="flex items-center gap-2">
          <Label
            htmlFor="network-switch"
            className="text-[#feffff] cursor-pointer select-none"
            aria-live="polite"
          >
            {networkLabel}
          </Label>
          <Switch
            id="network-switch"
            checked={isMainnet}
            style={{ backgroundColor: isMainnet ? '#f9c3ff' : '#ED47FF' }}
            onCheckedChange={handleNetworkToggle}
            aria-label={`Switch to ${isMainnet ? 'testnet' : 'mainnet'}`}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
