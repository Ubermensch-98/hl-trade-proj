'use client';
import { useState } from 'react';
import { usePlaceOrder } from '@/hooks/usePlaceOrder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export function OpenPositionCard() {
  const { placeLimit, placeMarket } = usePlaceOrder();
  const [assetId, setAssetId] = useState<number>(0); // e.g., ETH-perp
  const [size, setSize] = useState('0.01');
  const [price, setPrice] = useState('30000');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [lev, setLev] = useState<number>(10);

  const onLimit = async () => {
    const res = await placeLimit({
      asset: assetId,
      side: side,
      size: size,
      price: price,
      tif: 'Gtc', // or "Alo"/"Ioc"
      leverage: lev, // optional; set before order
      reduceOnly: false,
    });
    console.log('limit result', res);
  };

  const onMarket = async () => {
    const res = await placeMarket({
      asset: assetId,
      side: side,
      size: size,
      leverage: lev,
    });
    console.log('market result', res);
  };

  return (
    <Card
      className="gap-2 min-w-[320px] w-[18rem] sm:w-[20rem] md:w-[22rem]
      bg-[#291a43] my-2 sm:my-4 md:my-6 mr-2 sm:mr-4 md:mr-6 p-4 border-[#f9c3ff]/20"
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg">Place Order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="asset" className="text-gray-300 text-sm">
            Asset ID
          </Label>
          <Input
            id="asset"
            type="number"
            value={assetId}
            onChange={(e) => setAssetId(+e.target.value)}
            placeholder="Asset ID (e.g., 0 for BTC)"
            className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="side" className="text-gray-300 text-sm">
            Side
          </Label>
          <select
            id="side"
            value={side}
            onChange={(e) => setSide(e.target.value as 'buy' | 'sell')}
            className="w-full h-9 px-3 py-1 bg-gray-800/50 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="buy" className="bg-gray-800">
              Long
            </option>
            <option value="sell" className="bg-gray-800">
              Short
            </option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="size" className="text-gray-300 text-sm">
            Size
          </Label>
          <Input
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="Size (e.g., 0.01)"
            className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="text-gray-300 text-sm">
            Price
          </Label>
          <Input
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price (e.g., 30000)"
            className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="leverage" className="text-gray-300 text-sm">
            Leverage
          </Label>
          <Input
            id="leverage"
            type="number"
            value={lev}
            onChange={(e) => setLev(+e.target.value)}
            placeholder="Leverage (e.g., 10)"
            className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            onClick={onLimit}
            variant="outline"
            className="w-full bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/50 text-blue-100 hover:text-white"
          >
            Place Limit Order
          </Button>
          <Button
            onClick={onMarket}
            variant="outline"
            className="w-full bg-green-600/20 hover:bg-green-600/30 border-green-500/50 text-green-100 hover:text-white"
          >
            Place Market Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
