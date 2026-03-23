import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileBarChart2,
  Swords,
  Dices,
  Trophy,
  Radio,
  KeyRound,
  Settings,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard",         to: "/superadmin/dashboard",         icon: LayoutDashboard },
  { label: "Admins",            to: "/superadmin/admins",            icon: Users },
  { label: "Collection Report", to: "/superadmin/collection-report", icon: FileBarChart2 },
  { label: "Matches",           to: "/superadmin/matches",           icon: Swords },
  { label: "Cup Rates",         to: "/superadmin/cup-rates",         icon: Trophy },
  { label: "In Play Bet Fair",  to: "/superadmin/in-play-bet-fair",  icon: Radio },
  { label: "Change Password",   to: "/superadmin/change-password",   icon: KeyRound },
  { label: "Settings",          to: "/superadmin/settings",          icon: Settings },
];

const SIDEBAR_BG = "#2E4151";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  return (
    <>
      {/*
        ── Mobile / tablet overlay ──────────────────────────────────────────────
        Shown only when drawer is open on screens < lg
      */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/*
        ── Sidebar ──────────────────────────────────────────────────────────────
        Mobile  (<lg): fixed drawer, slides in/out
        Desktop (lg+): static column, always visible, stretches full height
      */}
      <aside
        className={[
          // ── shared ──
          "flex flex-col z-30 shrink-0",
          "transition-transform duration-300 ease-in-out",

          // ── mobile: fixed drawer ──
          "fixed left-0 top-[55px] h-[calc(100vh-55px)]",

          // ── desktop: static in flex row ──
          "lg:static lg:top-auto lg:h-auto lg:self-stretch lg:translate-x-0",

          // ── slide toggle (only relevant on mobile) ──
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
        style={{
          width: "224px",
          minWidth: "224px",
          backgroundColor: SIDEBAR_BG,
          borderRight: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              {({ isActive }) => (
                <span
                  className={[
                    "group flex items-center gap-3 px-3 py-4 rounded-md relative",
                    "transition-all duration-200 cursor-pointer select-none text-sm",
                    isActive
                      ? "bg-white/15 text-white font-bold"
                      : "text-white/75 font-semibold hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  {/* Active left bar */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                      style={{
                        width: "3px",
                        height: "60%",
                        backgroundColor: "#90B4D4",
                      }}
                    />
                  )}
                  <Icon
                    size={17}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className="shrink-0"
                    style={{ color: isActive ? "#ffffff" : "rgba(255,255,255,0.6)" }}
                  />
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div
          className="px-3 pb-4 pt-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold
                       text-white/75 hover:bg-white/10 hover:text-white
                       transition-all duration-200"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            <LogOut size={17} strokeWidth={1.8} style={{ color: "rgba(255,255,255,0.6)" }} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}