"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getBrowserRoutes,
  getUpcomingRoutes,
  getRoutes,
  BrowserRoute,
  UpcomingRouteData,
} from "@/app/actions";

// Query keys - exported for prefetching on server
export const routeKeys = {
  all: ["routes"] as const,
  browser: () => [...routeKeys.all, "browser"] as const,
  upcoming: () => [...routeKeys.all, "upcoming"] as const,
  upcomingForWall: (wallId: string) => [...routeKeys.upcoming(), wallId] as const,
  basic: () => [...routeKeys.all, "basic"] as const,
};

export function useBrowserRoutes(initialData?: BrowserRoute[]) {
  return useQuery({
    queryKey: routeKeys.browser(),
    queryFn: () => getBrowserRoutes(),
    initialData,
  });
}

export function useUpcomingRoutes(initialData?: UpcomingRouteData[]) {
  return useQuery({
    queryKey: routeKeys.upcoming(),
    queryFn: () => getUpcomingRoutes(),
    initialData,
  });
}

export function useBasicRoutes(initialData?: Awaited<ReturnType<typeof getRoutes>>) {
  return useQuery({
    queryKey: routeKeys.basic(),
    queryFn: () => getRoutes(),
    initialData,
  });
}

// Derived hook for wall-specific routes (filters from cached browser routes)
export function useWallRoutes(wallId: string, initialData?: BrowserRoute[]) {
  const { data: allRoutes, ...rest } = useBrowserRoutes(initialData);

  return {
    ...rest,
    data: allRoutes?.filter((r) => r.wall_id === wallId),
  };
}
