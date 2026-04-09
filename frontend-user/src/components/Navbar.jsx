import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCoinStore } from "../store/coinStore";
import { logoutUser } from "../api/userService";

const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "HOME",
    icon: "ri-home-4-line",
    path: "/dashboard",
  },
  {
    key: "live",
    label: "LIVE MATCH",
    icon: "ri-broadcast-line",
    path: "/dashboard/live",
  },
  { key: "logout", label: "LOGOUT", icon: "ri-shut-down-line", path: null },
];

const CoinIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "inline", verticalAlign: "middle", flexShrink: 0 }}
  >
    <style>{`
      @keyframes coinBob {
        0%,100% { transform: translateY(0px); }
        50%      { transform: translateY(-2px); }
      }
      @keyframes shineFlash {
        0%,60%,100% { opacity: 0; }
        30%          { opacity: 0.85; }
      }
      @keyframes glowPulse {
        0%,100% { filter: drop-shadow(0 0 2px #F5C51888); }
        50%      { filter: drop-shadow(0 0 6px #F5C518cc); }
      }
      .coin-root  { animation: coinBob 2s ease-in-out infinite, glowPulse 2s ease-in-out infinite; }
      .coin-shine { animation: shineFlash 2.5s ease-in-out infinite; }
    `}</style>

    <g className="coin-root">
      <ellipse cx="32" cy="60" rx="14" ry="3" fill="rgba(0,0,0,0.18)" />
      <circle cx="32" cy="32" r="26" fill="#B8860B" />
      <circle cx="32" cy="32" r="24" fill="#DAA520" />
      <circle cx="32" cy="32" r="22" fill="#F5C518" />
      <circle
        cx="32"
        cy="32"
        r="18"
        fill="none"
        stroke="#C8960C"
        strokeWidth="1.5"
      />
      {[...Array(16)].map((_, i) => {
        const angle = (i * 360) / 16;
        const rad = (angle * Math.PI) / 180;
        const x1 = 32 + 22 * Math.cos(rad);
        const y1 = 32 + 22 * Math.sin(rad);
        const x2 = 32 + 25 * Math.cos(rad);
        const y2 = 32 + 25 * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#C8960C"
            strokeWidth="1"
          />
        );
      })}
      <text
        x="32"
        y="33"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Georgia, serif"
        fontWeight="800"
        fontSize="22"
        fill="#7A5C00"
        letterSpacing="-1"
      >
        $
      </text>
      <ellipse
        cx="24"
        cy="22"
        rx="8"
        ry="4.5"
        fill="white"
        transform="rotate(-30 24 22)"
        opacity="0"
        className="coin-shine"
      />
    </g>
  </svg>
);

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const coins = useCoinStore((state) => state.coins);
  const setCoins = useCoinStore((state) => state.setCoins);

  const navigate = useNavigate();
  const location = useLocation();

  const username = user?.username ?? "Guest";
  const firstName = user?.firstName ?? "";

  const getActiveKey = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "dashboard";
    if (path === "/dashboard/live") return "live";
    return "dashboard";
  };

  const activeKey = getActiveKey();

  const handleNavClick = async (key, path) => {
    if (key === "logout") {
      try {
        await logoutUser();
      } catch {
        /* silent */
      } finally {
        logout();
        setCoins(0);
        localStorage.removeItem("token");
        navigate("/");
      }
    } else if (path) {
      navigate(path);
    }
  };

  return (
    <div className="flex flex-col">
      <div
        className="
        h-16
        bg-(--color-primary)
        shadow-[0_2px_12px_rgba(0,0,0,0.28)]
        flex items-center justify-between
        px-2 sm:px-5 border-b border-[rgba(214,228,245,0.15)]
      "
      >
        {/* ── User info ── */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Avatar circle */}
          <div
            className="
            w-8 h-8 rounded-full flex-shrink-0
            bg-[rgba(255,255,255,0.12)]
            border border-[rgba(214,228,245,0.3)]
            flex items-center justify-center
            font-rajdhani font-bold text-sm
            text-(--color-text-muted)
            uppercase
          "
          >
            {firstName.charAt(0)}
          </div>

          {/* Text block */}
          <div className="leading-tight min-w-0 font-nunito">
            {/* Username + firstname row */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="
                
                    text-[11px] sm:text-xs
                    text-[rgba(214,228,245,0.6)]
                    font-medium truncate max-w-[80px] sm:max-w-[120px]
              "
              >
                {username}
              </span>

              {firstName && (
                <>
                  <span className="text-[rgba(214,228,245,0.3)] text-xs">
                    |
                  </span>
                  <span
                    className="
                     text-xs sm:text-sm 
                text-(--color-text-muted)
                 max-w-[80px] sm:max-w-[130px]
                 tracking-wide

                  "
                  >
                    {firstName}
                  </span>
                </>
              )}
            </div>

            {/* Coins row */}
            <div className="flex items-center gap-1 mt-0.5">
              <CoinIcon />
              <span
                className="
                text-[11px] sm:text-xs
                font-semibold
                text-[#F5C518]
                tracking-wide
              "
              >
                {Number(coins).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex items-center gap-0.5 sm:gap-2">
          {NAV_ITEMS.map(({ key, label, icon, path }) => {
            const isActive = activeKey === key && key !== "logout";
            return (
              <button
                key={key}
                onClick={() => handleNavClick(key, path)}
                className={`
                  relative flex items-center justify-center
                  gap-1 sm:gap-2
                  px-2 sm:px-4
                  py-2 sm:py-1.5
                  rounded-lg
                  font-rajdhani text-xs sm:text-sm font-semibold tracking-wide
                  text-(--color-text-muted)
                  transition-all duration-150
                  cursor-pointer
                  min-w-[40px] sm:min-w-0
                  ${
                    isActive
                      ? "border border-[rgba(214,228,245,0.65)] bg-[rgba(255,255,255,0.12)] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-0.5 after:bg-(--color-accent) after:rounded-full"
                      : "border border-transparent bg-transparent hover:bg-[rgba(255,255,255,0.12)]"
                  }
                `}
              >
                <i className={`${icon} text-base sm:text-lg`} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
