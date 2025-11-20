"use client";

import { useOptimistic, useRef } from "react";
import { logActivity } from "@/app/actions";
import { Send, Zap, MessageSquare } from "lucide-react";
import Link from "next/link";

type ActivityLog = {
  id: string;
  user_id: string;
  user_name: string | null;
  user_image: string | null;
  route_id: string;
  action_type: string;
  content: string | null;
  created_at: Date | null;
};

type UserSession = {
  email: string;
  name: string | null;
  image: string | null;
};

export default function RouteActivity({ 
  routeId, 
  initialActivity, 
  user 
}: { 
  routeId: string; 
  initialActivity: ActivityLog[];
  user: UserSession | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [optimisticActivity, addOptimisticActivity] = useOptimistic(
    initialActivity,
    (state, newActivity: ActivityLog) => [newActivity, ...state]
  );

  async function handleAction(actionType: string, content: string) {
    if (!user) return;

    const newLog: ActivityLog = {
      id: Math.random().toString(), // Temporary ID
      user_id: user.email,
      user_name: user.name,
      user_image: user.image,
      route_id: routeId,
      action_type: actionType,
      content: content,
      created_at: new Date(),
    };

    addOptimisticActivity(newLog);
    
    // Server Action
    await logActivity({
      user_id: user.email,
      user_name: user.name,
      user_image: user.image,
      route_id: routeId,
      action_type: actionType,
      content: content,
    });

    if (actionType === "COMMENT") {
      formRef.current?.reset();
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button 
          onClick={() => handleAction("SEND", "Sent it!")}
          disabled={!user}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" /> Log Send
        </button>

        <button 
          onClick={() => handleAction("FLASH", "Flashed it!")}
          disabled={!user}
          className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-white py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-5 h-5" /> Log Flash
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" /> Activity & Comments
        </h2>

        <form 
          ref={formRef}
          action={async (formData) => {
            const content = formData.get("content") as string;
            if (!content) return;
            await handleAction("COMMENT", content);
          }} 
          className="mb-8 flex gap-2"
        >
          <input 
            name="content" 
            type="text" 
            placeholder={user ? "Add a comment..." : "Sign in to comment"} 
            className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            required
            disabled={!user}
          />
          <button 
            type="submit" 
            disabled={!user}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </form>

        <div className="space-y-6">
          {optimisticActivity.map((log) => (
            <div key={log.id} className="flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              {log.user_image ? (
                <img src={log.user_image} alt={log.user_name || "User"} className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                  {log.user_name?.[0] || "?"}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Link href={`/profile/${encodeURIComponent(log.user_id)}`} className="font-bold text-gray-900 hover:underline">
                    {log.user_name || "Unknown Climber"}
                  </Link>
                  <span className="text-xs text-gray-500">
                    • {log.created_at ? new Date(log.created_at).toLocaleDateString() : "Just now"}
                  </span>
                </div>
                <div className="text-gray-800">
                  {log.action_type === "SEND" && <span className="text-green-600 font-bold mr-2">SENT</span>}
                  {log.action_type === "FLASH" && <span className="text-yellow-600 font-bold mr-2">FLASHED</span>}
                  {log.content}
                </div>
              </div>
            </div>
          ))}
          {optimisticActivity.length === 0 && (
            <p className="text-gray-500 italic text-center py-4">No activity yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
}
