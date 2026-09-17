import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { rememberRoute } from "@/utils/routeHistory";
import { applyRouteSeo } from "@/utils/seo";

// Per-navigation housekeeping: record where the visitor came from, set the
// page's title and metadata, and reset the scroll. Only a change of pathname
// counts — query strings carry filters and session ids, and moving those must
// not throw the reader back to the top.
export default function RouteEffects() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const previous = useRef(null);

  useEffect(() => {
    if (previous.current === pathname) return;
    const first = previous.current === null;
    previous.current = pathname;

    rememberRoute(pathname);
    applyRouteSeo(pathname);

    if (first || navigationType === "POP") return;

    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }

    window.scrollTo(0, 0);
  }, [pathname, hash, navigationType]);

  return null;
}
