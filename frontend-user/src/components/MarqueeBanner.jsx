import { useEffect, useState, useRef } from "react";
import { getBanner } from "../api/userService";

const POLL_MS = 30_000;

export default function MarqueeBanner() {
  const [text, setText] = useState("");
  const timerRef = useRef(null);

  const fetchBanner = async () => {
    try {
      const { data } = await getBanner();
      if (data?.text) setText(data.text);
    } catch {
      // silently ignore
    }
  };

  useEffect(() => {
    fetchBanner();
    timerRef.current = setInterval(fetchBanner, POLL_MS);
    return () => clearInterval(timerRef.current);
  }, []);

  if (!text) return null;

  return (
    <div
      className="
        relative left-0 right-0 z-40
        h-8
        bg-(--color-primary)
        border-b border-[rgba(214,228,245,0.15)]
        overflow-hidden
        flex items-center
      "
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="
            inline-flex items-center gap-3
            px-8
            font-rajdhani text-sm font-semibold tracking-widest uppercase
            text-(--color-text-muted)
          ">
            <span className="text-(--color-accent)">★</span>
            {text}
            <span className="text-(--color-accent)">★</span>
          </span>
        ))}
      </div>
    </div>
  );
}