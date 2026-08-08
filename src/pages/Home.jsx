import HeroSection from "@/components/sections/HeroSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import HowItWorks from "@/components/sections/HowItWorks";
import {
  heroContent,
  chatPreview,
  featuredProducts,
  howItWorks,
  footerBannerCTA,
} from "@/data/home";
import CtaFooter from "@/components/sections/CtaFooter";

export default function Home() {
  return (
    <>
      <HeroSection
        content={heroContent}
        chat={chatPreview}
        onAsk={(q) => console.log(q)}
      />

      <FeaturedProducts data={featuredProducts} onAdd={(p) => console.log(p)} />

      <HowItWorks data={howItWorks} />

      <CtaFooter data={footerBannerCTA} />
    </>
  );
}
