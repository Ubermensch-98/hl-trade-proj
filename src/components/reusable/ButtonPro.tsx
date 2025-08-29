// components/ui/loading-button.tsx
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ButtonRef = React.ElementRef<typeof Button>;
type ShadcnButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

type ButtonProProps = ShadcnButtonProps & {
  isLoading?: boolean;
  baseColor?: string; // Tailwind color name OR any CSS color
};

const COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-600',
  indigo: 'bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-600',
  violet: 'bg-violet-600 hover:bg-violet-700 focus-visible:ring-violet-600',
  purple: 'bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-600',
  emerald: 'bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-600',
  green: 'bg-green-600 hover:bg-green-700 focus-visible:ring-green-600',
  teal: 'bg-teal-600 hover:bg-teal-700 focus-visible:ring-teal-600',
  sky: 'bg-sky-600 hover:bg-sky-700 focus-visible:ring-sky-600',
  red: 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-600',
  rose: 'bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-600',
  orange: 'bg-orange-600 hover:bg-orange-700 focus-visible:ring-orange-600',
  amber: 'bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-500',
  slate: 'bg-slate-900 hover:bg-slate-800 focus-visible:ring-slate-900',
  gray: 'bg-gray-900 hover:bg-gray-800 focus-visible:ring-gray-900',
  zinc: 'bg-zinc-900 hover:bg-zinc-800 focus-visible:ring-zinc-900',
};

export const ButtonPro = React.forwardRef<ButtonRef, ButtonProProps>(
  ({ isLoading = false, baseColor, className, disabled, children, ...props }, ref) => {
    const colorClasses = baseColor && COLOR_MAP[baseColor];
    const style =
      baseColor && !colorClasses
        ? ({ ['--btn-base' as string]: baseColor } as React.CSSProperties)
        : undefined;

    return (
      <Button
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2 rounded-md',
          colorClasses,
          !colorClasses && baseColor
            ? 'bg-[var(--btn-base)] hover:brightness-95 focus-visible:ring-[var(--btn-base)]'
            : '',
          isLoading && 'cursor-wait',
          className,
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-disabled={disabled || isLoading}
        style={style}
        {...props}
      >
        {isLoading && (
          <span className="inline-flex items-center" role="status" aria-live="polite">
            <svg className="mr-1 h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span className="sr-only">Loading…</span>
          </span>
        )}
        <span className={cn(isLoading && 'opacity-80')}>{children}</span>
      </Button>
    );
  },
);

ButtonPro.displayName = 'LoadingButton';
