import Badge from "@/components/ui/Badge";

export default function GradientBadge({ children, className = "" }) {
  return (
    <Badge variant="gradient" className={className}>
      {children}
    </Badge>
  );
}
