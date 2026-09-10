import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// React Router keeps the window where it was between pages, so arriving from a
// long page (the chat thread, a filled shop grid) drops you halfway down the
// next one. Only a change of pathname counts: query strings carry filters and
// session ids, and moving those must not throw the reader back to the top.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const previous = useRef(null);

  useEffect(() => {
    if (previous.current === pathname) return;
    const first = previous.current === null;
    previous.current = pathname;


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
