import { useEffect, useState } from "react";
import { thinkingWords } from "@/data/chatPage";

export default function Thinking() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((value) => (value + 1) % thinkingWords.length),
      1600,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="sb-pill sb-pill-outline sb-thinking">
      {thinkingWords[index]}
      <span className="sb-thinking-dots">
        <i />
        <i />
        <i />
      </span>
    </span>
  );
}
