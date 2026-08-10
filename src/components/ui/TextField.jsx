export default function TextField({
  id,
  label,
  error,
  help,
  trailing,
  className = "",
  ...rest
}) {
  return (
    <div className={className}>
      <label className="sb-field-label" htmlFor={id}>
        {label}
      </label>

      <div className="sb-input-wrap">
        <input
          id={id}
          className={`sb-input ${trailing ? "sb-input-trailing" : ""}`}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error || help ? `${id}-hint` : undefined}
          {...rest}
        />
        {trailing}
      </div>

      {(error || help) && (
        <p
          id={`${id}-hint`}
          className={error ? "sb-field-error" : "sb-field-help"}
        >
          {error || help}
        </p>
      )}
    </div>
  );
}
