import HeroSection from "@/components/sections/HeroSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import { heroContent, chatPreview, featuredProducts } from "@/data/home";

export default function Home() {
  const hero = heroContent;
  const chat = chatPreview;

  return (
    <>
      <HeroSection content={hero} chat={chat} onAsk={(q) => console.log(q)} />
      <FeaturedProducts data={featuredProducts} onAdd={(p) => console.log(p)} />
    </>
  );
}
