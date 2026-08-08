import CtaBanner from "@/components/ui/CtaBanner";
import { footerBannerCTA } from "@/data/home";

export default function CtaFooter({ data = footerBannerCTA }) {
  return (
    <section className="sb-section sb-surface sb-subtle">
      <CtaBanner data={data} className="sb-shadow-lg" />
    </section>
  );
}
