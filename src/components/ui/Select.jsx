import { useEffect, useRef, useState } from "react";

export default function Select({
  label,
  value,
  options,
  onChange,
  placeholder,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((option) => option.id === value);

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

  return (
    <div className={`sb-select ${className}`} data-open={open} ref={ref}>
      {label && <span className="sb-meta">{label}</span>}

      <button
        type="button"
        className="sb-select-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((state) => !state)}
      >
        <span
          className={`text-truncate ${selected ? "" : "sb-select-placeholder"}`}
        >
          {selected?.label ?? placeholder}
        </span>
        <i className="bi bi-chevron-down" />
      </button>

      {open && (
        <div className="sb-select-menu" role="menu">
          {options.map(({ id, label: optionLabel }) => (
            <button
              key={id}
              type="button"
              role="menuitemradio"
              aria-checked={id === value}
              className={`sb-select-option ${id === value ? "is-selected" : ""}`}
              onClick={() => {
                onChange(id);
                setOpen(false);
              }}
            >
              {optionLabel}
              {id === value && <i className="bi bi-check2" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
