import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCoinStore } from '../store/coinStore';
import { logoutUser } from '../api/userService';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'HOME',       icon: 'ri-home-4-line',    path: '/dashboard' },
  { key: 'live',      label: 'LIVE MATCH', icon: 'ri-broadcast-line', path: '/dashboard/live' },
  { key: 'logout',    label: 'LOGOUT',     icon: 'ri-shut-down-line', path: null },
];

const CoinIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}
  >
    <style>{`
      @keyframes coinBob {
        0%,100% { transform: translateY(0px); }
        50%      { transform: translateY(-3px); }
      }
      @keyframes shineFlash {
        0%,100% { opacity: 0.72; }
        50%      { opacity: 0.2; }
      }
      .coin-g     { animation: coinBob    2.2s ease-in-out infinite; }
      .coin-shine { animation: shineFlash 2.2s ease-in-out infinite; }
    `}</style>
    <g className="coin-g">
      {/* depth edge */}
      <ellipse cx="32" cy="35" rx="26" ry="26" fill="#C8960C"/>
      {/* face rings */}
      <circle cx="32" cy="32" r="26" fill="#F5C518"/>
      <circle cx="32" cy="32" r="22" fill="#F0B800"/>
      <circle cx="32" cy="32" r="20" fill="#F7D23E"/>
      <circle cx="32" cy="32" r="18" fill="#F0B800"/>
      {/* $ */}
      <text
        x="33" y="37"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Georgia, serif"
        fontWeight="700"
        fontSize="20"
        fill="#9A7000"
      >$</text>
      {/* shine */}
      <ellipse
        cx="22" cy="22" rx="7" ry="4"
        fill="#FFF8C0"
        transform="rotate(-20 22 22)"
        className="coin-shine"
      />
    </g>
  </svg>
);

const Navbar = () => {
  const user     = useAuthStore((state) => state.user);
  const logout   = useAuthStore((state) => state.logout);
  const coins    = useCoinStore((state) => state.coins);
  const setCoins = useCoinStore((state) => state.setCoins);

  const navigate = useNavigate();
  const location = useLocation();

  const username = user?.username ?? 'Guest';

  const getActiveKey = () => {
    const path = location.pathname;
    if (path === '/dashboard')      return 'dashboard';
    if (path === '/dashboard/live') return 'live';
    return 'dashboard';
  };

  const activeKey = getActiveKey();

  const handleNavClick = async (key, path) => {
  if (key === 'logout') {
    try {
      await logoutUser(); // clears the cookie on the server
    } catch {
      // silent fail — still clear local state
    } finally {
      logout();
      setCoins(0);
      localStorage.removeItem("token");
      navigate('/');
    }
  } else if (path) {
    navigate(path);
  }
};

  return (
    <header className="
      fixed top-0 left-0 right-0 z-50
      h-16
      bg-(--color-primary)
      shadow-[0_2px_12px_rgba(0,0,0,0.28)]
      flex items-center justify-between
      px-2 sm:px-5
    ">
      {/* User info */}
      <div className="
        text-(--color-text-muted) leading-tight font-nunito
        min-w-0 flex-shrink
      ">
        <p className="
          text-xs sm:text-sm font-bold
          truncate max-w-[100px] xs:max-w-[150px] sm:max-w-none
        ">
          {username}
        </p>
        <p className="text-[11px] sm:text-xs flex items-center gap-1">
          <CoinIcon />
          {Number(coins).toLocaleString()}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-0.5 sm:gap-2">
        {NAV_ITEMS.map(({ key, label, icon, path }) => {
          const isActive = activeKey === key && key !== 'logout';

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
                ${isActive
                  ? 'border border-[rgba(214,228,245,0.65)] bg-[rgba(255,255,255,0.12)] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-0.5 after:bg-(--color-accent) after:rounded-full'
                  : 'border border-transparent bg-transparent hover:bg-[rgba(255,255,255,0.12)]'
                }
              `}
            >
              <i className={`${icon} text-base sm:text-lg`} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};

export default Navbar;  