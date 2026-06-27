import { useEffect, useState } from "react";

/**
 * Hook to determine if the component has mounted on the client.
 * Decouples state setting from the synchronous render/effect execution to prevent cascades.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let active = true;
    
    // Defer setting state to post-mount frame
    requestAnimationFrame(() => {
      if (active) {
        setMounted(true);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return mounted;
}
