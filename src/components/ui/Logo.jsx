import { StarIcon } from "@/components/icons";

export default function Logo({ withText = true }) {
  return (
    <span className="d-inline-flex align-items-center gap-2">
      <span className="sb-logo-badge d-inline-flex align-items-center justify-content-center flex-shrink-0">
        <StarIcon width={18} height={18} />
      </span>
      {withText && <span className="sb-brand-text">SpreeBuddy</span>}
    </span>
  );
}
