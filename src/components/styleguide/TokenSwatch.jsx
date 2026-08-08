import { useState } from "react";

export default function TokenSwatch({ token }) {
  const { name, value, variable } = token;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      className="sb-swatch"
      onClick={copy}
      title={`var(${variable})`}
      aria-label={`Copy ${name} ${value}`}
    >
      <div className="sb-swatch-chip" style={{ background: value }} />
      <div className="sb-swatch-meta">
        <div className="sb-swatch-name text-truncate">{name}</div>
        <div
          className={`sb-mono ${copied ? "sb-swatch-copied" : "sb-swatch-value"}`}
        >
          {copied ? "Copied" : value}
        </div>
      </div>
    </button>
  );
}
