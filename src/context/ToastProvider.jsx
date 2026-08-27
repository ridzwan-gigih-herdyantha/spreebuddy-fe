import { useCallback, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContext } from "./toastStore";

const DURATION = 4500;
const EXIT = 220;
const MAX_VISIBLE = 3;

const ICONS = {
  success: "bi-check-circle-fill",
  error: "bi-exclamation-triangle-fill",
  info: "bi-info-circle-fill",
};

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const seq = useRef(0);

  const clearTimer = useCallback((id) => {
    const timer = timers.current.get(id);
    if (!timer) return;
    clearTimeout(timer.hide);
    clearTimeout(timer.remove);
    timers.current.delete(id);
  }, []);

  const drop = useCallback(
    (id) => {
      setToasts((list) => list.filter((toast) => toast.id !== id));
      clearTimer(id);
    },
    [clearTimer],
  );

  const dismiss = useCallback(
    (id) => {
      setToasts((list) =>
        list.map((toast) =>
          toast.id === id ? { ...toast, leaving: true } : toast,
        ),
      );
      clearTimer(id);
      timers.current.set(id, {
        hide: null,
        remove: setTimeout(() => drop(id), EXIT),
      });
    },
    [clearTimer, drop],
  );

  const schedule = useCallback(
    (id, duration) => {
      clearTimer(id);
      timers.current.set(id, {
        hide: setTimeout(() => dismiss(id), duration),
        remove: null,
      });
    },
    [clearTimer, dismiss],
  );

  const show = useCallback(
    (tone, message, options = {}) => {
      if (!message) return null;
      const duration = options.duration ?? DURATION;

      let id = null;

      setToasts((list) => {
        // Repeating the same message bumps a counter instead of stacking.
        const last = list.at(-1);
        if (
          last &&
          !last.leaving &&
          last.tone === tone &&
          last.message === message
        ) {
          id = last.id;
          return list.map((toast) =>
            toast.id === last.id
              ? { ...toast, count: (toast.count ?? 1) + 1 }
              : toast,
          );
        }

        seq.current += 1;
        id = seq.current;

        const next = [
          ...list,
          {
            id,
            tone,
            message,
            title: options.title,
            action: options.action,
            count: 1,
            leaving: false,
          },
        ];

        // Oldest ones go rather than growing past the viewport.
        const overflow = next.length - MAX_VISIBLE;
        if (overflow > 0) {
          next.slice(0, overflow).forEach((toast) => clearTimer(toast.id));
          return next.slice(overflow);
        }
        return next;
      });

      if (id !== null) schedule(id, duration);
      return id;
    },
    [clearTimer, schedule],
  );

  const value = useMemo(
    () => ({
      show,
      dismiss,
      success: (message, options) => show("success", message, options),
      error: (message, options) => show("error", message, options),
      info: (message, options) => show("info", message, options),
    }),
    [show, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className="sb-toasts"
        data-count={toasts.length}
        role="region"
        aria-label="Notifications"
      >
        {/* Newest first so it sits at the front of the stack. */}
        {[...toasts]
          .reverse()
          .map(
            ({ id, tone, title, message, action, count, leaving }, depth) => (
              <div
                key={id}
                className={`sb-toast is-${tone} ${leaving ? "is-leaving" : ""}`}
                data-depth={depth}
                style={{ "--depth": depth }}
                role={tone === "error" ? "alert" : "status"}
              >
                <i
                  className={`bi ${ICONS[tone] ?? ICONS.info} sb-toast-icon`}
                />

                <div className="min-w-0 flex-grow-1">
                  {title && <div className="sb-toast-title">{title}</div>}

                  <p className="sb-toast-message mb-0">
                    {message}
                    {count > 1 && (
                      <span className="sb-toast-count">×{count}</span>
                    )}
                  </p>

                  {action?.to && (
                    <Link
                      to={action.to}
                      className="sb-toast-action"
                      onClick={() => dismiss(id)}
                    >
                      {action.label} <i className="bi bi-arrow-right" />
                    </Link>
                  )}
                </div>

                <button
                  type="button"
                  className="sb-toast-close"
                  aria-label="Dismiss notification"
                  onClick={() => dismiss(id)}
                >
                  <i className="bi bi-x-lg" />
                </button>
              </div>
            ),
          )}
      </div>
    </ToastContext.Provider>
  );
}
