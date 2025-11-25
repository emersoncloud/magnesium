"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import posthog from "posthog-js";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    posthog.captureException(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-red-50 p-6 rounded-full mb-6">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">yeesh!</h2>
      <p className="text-slate-500 mb-8 max-w-md">
        However you got here, it was a bad idea. The team got notified and will look into it.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Climb on
      </button>
    </div>
  );
}
