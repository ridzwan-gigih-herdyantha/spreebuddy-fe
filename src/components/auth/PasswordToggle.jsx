export default function PasswordToggle({ visible, onToggle }) {
  return (
    <button
      type="button"
      className="sb-input-toggle"
      onClick={onToggle}
      aria-label={visible ? "Hide password" : "Show password"}
    >
      <i className={`bi ${visible ? "bi-eye" : "bi-eye-slash"}`} />
    </button>
  );
}
