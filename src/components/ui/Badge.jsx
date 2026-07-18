export default function Badge({
  variant = "primary",
  children,
  className = "",
}) {
  const cls = {
    primary: "sb-pill",
    outline: "sb-pill sb-pill-outline",
    success: "sb-pill sb-pill-success",
  }[variant];
  return <span className={`${cls} ${className}`}>{children}</span>;
}
