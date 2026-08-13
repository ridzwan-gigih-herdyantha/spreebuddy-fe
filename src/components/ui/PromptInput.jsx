import { useEffect, useRef, useState } from "react";
import IconButton from "@/components/ui/IconButton";

export default function PromptInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled,
}) {
  const [internal, setInternal] = useState("");
  const controlled = value !== undefined;
  const text = controlled ? value : internal;
  const ref = useRef(null);

  const setText = (next) => (controlled ? onChange?.(next) : setInternal(next));

  // Grow with the content until CSS max-height takes over and it scrolls.
  useEffect(() => {
    const field = ref.current;
    if (!field) return;
    field.style.height = "auto";
    field.style.height = `${field.scrollHeight}px`;
  }, [text]);

  const submit = () => {
    if (!text.trim() || disabled) return;
    onSubmit?.(text.trim());
    setText("");
  };

  return (
    <div className="sb-composer">
      <textarea
        ref={ref}
        rows={1}
        value={text}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
      />

      <div className="sb-composer-actions">
        <span className="sb-caption">
          Enter to send, Shift + Enter for a new line
        </span>

        <IconButton onClick={submit} disabled={disabled} aria-label="Send">
          <i className="bi bi-arrow-up" />
        </IconButton>
      </div>
    </div>
  );
}
