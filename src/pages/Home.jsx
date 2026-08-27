import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import HowItWorks from "@/components/sections/HowItWorks";
import CtaFooter from "@/components/sections/CtaFooter";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import {
  heroContent,
  chatPreview,
  featuredProducts,
  howItWorks,
  footerBannerCTA,
} from "@/data/home";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem, busyOf } = useCart();
  const toast = useToast();

  const ask = (question) => {
    const text = question?.trim();
    if (!text) return;

    if (!user) {
      toast.info(heroContent.signInToAsk);
      navigate("/login");
      return;
    }

    navigate(`/chat?ask=${encodeURIComponent(text)}`);
  };

  const add = (product) => {
    if (!user) {
      toast.info(featuredProducts.signInToAdd);
      navigate("/login");
      return;
    }
    addItem(product);
  };

  return (
    <>
      <HeroSection content={heroContent} chat={chatPreview} onAsk={ask} />

      <FeaturedProducts data={featuredProducts} onAdd={add} busyOf={busyOf} />

      <HowItWorks data={howItWorks} />

      <CtaFooter data={footerBannerCTA} />
    </>
  );
}
