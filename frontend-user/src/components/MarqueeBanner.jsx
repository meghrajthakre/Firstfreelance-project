import { useEffect, useState, useRef } from "react";
import { getBanner } from "../api/userService"; // adjust path if needed

const POLL_MS = 30_000;

export default function MarqueeBanner() {
  const [text, setText] = useState("");
  const timerRef = useRef(null);

  const fetchBanner = async () => {
    try {
      const { data } = await getBanner();
      if (data?.text) setText(data.text);
    } catch {
      // silently ignore — never crash the UI
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
        fixed top-[56px] left-0 right-0 z-40
        h-11
        dark:bg-gray-900
        overflow-hidden
        flex items-center
        justify-center
        whitespace-nowrap
        shadow-lg
        border-y border-yellow-500/30
      "
    >
    

      {/* Marquee text with yellow color */}
      <span
        className="
          inline-block
          animate-marquee
          font-['Inter'] text-[15px] font-bold
          text-yellow-500
          tracking-wide
        "
      >
        ✨ {text} ✨
      </span>
    </div>
  );
}