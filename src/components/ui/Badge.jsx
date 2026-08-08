const VARIANTS = {
  primary: "sb-pill",
  outline: "sb-pill sb-pill-outline",
  success: "sb-pill sb-pill-success",
  gradient: "sb-pill sb-pill-gradient",
};

export default function Badge({
  variant = "primary",
  children,
  className = "",
}) {
  const cls = VARIANTS[variant] ?? VARIANTS.primary;
  return <span className={`${cls} ${className}`}>{children}</span>;
}
