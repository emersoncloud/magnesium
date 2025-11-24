"use client";

import { useOptimistic, useRef, useState, useTransition } from "react";
import { logActivity, savePersonalNote, logAttempt, updateActivity, deleteActivity, proposeGrade, removeGradeProposal, toggleFlash } from "@/app/actions";
import { useSettings } from "@/context/SettingsContext";
import { Send, Zap, MessageSquare, Eye, EyeOff, StickyNote, CheckCircle2, Pencil, Trash2, X, Check, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ActivityLog = {
  id: string;
  user_id: string;
  user_name: string | null;
  user_image: string | null;
  route_id: string;
  action_type: string;
  content: string | null;
  metadata: { is_beta?: boolean; proposed_grade?: string } | null;
  is_public?: boolean;
  created_at: Date | null;
};

type UserSession = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
};

const GRADES = ["VB", "V0", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10", "V11", "V12"];

export default function RouteActivity({
  routeId,
  initialActivity,
  initialPersonalNote,
  user,
  routeGrade
}: {
  routeId: string;
  initialActivity: ActivityLog[];
  initialPersonalNote: string;
  user: UserSession | null;
  routeGrade: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [optimisticActivity, addOptimisticActivity] = useOptimistic(
    initialActivity,
    (state, action: { type: "ADD" | "UPDATE" | "DELETE", log?: ActivityLog, id?: string }) => {
      switch (action.type) {
        case "ADD":
          return [action.log!, ...state];
        case "UPDATE":
          return state.map(a => a.id === action.log!.id ? action.log! : a);
        case "DELETE":
          return state.filter(a => a.id !== action.id);
        default:
          return state;
      }
    }
  );
  const [isPending, startTransition] = useTransition();
  const { shareActivity } = useSettings();
  const [personalNote, setPersonalNote] = useState(initialPersonalNote);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isBeta, setIsBeta] = useState(false);
  const [isPublic, setIsPublic] = useState(shareActivity);
  const [revealedBeta, setRevealedBeta] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  async function handleAction(actionType: string, content: string, metadata: { is_beta?: boolean } = {}, isPublic = true) {
    if (!user) return;

    const newLog: ActivityLog = {
      id: Math.random().toString(), // Temporary ID
      user_id: user.id,
      user_name: user.name,
      user_image: user.image,
      route_id: routeId,
      action_type: actionType,
      content: content,
      metadata,
      is_public: isPublic,
      created_at: new Date(),
    };

    startTransition(async () => {
      addOptimisticActivity({ type: "ADD", log: newLog });

      // Server Action
      await logActivity({
        user_id: user.id,
        user_name: user.name,
        user_image: user.image,
        route_id: routeId,
        action_type: actionType,
        content: content,
        metadata,
        is_public: isPublic,
      });
    });

    if (actionType === "COMMENT") {
      formRef.current?.reset();
      setIsBeta(false);
      setIsPublic(shareActivity);
    }
  }

  async function handleSaveNote() {
    setIsSavingNote(true);
    await savePersonalNote(routeId, personalNote);
    setIsSavingNote(false);
  }

  async function handleAttempt() {
    if (!user) return;

    const newLog: ActivityLog = {
      id: Math.random().toString(),
      user_id: user.id,
      user_name: user.name,
      user_image: user.image,
      route_id: routeId,
      action_type: "ATTEMPT",
      content: null,
      metadata: {},
      created_at: new Date(),
    };

    startTransition(async () => {
      addOptimisticActivity({ type: "ADD", log: newLog });
      await logAttempt(routeId);
    });
  }

  async function handleUpdate(id: string) {
    if (!editContent.trim()) return;

    const log = optimisticActivity.find(a => a.id === id);
    if (!log) return;

    const updatedLog = { ...log, content: editContent };
    setEditingId(null);

    startTransition(async () => {
      addOptimisticActivity({ type: "UPDATE", log: updatedLog });
      await updateActivity(id, editContent);
    });
  }

  async function handleDelete(id: string, confirmDelete = true) {
    if (confirmDelete && !confirm("Are you sure you want to delete this?")) return;

    startTransition(async () => {
      addOptimisticActivity({ type: "DELETE", id });
      await deleteActivity(id);
    });
  }

  async function handleToggleFlash(isActive: boolean) {
    if (!user) return;

    startTransition(async () => {
      if (isActive) {
        // Optimistically remove
        const flashLog = optimisticActivity.find(a => a.action_type === "FLASH" && a.user_id === user.id);
        if (flashLog) {
          addOptimisticActivity({ type: "DELETE", id: flashLog.id });
        }
      } else {
        // Optimistically add
        const newLog: ActivityLog = {
          id: Math.random().toString(),
          user_id: user.id,
          user_name: user.name,
          user_image: user.image,
          route_id: routeId,
          action_type: "FLASH",
          content: null,
          metadata: {},
          created_at: new Date(),
        };
        addOptimisticActivity({ type: "ADD", log: newLog });
      }
      await toggleFlash(routeId, !isActive);
    });
  }

  async function handleProposeGrade(grade: string) {
    if (!user) return;

    const existingProposal = optimisticActivity.find(a => a.action_type === "PROPOSE_GRADE" && a.user_id === user.id);
    const isSameGrade = existingProposal?.content === grade;

    startTransition(async () => {
      if (existingProposal) {
        addOptimisticActivity({ type: "DELETE", id: existingProposal.id });
      }

      if (!isSameGrade) {
        const newLog: ActivityLog = {
          id: Math.random().toString(),
          user_id: user.id,
          user_name: user.name,
          user_image: user.image,
          route_id: routeId,
          action_type: "PROPOSE_GRADE",
          content: grade,
          metadata: { proposed_grade: grade },
          created_at: new Date(),
        };
        addOptimisticActivity({ type: "ADD", log: newLog });
        await proposeGrade(routeId, grade);
      } else {
        await removeGradeProposal(routeId);
      }
    });
  }

  const sends = optimisticActivity.filter(a => a.action_type === "SEND" || a.action_type === "FLASH");
  const comments = optimisticActivity.filter(a => a.action_type === "COMMENT");

  const mySends = optimisticActivity.filter(a => a.action_type === "SEND" && a.user_id === user?.id);
  const myAttempts = optimisticActivity.filter(a => a.action_type === "ATTEMPT" && a.user_id === user?.id);
  const myFlash = optimisticActivity.find(a => a.action_type === "FLASH" && a.user_id === user?.id);
  const myProposal = optimisticActivity.find(a => a.action_type === "PROPOSE_GRADE" && a.user_id === user?.id);

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

  const currentGradeIndex = GRADES.indexOf(routeGrade);
  // If route grade isn't in our V-scale list (e.g. 5.10a), we just show the whole list? 
  // Or maybe we treat it as "unknown" position.
  // Requirement: "show the different v grades to the left and right... of the current difficulty"
  // Let's assume if it's not found, we just show the list.

  return (
    <div className="space-y-12">
      {/* Control Panel */}
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

      {/* Grade Proposal Section */}
      {hasSendOrFlash && (
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg animate-in fade-in slide-in-from-top-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
            <Check className="w-3 h-3" /> Propose Grade
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {GRADES.map((grade, i) => {
              const isCurrent = grade === routeGrade;
              const isSelected = myProposal?.content === grade;

              // If current grade is in list, we split left/right. 
              // But the UI request says "show the different v grades to the left and right... of the current difficulty".
              // This implies a visual layout.
              // Let's just render them in order, but style the "Current" one differently (not a button).

              if (isCurrent) {
                return (
                  <div key={grade} className="px-4 py-2 bg-black text-white font-black text-lg rounded shadow-lg mx-2 transform scale-110">
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
                    hasFlash: false
                  };
                }
                acc[log.user_id].count++;
                if (log.action_type === "FLASH") {
                  acc[log.user_id].hasFlash = true;
                }
                return acc;
              }, {} as Record<string, ActivityLog & { count: number; hasFlash: boolean }>)
            ).map((log) => (
              <div key={log.id} className="flex items-center gap-2 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700" title={new Date(log.created_at!).toLocaleDateString()}>
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
              <div key={log.id} className="relative pl-6 animate-in fade-in slide-in-from-left-2 duration-300">
                {/* Timeline Dot */}
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 bg-slate-300 rounded-full ring-4 ring-white" />

                <div className="flex items-baseline justify-between mb-1">
                  <div className="flex items-baseline gap-3">
                    <Link href={`/profile/${encodeURIComponent(log.user_id)}`} className="font-bold text-sm hover:underline">
                      {log.user_name || "Unknown"}
                    </Link>
                    <span className="text-xs text-slate-400">
                      {log.created_at ? new Date(log.created_at).toLocaleDateString() : "Just now"}
                    </span>
                    {log.metadata?.is_beta && (
                      <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">BETA</span>
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
                      <button onClick={() => handleUpdate(log.id)} className="text-green-600 hover:bg-green-50 p-1 rounded">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-red-600 hover:bg-red-50 p-1 rounded">
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
      </div >
    </div >
  );
}
