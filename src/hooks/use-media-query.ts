import { useSyncExternalStore } from "react";

/**
 * Custom hook to detect media query matches using React's useSyncExternalStore.
 * Highly optimized, server-safe, and avoids synchronous effect state cascades.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false // Server-side rendering (SSR) fallback
  );
}
