import { useEffect, useRef, useState } from "react";

// An empty thread has room to show the openers outright; once a conversation is
// running they would compete with it, so they fold into a menu instead.
export default function QuickReplies({
  replies,
  label,
  collapsed,
  disabled,
  onPick,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;

    const close = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (replies.length === 0) return null;

  if (!collapsed) {
    return (
      <div className="d-flex flex-wrap gap-2 mb-3">
        {replies.map((reply) => (
          <button
            key={reply}
            type="button"
            className="sb-pill sb-pill-outline"
            disabled={disabled}
            onClick={() => onPick(reply)}
          >
            {reply}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="sb-select sb-quickchat mb-3" data-open={open} ref={ref}>
      <button
        type="button"
        className="sb-select-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((state) => !state)}
      >
        <i className="bi bi-lightning-charge" />
        <span className="flex-grow-1 text-start">{label}</span>
        <i className="bi bi-chevron-down sb-select-caret" />
      </button>

      {open && (
        <div className="sb-select-menu" role="menu">
          {replies.map((reply) => (
            <button
              key={reply}
              type="button"
              role="menuitem"
              className="sb-select-option"
              onClick={() => {
                setOpen(false);
                onPick(reply);
              }}
            >
              {reply}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
