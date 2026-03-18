import React from 'react';
import { useNavigate } from 'react-router-dom';

/*
  ── Required in index.html <head> ─────────────────────────────────────────────
  <link href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />

  ── Required in index.css (Tailwind v4) ───────────────────────────────────────
  @theme {
    --font-rajdhani: 'Rajdhani', sans-serif;
    --font-nunito:   'Nunito',   sans-serif;
    --color-primary:           #1E3A5F;
    --color-primary-light:     #2E5080;
    --color-banner:            #4B75B8;
    --color-bg-main:           #E8EDF3;
    --color-btn-bg:            #2B4A7A;
    --color-btn-border:        #3A6298;
    --color-btn-hover:         #3558A0;
    --color-text-muted:        #D6E4F5;
    --color-text-dark:         #1A2B3C;
  }

  @keyframes marquee {
    from { transform: translateX(100vw);  }
    to   { transform: translateX(-100%); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  @utility animate-marquee {
    animation: marquee 30s linear infinite;
  }
  @utility animate-fade-up {
    animation: fadeUp 0.35s ease forwards;
  }
  ─────────────────────────────────────────────────────────────────────────────── */

const MENU_ITEMS = [
  { label: 'LIVE MATCH',    icon: 'ri-broadcast-line',      key: 'live'          },
  { label: 'RULES',         icon: 'ri-information-line',    key: 'rules'         },
  { label: 'LEDGER',        icon: 'ri-file-list-3-line',    key: 'ledger'        },
  { label: 'PASSWORD',      icon: 'ri-lock-password-line',  key: 'password'      },
  { label: 'UPCOMING',      icon: 'ri-calendar-event-line', key: 'upcoming'      },
  { label: 'ENTERTAINMENT', icon: 'ri-gamepad-line',        key: 'entertainment' },
  { label: 'SETTINGS',      icon: 'ri-settings-3-line',     key: 'settings'      },
  { label: 'TOURNAMENT',    icon: 'ri-trophy-line',         key: 'tournament'    },
];

const NAV_ITEMS = [
  { key: 'dashboard', label: 'HOME',       icon: 'ri-home-4-line'    },
  { key: 'live',      label: 'LIVE MATCH', icon: 'ri-broadcast-line' },
  { key: 'logout',    label: 'LOGOUT',     icon: 'ri-shut-down-line' },
];


const UserDashboard = ({
  username   = 'SPU1775 (Abhi cutt)',
  coins      = 82.0,
  activePage = 'dashboard',
  onNavigate,
}) => {
  const navigate = useNavigate();

  const go = (key) => {
    onNavigate?.(key);
    if (key !== 'logout') navigate(`/${key}`);
  };

  return (
    <div className="min-h-screen bg-(--color-bg-main) font-nunito">

      {/* HEADER — now with responsive padding and nav scaling */}
      <header className="
        fixed top-0 left-0 right-0 z-50
        h-16
        bg-(--color-primary)
        shadow-[0_2px_12px_rgba(0,0,0,0.28)]
        flex items-center justify-between
        px-3 sm:px-5   /* reduce side padding on mobile */
      ">
        {/* Left — username + coins (adjust font size on small screens) */}
        <div className="text-(--color-text-muted) leading-tight font-nunito">
          <p className="text-xs sm:text-sm font-bold truncate max-w-[120px] sm:max-w-none">
            {username}
          </p>
          <p className="text-[11px] sm:text-xs">Coins : {coins.toFixed(1)}</p>
        </div>

        {/* Right — nav buttons: shrink padding/gap on mobile, hide text on smallest? 
            We keep text but reduce font size and padding. */}
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
                <i className={`${icon} text-base sm:text-lg`} aria-hidden="true" />
                {/* Hide label on very small screens (below 400px) via custom media query?
                    Instead, we use `max-[400px]:hidden` – Tailwind doesn't have that by default,
                    but we can use an arbitrary value. */}
                <span className="hidden sm:inline max-[400px]:hidden">
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* BANNER — unchanged */}
      <div className="
        fixed top-16 left-0 right-0 z-40
        h-9
        bg-(--color-banner)
        overflow-hidden
        flex items-center
        whitespace-nowrap
      ">
        <span className="
          inline-block
          animate-marquee
          font-nunito text-[13.5px] font-bold
          text-(--color-text-muted)
        ">
          ‖ WELCOME TO Sonu Book GROUP ‖&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          Jo Group bets Karte he unke Profit ke Saude hataye jayenge
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;‖ WELCOME TO NICE BSF GROUP ‖&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          Jo Group bets Karte he unke Profit ke Saude hataye jayenge
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      </div>

      {/* MAIN — adjust top padding and side padding on mobile */}
      <main className="pt-[120px] pb-16 px-3 sm:px-5">
        <div className="max-w-[740px] mx-auto">

          {/* 2-column grid — already responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
            {MENU_ITEMS.map(({ label, icon, key }, idx) => (
              <button
                key={key}
                onClick={() => go(key)}
                className={`
                  flex items-center gap-4
                  w-full
                  px-4 sm:px-6 py-[14px] sm:py-[18px]  /* adjust padding on mobile */
                  rounded-[14px]
                  border-2 border-(--color-btn-border)
                  bg-(--color-btn-bg)
                  text-(--color-text-muted)
                  font-rajdhani text-[15px] sm:text-[17px] font-bold tracking-widest uppercase
                  shadow-[0_8px_32px_rgba(0,0,0,0.18)]
                  cursor-pointer
                  transition-all duration-150
                  hover:bg-(--color-btn-hover)
                  hover:-translate-y-0.5
                  hover:shadow-[0_6px_20px_rgba(30,58,95,0.26)]
                  active:translate-y-0
                  opacity-0 animate-fade-up
                  
                `}
              >
                <i className={`${icon} text-[22px] sm:text-[26px] shrink-0`} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

        </div>
      </main>

    </div>
  );
};

export default UserDashboard;