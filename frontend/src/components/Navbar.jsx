import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useCoinStore } from '../store/coinStore';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'HOME',       icon: 'ri-home-4-line'    },
  { key: 'live',      label: 'LIVE MATCH', icon: 'ri-broadcast-line' },
  { key: 'logout',    label: 'LOGOUT',     icon: 'ri-shut-down-line' },
];

const Navbar = ({ activePage, go }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const coins = useCoinStore((state) => state.coins);

  const username = user?.username ?? 'Guest';

  const handleNavClick = (key) => {
    if (key === 'logout') {
      logout();
      // Optionally redirect after logout
      // go('login');
    } else {
      go(key);
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

      {/* User info – responsive truncation */}
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
        <p className="text-[11px] sm:text-xs">
          Coins: {coins}
        </p>
      </div>

      {/* Navigation – improved touch targets and active state */}
      <nav className="flex items-center gap-0.5 sm:gap-2">
        {NAV_ITEMS.map(({ key, label, icon }) => {
          const isActive = activePage === key && key !== 'logout';

          return (
            <button
              key={key}
              onClick={() => handleNavClick(key)}
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
                min-w-[40px] sm:min-w-0  // ensure minimum touch area on mobile
                ${isActive
                  ? 'border border-[rgba(214,228,245,0.65)] bg-[rgba(255,255,255,0.12)] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-0.5 after:bg-(--color-accent) after:rounded-full'
                  : 'border border-transparent bg-transparent hover:bg-[rgba(255,255,255,0.12)]'
                }
              `}
            >
              <i className={`${icon} text-base sm:text-lg`} />
              <span className="hidden sm:inline">
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};

export default Navbar;