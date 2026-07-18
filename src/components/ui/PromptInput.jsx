import { useState } from "react";
import IconButton from "@/components/ui/IconButton";

export default function PromptInput({ onSubmit, placeholder }) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim()) return;
    onSubmit?.(value.trim());
    setValue("");
  };

  return (
    <div className="sb-composer">
      <span className="sb-meta">
        <i className="bi bi-chat-dots" />
      </span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder}
      />
      <IconButton onClick={submit} aria-label="Send">
        <i className="bi bi-arrow-up" />
      </IconButton>
    </div>
  );
}
