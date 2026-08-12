import { useState } from "react";
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

  const setText = (next) => (controlled ? onChange?.(next) : setInternal(next));

  const submit = () => {
    if (!text.trim() || disabled) return;
    onSubmit?.(text.trim());
    setText("");
  };

  return (
    <div className="sb-composer">
      <span className="sb-meta">
        <i className="bi bi-chat-dots" />
      </span>
      <input
        value={text}
        disabled={disabled}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder}
      />
      <IconButton onClick={submit} disabled={disabled} aria-label="Send">
        <i className="bi bi-arrow-up" />
      </IconButton>
    </div>
  );
}
