import "@testing-library/jest-dom/vitest";
import React from "react";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
  useParams: () => ({}),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: vi.fn((fn) => fn),
}));

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  useSession: () => ({
    data: null,
    status: "unauthenticated",
    update: vi.fn(),
  }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("posthog-js/react", () => ({
  usePostHog: () => ({
    capture: vi.fn(),
    identify: vi.fn(),
  }),
  PostHogProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const mockSettingsContextValue = {
  gradeDisplay: "v-scale" as const,
  setGradeDisplay: vi.fn(),
  toggleGradeDisplay: vi.fn(),
  showDifficulty: false,
  shareActivity: true,
  toggleShareActivity: vi.fn(),
  showBeta: false,
  toggleShowBeta: vi.fn(),
  experimentalFeatures: false,
  toggleExperimentalFeatures: vi.fn(),
};

vi.mock("@/context/SettingsContext", () => ({
  useSettings: () => mockSettingsContextValue,
  SettingsProvider: ({ children }: { children: React.ReactNode }) => children,
  SettingsContext: React.createContext(mockSettingsContextValue),
}));
