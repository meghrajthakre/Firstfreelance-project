import { useEffect, useState, useRef } from "react";
import { getBanner } from "../api/userService";

const POLL_MS = 30000;

export default function MarqueeBanner() {
  const [text, setText] = useState("");
  const timerRef = useRef(null);

  const fetchBanner = async () => {
    try {
      const { data } = await getBanner();
      if (data?.text) setText(data.text);
    } catch {
      // ignore error
    }
  };

  useEffect(() => {
    fetchBanner();
    timerRef.current = setInterval(fetchBanner, POLL_MS);
    return () => clearInterval(timerRef.current);
  }, []);

  // Optional loader (better UX on mobile)
  if (!text) {
    return (
      <div className="h-8 flex items-center px-4 text-xs text-gray-400 bg-[var(--color-primary)]">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full h-8 bg-[var(--color-primary)] border-b border-[rgba(214,228,245,0.15)] overflow-hidden flex items-center">
      
      {/* OUTER WRAPPER */}
      <div className="relative w-full overflow-hidden">
        
        {/* SCROLL TRACK */}
        <div className="flex animate-marquee">
          
          {/* Repeat more times for seamless loop */}
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="
                flex items-center gap-3
                px-6 sm:px-10
                whitespace-nowrap
                font-rajdhani
                text-xs sm:text-sm
                font-semibold
                tracking-widest
                uppercase
                text-[var(--color-text-muted)]
              "
            >
              <span className="text-[var(--color-accent)]">★</span>
              {text}
              <span className="text-[var(--color-accent)]">★</span>
            </span>
          ))}

        </div>
      </div>
    </div>
  );
}