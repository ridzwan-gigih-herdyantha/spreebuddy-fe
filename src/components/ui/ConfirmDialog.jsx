import { useEffect } from "react";

export default function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  pending,
  error,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onCancel?.();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="sb-modal-backdrop" onMouseDown={onCancel}>
      <div
        className="sb-modal"
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span className="sb-modal-icon">
          <i className="bi bi-exclamation-triangle" />
        </span>

        <h2 className="sb-h3 mb-2">{title}</h2>
        <div className="sb-lead sb-modal-body">{body}</div>

        {error && (
          <p className="sb-form-error mt-3 mb-0" role="alert">
            <i className="bi bi-exclamation-triangle-fill" /> {error}
          </p>
        )}

        <div className="sb-modal-actions">
          <button
            type="button"
            className="sb-pill sb-pill-outline"
            disabled={pending}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="sb-pill sb-pill-danger"
            disabled={pending}
            onClick={onConfirm}
          >
            {pending ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
