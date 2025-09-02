import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DepositCardSkeleton() {
  return (
    <Card
      aria-busy="true"
      className="gap-2 min-w-[320px] w-[18rem] sm:w-[20rem] md:w-[22rem]
      bg-[#291a43] my-2 sm:my-4 md:my-6 mr-2 sm:mr-4 md:mr-6 p-4 border-[#f9c3ff]/20"
    >
      {/* Header: Title + Badge */}
      <CardHeader>
        <div className="flex flex-row justify-between gap-2">
          {/* Title (Balance) */}
          <Skeleton className="my-auto h-5 w-24 rounded bg-[#feffff]/25" />

          {/* Badge look-alike */}
          <div className="grow-[0.8] justify-start py-1 px-3 rounded-md bg-[#f9c3ff] flex items-center gap-2 min-w-[8rem]">
            {/* Icon circle */}
            <Skeleton className="h-5 w-5 rounded-full bg-[#291a43]/30" />
            {/* Balance number */}
            <Skeleton className="h-5 w-16 rounded bg-[#291a43]/30" />
            {/* 'USDC' stub on the right */}
            <Skeleton className="ml-auto h-4 w-12 rounded bg-[#08041d]/35" />
          </div>
        </div>
      </CardHeader>

      {/* Subheader: "Currently connected to ..." */}
      <CardHeader>
        <div className="flex justify-center">
          <Skeleton className="h-4 w-56 rounded bg-[#f9c3ff]/40" />
        </div>
      </CardHeader>

      {/* Content: Button */}
      <CardContent className="p-0 flex justify-center items-center">
        <Skeleton className="h-9 w-40 rounded-md bg-[#f9c3ff]/80" />
      </CardContent>

      {/* Footer: Label + Switch */}
      <CardFooter className="p-0 pt-0 justify-end">
        <div className="flex items-center gap-2">
          {/* Network label */}
          <Skeleton className="h-4 w-24 rounded bg-[#feffff]/25" />
          {/* Switch stub */}
          <div className="relative">
            {/* Track */}
            <Skeleton className="h-6 w-11 rounded-full bg-[#ED47FF]/60" />
            {/* Knob */}
            <Skeleton className="absolute left-1 top-1 h-4 w-4 rounded-full bg-[#291a43]/60" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
