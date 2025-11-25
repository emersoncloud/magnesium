"use client";

import { useState } from "react";
import { Drawer as VaulDrawer } from "vaul";
import { ScanBarcode, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { updateUserBarcode, resetUserBarcode } from "@/app/actions";
import Barcode from "react-barcode";

interface BarcodeDrawerProps {
  barcode: string | null;
}

export default function BarcodeDrawer({ barcode: initialBarcode }: BarcodeDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [barcode, setBarcode] = useState(initialBarcode);
  const [cardNumberInput, setCardNumberInput] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);

  const handleLinkCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumberInput.trim()) return;

    setIsLinking(true);
    try {
      await updateUserBarcode(cardNumberInput.trim());
      setBarcode(cardNumberInput.trim());
      setCardNumberInput("");
    } catch (error) {
      console.error("Failed to link card:", error);
    } finally {
      setIsLinking(false);
    }
  };

  const handleUnlinkCard = async () => {
    if (!confirm("Are you sure you want to unlink this card?")) return;

    setIsUnlinking(true);
    try {
      await resetUserBarcode();
      setBarcode(null);
    } catch (error) {
      console.error("Failed to unlink card:", error);
    } finally {
      setIsUnlinking(false);
    }
  };

  const barcodeIsLinked = barcode !== null && barcode !== "";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors group flex items-center justify-center gap-2"
        aria-label="Open barcode"
      >
        <span className="text-xl group-hover:text-rockmill transition-colors">{barcodeIsLinked ? "Scan Card" : "Link Card"}</span>
        <ScanBarcode className="w-7 h-7 text-slate-700 group-hover:text-rockmill transition-colors" />
      </button>

      <VaulDrawer.Root open={isOpen} onOpenChange={setIsOpen}>
        <VaulDrawer.Portal>
          <VaulDrawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <VaulDrawer.Content className="flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none overflow-hidden bg-white">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-12 h-1.5 flex-shrink-0 rounded-full bg-black/20" />

            <div className="p-6 pt-10">
              <div className="flex items-center gap-3 mb-6 text-rockmill">
                <ScanBarcode className="w-6 h-6" />
                <h3 className="font-black uppercase tracking-tighter text-xl">
                  {barcodeIsLinked ? "Member ID" : "Link Card"}
                </h3>
              </div>

              {barcodeIsLinked ? (
                <div className="flex flex-col items-center">
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

                  <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-6">
                    {barcode}
                  </div>

                  <Button
                    onClick={handleUnlinkCard}
                    variant="ghost"
                    className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                    disabled={isUnlinking}
                  >
                    {isUnlinking ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Unlink Card
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-slate-500 text-sm mb-4">
                    Enter the number from your physical card to generate a digital barcode.
                  </p>

                  <form onSubmit={handleLinkCard} className="space-y-4">
                    <div>
                      <label htmlFor="card-number" className="sr-only">
                        Card Number
                      </label>
                      <input
                        id="card-number"
                        type="text"
                        value={cardNumberInput}
                        onChange={(e) => setCardNumberInput(e.target.value)}
                        placeholder="Enter card number..."
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-rockmill focus:outline-none font-mono text-lg placeholder:text-slate-300 transition-colors"
                        autoComplete="off"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full justify-center"
                      disabled={!cardNumberInput.trim() || isLinking}
                    >
                      {isLinking ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      {isLinking ? "Linking..." : "Link Card"}
                    </Button>
                  </form>
                </>
              )}

              <div className="mt-6 pb-4" />
            </div>
          </VaulDrawer.Content>
        </VaulDrawer.Portal>
      </VaulDrawer.Root>
    </>
  );
}
