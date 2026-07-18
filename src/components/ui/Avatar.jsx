export default function Avatar({ name = "?", title, className = "" }) {
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <div
      className={`sb-gradient sb-avatar text-white rounded-circle align-items-center justify-content-center fw-semibold flex-shrink-0 d-flex ${className}`}
      title={title ?? name}
    >
      {initial}
    </div>
  );
}
