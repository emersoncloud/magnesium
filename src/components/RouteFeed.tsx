"use client";

import { useRouteActivityContext, ActivityLog } from "@/components/RouteActivityContext";
import { cn } from "@/lib/utils";
import { Check, Eye, EyeOff, MessageSquare, Pencil, StickyNote, Trash2, X, Zap } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

const GRADES = ["VB", "V0", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10", "V11", "V12"];

export default function RouteFeed() {
  const {
    user,
    routeGrade,
    optimisticActivity,
    isPending,
    personalNote,
    setPersonalNote,
    isSavingNote,
    handleSaveNote,
    handleAction,
    handleUpdate,
    handleDelete,
    handleProposeGrade,
    shareActivity,
  } = useRouteActivityContext();

  const formRef = useRef<HTMLFormElement>(null);
  const [isBeta, setIsBeta] = useState(false);
  const [isPublic, setIsPublic] = useState(shareActivity);
  const [revealedBeta, setRevealedBeta] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const sends = optimisticActivity.filter((a) => a.action_type === "SEND" || a.action_type === "FLASH");
  const comments = optimisticActivity.filter((a) => a.action_type === "COMMENT");

  const mySends = optimisticActivity.filter((a) => a.action_type === "SEND" && a.user_id === user?.id);
  const myFlash = optimisticActivity.find((a) => a.action_type === "FLASH" && a.user_id === user?.id);
  const myProposal = optimisticActivity.find((a) => a.action_type === "PROPOSE_GRADE" && a.user_id === user?.id);

  const hasSendOrFlash = mySends.length > 0 || !!myFlash;

  const toggleBeta = (id: string) => {
    const newRevealed = new Set(revealedBeta);
    if (newRevealed.has(id)) {
      newRevealed.delete(id);
    } else {
      newRevealed.add(id);
    }
    setRevealedBeta(newRevealed);
  };

  return (
    <div className="space-y-12">
      {/* Grade Proposal Section */}
      {hasSendOrFlash && (
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg animate-in fade-in slide-in-from-top-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
            <Check className="w-3 h-3" /> Propose Grade
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {GRADES.map((grade) => {
              const isCurrent = grade === routeGrade;
              const isSelected = myProposal?.content === grade;

              if (isCurrent) {
                return (
                  <div
                    key={grade}
                    className="px-4 py-2 bg-black text-white font-black text-lg rounded shadow-lg mx-2 transform scale-110"
                  >
                    {grade}
                  </div>
                );
              }

              return (
                <button
                  key={grade}
                  onClick={() => handleProposeGrade(grade)}
                  disabled={isPending}
                  className={cn(
                    "px-3 py-1.5 text-sm font-bold rounded transition-all",
                    isSelected
                      ? "bg-blue-600 text-white shadow-md scale-105"
                      : "bg-white border border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600"
                  )}
                >
                  {grade}
                </button>
              );
            })}
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-4 font-mono">
            Select a grade if you feel the route is graded incorrectly.
          </p>
        </div>
      )}

      {/* Personal Notes */}
      {user && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-yellow-800 flex items-center gap-2">
              <StickyNote className="w-3 h-3" /> Personal Notes
            </h3>
            {isSavingNote && <span className="text-[10px] font-mono text-yellow-600">Saving...</span>}
          </div>
          <textarea
            value={personalNote}
            onChange={(e) => setPersonalNote(e.target.value)}
            onBlur={handleSaveNote}
            placeholder="Add private notes..."
            className="w-full bg-transparent text-slate-800 text-sm focus:outline-none min-h-[80px] resize-y placeholder:text-yellow-700/30"
          />
        </div>
      )}

      {/* Sends Ticker */}
      {sends.length > 0 && (
        <div className="border-y border-slate-200 py-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Recent Sends</h3>
          <div className="flex flex-wrap gap-2">
            {Object.values(
              sends.reduce((acc, log) => {
                if (!acc[log.user_id]) {
                  acc[log.user_id] = {
                    ...log,
                    count: 0,
                    hasFlash: false,
                  };
                }
                acc[log.user_id].count++;
                if (log.action_type === "FLASH") {
                  acc[log.user_id].hasFlash = true;
                }
                return acc;
              }, {} as Record<string, ActivityLog & { count: number; hasFlash: boolean }>)
            ).map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-2 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                title={new Date(log.created_at!).toLocaleDateString()}
              >
                <span>{log.user_name}</span>
                {log.count > 1 && (
                  <span className="bg-slate-200 text-slate-600 px-1.5 rounded-full text-[10px] font-bold">
                    {log.count}
                  </span>
                )}
                {log.hasFlash && <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Stream */}
      <div className="relative">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
          <MessageSquare className="w-3 h-3" /> Activity Log
        </h3>

        {/* Input Area */}
        <div className="mb-10">
          <form
            ref={formRef}
            action={async (formData) => {
              const content = formData.get("content") as string;
              if (!content) return;
              await handleAction("COMMENT", content, { is_beta: isBeta }, isPublic);
              formRef.current?.reset();
              setIsBeta(false);
              setIsPublic(shareActivity);
            }}
          >
            <div className="flex gap-4">
              <input
                name="content"
                type="text"
                placeholder={user ? "Write a comment..." : "Sign in to comment"}
                className="flex-1 border-b-2 border-slate-200 bg-transparent py-2 text-sm focus:outline-none focus:border-black transition-colors disabled:opacity-50"
                required
                disabled={!user}
              />
              <button
                type="submit"
                disabled={!user || isPending}
                className="font-bold text-xs uppercase tracking-widest hover:text-violet-600 transition-colors disabled:opacity-50"
              >
                Post
              </button>
            </div>
            {user && (
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer mt-2 w-fit hover:text-black transition-colors">
                  <input
                    type="checkbox"
                    checked={isBeta}
                    onChange={(e) => setIsBeta(e.target.checked)}
                    className="rounded border-slate-300 text-black focus:ring-0"
                  />
                  <span>Contains Beta</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer mt-2 w-fit hover:text-black transition-colors">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="rounded border-slate-300 text-black focus:ring-0"
                  />
                  <span>Share to Feed</span>
                </label>
              </div>
            )}
          </form>
        </div>

        {/* Stream Items */}
        <div className="space-y-8 pl-4 border-l-2 border-slate-100">
          {comments.map((log) => {
            const isHidden = log.metadata?.is_beta && !revealedBeta.has(log.id);
            const isOwner = user && log.user_id === user.id;
            const isEditing = editingId === log.id;

            return (
              <div
                key={log.id}
                className="relative pl-6 animate-in fade-in slide-in-from-left-2 duration-300"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 bg-slate-300 rounded-full ring-4 ring-white" />

                <div className="flex items-baseline justify-between mb-1">
                  <div className="flex items-baseline gap-3">
                    <Link
                      href={`/profile/${encodeURIComponent(log.user_id)}`}
                      className="font-bold text-sm hover:underline"
                    >
                      {log.user_name || "Unknown"}
                    </Link>
                    <span className="text-xs text-slate-400">
                      {log.created_at
                        ? new Date(log.created_at).toLocaleDateString()
                        : "Just now"}
                    </span>
                    {log.metadata?.is_beta && (
                      <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                        BETA
                      </span>
                    )}
                  </div>
                  {isOwner && !isEditing && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(log.id);
                          setEditContent(log.content || "");
                        }}
                        className="text-slate-400 hover:text-blue-600"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-sm text-slate-600 leading-relaxed group min-h-[24px]">
                  {isEditing ? (
                    <div className="flex gap-2 items-start">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="flex-1 border-b border-blue-500 bg-slate-50 px-2 py-1 focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdate(log.id, editContent)}
                        className="text-green-600 hover:bg-green-50 p-1 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      {isHidden ? (
                        <button
                          onClick={() => toggleBeta(log.id)}
                          className="flex items-center gap-2 text-slate-400 hover:text-black transition-colors italic"
                        >
                          <EyeOff className="w-3 h-3" />
                          <span>Spoiler hidden. Click to reveal.</span>
                        </button>
                      ) : (
                        <div className="relative group">
                          <p>{log.content}</p>
                          {log.metadata?.is_beta && (
                            <button
                              onClick={() => toggleBeta(log.id)}
                              className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-black"
                              title="Hide beta"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {comments.length === 0 && (
            <div className="pl-6">
              <p className="text-slate-400 text-sm italic">No activity logged yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
