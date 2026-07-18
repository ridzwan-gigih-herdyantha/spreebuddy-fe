export default function Card({
  hover = false,
  flat = false,
  className = "",
  children,
}) {
  const base = flat ? "sb-card-flat" : "sb-card";
  return (
    <div className={`${base} ${hover ? "sb-card-hover" : ""} ${className}`}>
      {children}
    </div>
  );
}
