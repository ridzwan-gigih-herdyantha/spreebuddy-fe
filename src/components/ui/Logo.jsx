import { StarIcon } from "@/components/icons";

export default function Logo({ withText = true }) {
  return (
    <span className="d-inline-flex align-items-center gap-2">
      <StarIcon width={28} height={28} className="text-primary" />
      {withText && <span className="sb-brand-text">SpreeBuddy</span>}
    </span>
  );
}
