"use client";

import Barcode from "react-barcode";
import { resetUserBarcode } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Loader2, Trash2, ScanLine } from "lucide-react";
import { useState } from "react";

export default function UserBarcode({ barcode }: { barcode: string }) {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (!confirm("Are you sure you want to unlink this card?")) return;

    setIsResetting(true);
    try {
      await resetUserBarcode();
    } catch (error) {
      console.error("Failed to reset barcode:", error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Card className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
      <div className="flex items-center gap-2 mb-6 text-rockmill">
        <ScanLine className="w-5 h-5" />
        <h3 className="font-bold uppercase tracking-widest text-sm">Member ID</h3>
      </div>

      <div className="p-4 bg-white border-2 border-slate-100 rounded-xl mb-6 shadow-inner overflow-hidden">
        <Barcode
          value={barcode}
          width={2}
          height={100}
          displayValue={false}
          background="#ffffff"
          lineColor="#000000"
        />
      </div>

      <div className="space-y-2 w-full">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">
          {barcode}
        </div>

        <Button
          onClick={handleReset}
          variant="ghost"
          className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
          disabled={isResetting}
        >
          {isResetting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Trash2 className="w-4 h-4 mr-2" />
          )}
          Unlink Card
        </Button>
      </div>
    </Card>
  );
}
