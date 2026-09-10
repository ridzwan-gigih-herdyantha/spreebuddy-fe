// The page a visitor came from, kept outside React because nothing needs to
// re-render when it changes — only the chat page reads it, once, on arrival.
let previous = null;
let current = null;

export function rememberRoute(pathname) {
  if (pathname === current) return;
  previous = current;
  current = pathname;
}

// Takes the caller's own path so the answer does not depend on whether the
// tracker has caught up yet: on the first render of a new page `current` is
// still the page being left, and after the effect runs it is the new one.
export const previousRoute = (pathname) =>
  current && current !== pathname ? current : previous;
