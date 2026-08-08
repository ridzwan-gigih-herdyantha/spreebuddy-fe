export default function Card({
  hover = false,
  flat = false,
  className = "",
  children,
  ...rest
}) {
  const base = flat ? "sb-card-flat" : "sb-card";
  return (
    <div
      className={`${base} ${hover ? "sb-card-hover" : ""} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
