import HeroSection from "@/components/sections/HeroSection";
import { heroContent, chatPreview } from "@/data/home";

export default function Home() {
  const hero = heroContent;
  const chat = chatPreview;

  return (
    <HeroSection content={hero} chat={chat} onAsk={(q) => console.log(q)} />
  );
}
