import { useEffect, useState } from "react";

export default function AvatarField({
  id,
  label,
  help,
  error,
  file,
  onClear,
  ...rest
}) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div>
      <span className="sb-field-label">{label}</span>

      <div className="sb-avatar-field">
        <span className="sb-avatar-preview">
          {preview ? (
            <img src={preview} alt="" />
          ) : (
            <i className="bi bi-person-fill" />
          )}
        </span>

        <div className="min-w-0">
          <label htmlFor={id} className="btn sb-btn-outline rounded-pill px-3">
            {file ? "Change image" : "Upload image"}
          </label>
          <input
            id={id}
            type="file"
            className="sb-visually-hidden"
            accept="image/jpeg,image/png,image/webp,image/gif"
            {...rest}
          />

          {file && (
            <button
              type="button"
              className="btn btn-link sb-avatar-clear"
              onClick={onClear}
            >
              Remove
            </button>
          )}

          <p className="sb-field-help text-truncate">{file?.name || help}</p>
        </div>
      </div>

      {error && <p className="sb-field-error">{error}</p>}
    </div>
  );
}
