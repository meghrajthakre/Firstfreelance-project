import React from 'react';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'HOME',       icon: 'ri-home-4-line'    },
  { key: 'live',      label: 'LIVE MATCH', icon: 'ri-broadcast-line' },
  { key: 'logout',    label: 'LOGOUT',     icon: 'ri-shut-down-line' },
];

const Navbar = ({ username, coins, activePage, go }) => {
  return (
    <header className="
        fixed top-0 left-0 right-0 z-50
        h-16
        bg-(--color-primary)
        shadow-[0_2px_12px_rgba(0,0,0,0.28)]
        flex items-center justify-between
        px-3 sm:px-5
      ">

      <div className="text-(--color-text-muted) leading-tight font-nunito">
        <p className="text-xs sm:text-sm font-bold truncate max-w-[120px] sm:max-w-none">
          {username}
        </p>

        <p className="text-[11px] sm:text-xs">
          Coins : {coins}
        </p>
      </div>

      <nav className="flex items-center gap-1 sm:gap-2">
        {NAV_ITEMS.map(({ key, label, icon }) => {
          const isActive = activePage === key && key !== 'logout';

          return (
            <button
              key={key}
              onClick={() => go(key)}
              className={`
                flex items-center gap-1 sm:gap-2
                px-2 sm:px-4
                py-1 sm:py-1.5
                rounded-lg
                font-rajdhani text-xs sm:text-sm font-semibold tracking-wide
                text-(--color-text-muted)
                transition-colors duration-150
                cursor-pointer

                ${isActive
                  ? 'border border-[rgba(214,228,245,0.65)] bg-[rgba(255,255,255,0.12)]'
                  : 'border border-transparent bg-transparent hover:bg-[rgba(255,255,255,0.12)]'
                }
              `}
            >
              <i className={`${icon} text-base sm:text-lg`} />

              <span className="hidden sm:inline max-[400px]:hidden">
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