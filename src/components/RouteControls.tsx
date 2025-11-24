"use client";

import { useRouteActivityContext } from "@/components/RouteActivityContext";
import { cn } from "@/lib/utils";
import { CheckCircle2, Minus, Plus, Send, Zap } from "lucide-react";

export default function RouteControls() {
  const {
    user,
    optimisticActivity,
    isPending,
    handleAction,
    handleAttempt,
    handleDelete,
    handleToggleFlash,
  } = useRouteActivityContext();

  const mySends = optimisticActivity.filter(
    (a) => a.action_type === "SEND" && a.user_id === user?.id
  );
  const myAttempts = optimisticActivity.filter(
    (a) => a.action_type === "ATTEMPT" && a.user_id === user?.id
  );
  const myFlash = optimisticActivity.find(
    (a) => a.action_type === "FLASH" && a.user_id === user?.id
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Send Control */}
      {mySends.length > 0 ? (
        <div className="h-12 flex items-center justify-between bg-white border-2 border-black px-1">
          <button
            disabled={!user || isPending}
            onClick={() => {
              const lastSend = mySends[0];
              if (lastSend) handleDelete(lastSend.id, false);
            }}
            className="w-10 h-full flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm">
            <Send className="w-4 h-4" />
            <span>Send</span>
            <span className="bg-black text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {mySends.length}
            </span>
          </div>

          <button
            disabled={!user || isPending}
            onClick={() => handleAction("SEND", "")}
            className="w-10 h-full flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => handleAction("SEND", "")}
          disabled={!user || isPending}
          className="h-12 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm"
        >
          <Send className="w-4 h-4" /> Log Send
        </button>
      )}

      {/* Flash Toggle */}
      <button
        onClick={() => handleToggleFlash(!!myFlash)}
        disabled={!user || isPending}
        className={cn(
          "h-12 border-2 transition-all duration-200 flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm",
          myFlash
            ? "bg-yellow-400 border-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.5)]"
            : "bg-white border-black hover:bg-yellow-50 hover:border-yellow-400 hover:text-black disabled:opacity-50"
        )}
      >
        <Zap className={cn("w-4 h-4", myFlash && "fill-black")} />
        {myFlash ? "Flashed!" : "Log Flash"}
      </button>

      {/* Attempt Control */}
      {myAttempts.length > 0 ? (
        <div className="h-12 flex items-center justify-between bg-white border-2 border-black px-1">
          <button
            disabled={!user || isPending}
            onClick={() => {
              const lastAttempt = myAttempts[0];
              if (lastAttempt) handleDelete(lastAttempt.id, false);
            }}
            className="w-10 h-full flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Attempt</span>
            <span className="bg-slate-200 text-slate-700 text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {myAttempts.length}
            </span>
          </div>

          <button
            disabled={!user || isPending}
            onClick={handleAttempt}
            className="w-10 h-full flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAttempt}
          disabled={!user || isPending}
          className="h-12 bg-white border-2 border-black hover:bg-slate-200 hover:border-slate-200 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm"
        >
          <CheckCircle2 className="w-4 h-4" /> Log Attempt
        </button>
      )}
    </div>
  );
}
