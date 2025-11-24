"use client";

import { createContext, useContext, useOptimistic, useRef, useState, useTransition, ReactNode } from "react";
import { logActivity, savePersonalNote, logAttempt, updateActivity, deleteActivity, proposeGrade, removeGradeProposal, toggleFlash } from "@/app/actions";
import { useSettings } from "@/context/SettingsContext";

export type ActivityLog = {
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

export type UserSession = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
};

type RouteActivityContextType = {
  routeId: string;
  user: UserSession | null;
  routeGrade: string;
  optimisticActivity: ActivityLog[];
  isPending: boolean;
  personalNote: string;
  setPersonalNote: (note: string) => void;
  isSavingNote: boolean;
  handleSaveNote: () => Promise<void>;
  handleAction: (actionType: string, content: string, metadata?: { is_beta?: boolean }, isPublic?: boolean) => Promise<void>;
  handleAttempt: () => Promise<void>;
  handleUpdate: (id: string, content: string) => Promise<void>;
  handleDelete: (id: string, confirmDelete?: boolean) => Promise<void>;
  handleToggleFlash: (isActive: boolean) => Promise<void>;
  handleProposeGrade: (grade: string) => Promise<void>;
  shareActivity: boolean;
};

const RouteActivityContext = createContext<RouteActivityContextType | null>(null);

export function useRouteActivityContext() {
  const context = useContext(RouteActivityContext);
  if (!context) {
    throw new Error("useRouteActivityContext must be used within a RouteActivityProvider");
  }
  return context;
}

type RouteActivityProviderProps = {
  children: ReactNode;
  routeId: string;
  initialActivity: ActivityLog[];
  initialPersonalNote: string;
  user: UserSession | null;
  routeGrade: string;
};

export function RouteActivityProvider({
  children,
  routeId,
  initialActivity,
  initialPersonalNote,
  user,
  routeGrade,
}: RouteActivityProviderProps) {
  const [optimisticActivity, addOptimisticActivity] = useOptimistic(
    initialActivity,
    (state, action: { type: "ADD" | "UPDATE" | "DELETE"; log?: ActivityLog; id?: string }) => {
      switch (action.type) {
        case "ADD":
          return [action.log!, ...state];
        case "UPDATE":
          return state.map((a) => (a.id === action.log!.id ? action.log! : a));
        case "DELETE":
          return state.filter((a) => a.id !== action.id);
        default:
          return state;
      }
    }
  );

  const [isPending, startTransition] = useTransition();
  const { shareActivity } = useSettings();
  const [personalNote, setPersonalNote] = useState(initialPersonalNote);
  const [isSavingNote, setIsSavingNote] = useState(false);

  async function handleAction(
    actionType: string,
    content: string,
    metadata: { is_beta?: boolean } = {},
    isPublic = true
  ) {
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

  async function handleUpdate(id: string, content: string) {
    if (!content.trim()) return;

    const log = optimisticActivity.find((a) => a.id === id);
    if (!log) return;

    const updatedLog = { ...log, content: content };

    startTransition(async () => {
      addOptimisticActivity({ type: "UPDATE", log: updatedLog });
      await updateActivity(id, content);
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
        const flashLog = optimisticActivity.find(
          (a) => a.action_type === "FLASH" && a.user_id === user.id
        );
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

    const existingProposal = optimisticActivity.find(
      (a) => a.action_type === "PROPOSE_GRADE" && a.user_id === user.id
    );
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

  return (
    <RouteActivityContext.Provider
      value={{
        routeId,
        user,
        routeGrade,
        optimisticActivity,
        isPending,
        personalNote,
        setPersonalNote,
        isSavingNote,
        handleSaveNote,
        handleAction,
        handleAttempt,
        handleUpdate,
        handleDelete,
        handleToggleFlash,
        handleProposeGrade,
        shareActivity,
      }}
    >
      {children}
    </RouteActivityContext.Provider>
  );
}
