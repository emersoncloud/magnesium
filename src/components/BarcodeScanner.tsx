'use client';

import { useState } from 'react';
import { updateUserBarcode } from '@/app/actions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Loader2, ScanLine } from 'lucide-react';

export default function BarcodeScanner({ onComplete }: { onComplete?: () => void }) {
  const [barcode, setBarcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim()) return;

    setIsLoading(true);
    try {
      await updateUserBarcode(barcode.trim());
      setBarcode('');
      if (onComplete) onComplete();
    } catch (error) {
      console.error("Failed to update barcode:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-3 mb-4 text-rockmill">
        <ScanLine className="w-6 h-6" />
        <h3 className="font-black uppercase tracking-tighter text-xl">Link Card</h3>
      </div>

      <p className="text-slate-500 text-sm mb-4">
        Enter the number from your physical card to generate a digital barcode.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="barcode" className="sr-only">Card Number</label>
          <input
            id="barcode"
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Enter card number..."
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-rockmill focus:outline-none font-mono text-lg placeholder:text-slate-300 transition-colors"
            autoComplete="off"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full justify-center"
          disabled={!barcode.trim() || isLoading}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {isLoading ? 'Linking...' : 'Link Card'}
        </Button>
      </form>
    </Card>
  );
}
