"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Flame, Heart, PartyPopper, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { AchievementFeedItem } from "@/lib/achievements";

const CHALK_COLORS = ["#fcd34d", "#fbbf24", "#f59e0b", "#d97706", "#ffffff", "#fef3c7"];

function ChalkBurst({ triggerOnMount = true }: { triggerOnMount?: boolean }) {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      size: number;
      color: string;
      targetX: number;
      targetY: number;
      rotation: number;
      delay: number;
    }>
  >([]);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (triggerOnMount && !hasTriggered.current) {
      hasTriggered.current = true;

      const timeout = setTimeout(() => {
        const newParticles = Array.from({ length: 15 }, (_, i) => {
          const angle = (Math.random() - 0.5) * Math.PI * 1.5;
          const distance = 40 + Math.random() * 80;
          const upwardBias = -30 - Math.random() * 40;

          return {
            id: i,
            size: 6 + Math.random() * 10,
            color: CHALK_COLORS[Math.floor(Math.random() * CHALK_COLORS.length)],
            targetX: Math.sin(angle) * distance,
            targetY: upwardBias + Math.cos(angle) * distance * 0.5,
            rotation: Math.random() * 720 - 360,
            delay: Math.random() * 0.08,
          };
        });
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 1200);
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [triggerOnMount]);

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-visible">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-sm"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                marginLeft: -particle.size / 2,
                marginTop: -particle.size / 2,
                boxShadow: `0 0 ${particle.size}px ${particle.color}`,
              }}
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                opacity: 0,
                rotate: 0,
              }}
              animate={{
                x: particle.targetX,
                y: [0, particle.targetY - 15, particle.targetY + 50],
                scale: [0, 1.5, 1, 0],
                opacity: [0, 1, 0.9, 0],
                rotate: particle.rotation,
              }}
              transition={{
                duration: 1,
                delay: particle.delay,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function timeAgo(date: Date | null): string {
  if (!date) return "";
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
}

type ReactionType = "LIKE" | "FIRE" | "CELEBRATE";

interface ReactionButtonProps {
  type: ReactionType;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

function ReactionButton({ type, count, isActive, onClick }: ReactionButtonProps) {
  const icons = {
    LIKE: Heart,
    FIRE: Flame,
    CELEBRATE: PartyPopper,
  };

  const activeColors = {
    LIKE: "text-red-500 fill-red-500",
    FIRE: "text-orange-500 fill-orange-500",
    CELEBRATE: "text-purple-500",
  };

  const Icon = icons[type];

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold transition-all",
        "hover:bg-white/50 active:scale-95",
        isActive ? activeColors[type] : "text-slate-400"
      )}
    >
      <Icon className="w-4 h-4" />
      {count > 0 && <span>{count}</span>}
    </button>
  );
}

interface AchievementCardProps {
  item: AchievementFeedItem;
  reactions?: {
    likes: number;
    fires: number;
    celebrates: number;
    userReactions: ReactionType[];
  };
  onReact?: (type: ReactionType) => void;
}

export default function AchievementCard({
  item,
  reactions = { likes: 0, fires: 0, celebrates: 0, userReactions: [] },
  onReact,
}: AchievementCardProps) {
  const firstName = item.user_name?.split(" ")[0] || "Someone";

  const achievementTypeIcons: Record<string, string> = {
    MILESTONE_SENDS: "🎯",
    MILESTONE_FLASH: "⚡",
    GRADE_FIRST: "🏔️",
    STREAK: "🔥",
  };

  const achievementEmoji = achievementTypeIcons[item.achievement_type] || "🏆";

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 p-0 group hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-all">
      <ChalkBurst triggerOnMount />

      <div className="absolute -right-4 -top-4 text-yellow-200/30 pointer-events-none">
        <Trophy className="w-32 h-32" />
      </div>

      <div className="relative z-10 p-4">
        <div className="flex items-start gap-3">
          <Link href={`/profile/${item.user_id}`} className="flex-shrink-0 relative group/avatar">
            <div className="w-12 h-12 bg-white border-2 border-black transform -skew-x-6 flex items-center justify-center overflow-hidden shadow-md transition-transform group-hover/avatar:scale-105">
              {item.user_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.user_image}
                  alt={firstName}
                  className="w-full h-full object-cover transform skew-x-6 scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-amber-600 font-bold transform skew-x-6 text-lg">
                  {firstName[0]}
                </div>
              )}
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{achievementEmoji}</span>
              <span className="font-black text-amber-900 uppercase tracking-tight text-lg">
                {item.achievement_title}
              </span>
            </div>

            <p className="text-amber-800/80 text-sm font-medium mb-2">
              {firstName} unlocked this achievement!
            </p>

            {item.achievement_description && (
              <p className="text-amber-900/60 text-xs">{item.achievement_description}</p>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-amber-600/20 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <ReactionButton
              type="LIKE"
              count={reactions.likes}
              isActive={reactions.userReactions.includes("LIKE")}
              onClick={() => onReact?.("LIKE")}
            />
            <ReactionButton
              type="FIRE"
              count={reactions.fires}
              isActive={reactions.userReactions.includes("FIRE")}
              onClick={() => onReact?.("FIRE")}
            />
            <ReactionButton
              type="CELEBRATE"
              count={reactions.celebrates}
              isActive={reactions.userReactions.includes("CELEBRATE")}
              onClick={() => onReact?.("CELEBRATE")}
            />
            <button className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-slate-400 hover:bg-white/50 transition-all">
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700/60">
            {timeAgo(item.created_at)}
          </div>
        </div>
      </div>
    </Card>
  );
}
