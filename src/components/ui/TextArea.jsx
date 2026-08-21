export default function TextArea({
  id,
  label,
  error,
  help,
  rows = 4,
  className = "",
  ...rest
}) {
  return (
    <div className={className}>
      <label className="sb-field-label" htmlFor={id}>
        {label}
      </label>

      <textarea
        id={id}
        rows={rows}
        className="sb-input sb-textarea"
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error || help ? `${id}-hint` : undefined}
        {...rest}
      />

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
