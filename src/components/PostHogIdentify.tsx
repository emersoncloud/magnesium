"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

interface PostHogIdentifyProps {
  userId: string;
  email?: string | null;
  name?: string | null;
}

export default function PostHogIdentify({ userId, email, name }: PostHogIdentifyProps) {
  useEffect(() => {
    if (userId) {
      const userProperties: Record<string, string> = {};

      if (email) {
        userProperties.email = email;
      }
      if (name) {
        userProperties.name = name;
      }

      posthog.identify(userId, userProperties);
    }
  }, [userId, email, name]);

  return null;
}
