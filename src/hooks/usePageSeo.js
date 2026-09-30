import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { applyPageSeo } from "@/utils/seo";

// Pages whose metadata depends on loaded data pass `null` until it arrives, so
// the route defaults stay in place rather than flashing an empty title.
export function usePageSeo(entry) {
  const { pathname } = useLocation();
  const serialized = JSON.stringify(entry ?? null);

  useEffect(() => {
    const value = JSON.parse(serialized);
    if (value) applyPageSeo(pathname, value);
  }, [pathname, serialized]);
}
