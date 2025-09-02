import { Card, CardContent } from '@/components/ui/card';

export function DepositCardMissing({ cardText = 'Connect your wallet to view your balance' }) {
  return (
    <Card
      className="gap-2 min-w-[320px] w-[18rem] sm:w-[20rem] md:w-[22rem]
      bg-[#291a43] my-2 sm:my-4 md:my-6 mr-2 sm:mr-4 md:mr-6 p-4 border-[#f9c3ff]/20"
    >
      <CardContent className="p-0 flex items-center justify-center py-8">
        <p className="text-center text-[#f9c3ff]/90">{cardText}</p>
      </CardContent>
    </Card>
  );
}
