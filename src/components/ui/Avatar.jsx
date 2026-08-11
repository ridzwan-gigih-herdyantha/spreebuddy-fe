export default function Avatar({ name = "?", src, title, className = "" }) {
  const initial = name.trim().charAt(0).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={title ?? name}
        className={`sb-avatar rounded-circle flex-shrink-0 sb-avatar-img ${className}`}
      />
    );
  }

  return (
    <div
      className={`sb-gradient sb-avatar text-white rounded-circle align-items-center justify-content-center fw-semibold flex-shrink-0 d-flex ${className}`}
      title={title ?? name}
    >
      {initial}
    </div>
  );
}
