import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileBarChart2,
  Swords,
  Radio,
  KeyRound,
  Settings,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard",          to: "/superadmin/dashboard",         icon: LayoutDashboard },
  { label: "Admins",             to: "/superadmin/admins",            icon: Users },
  { label: "Collection Report",  to: "/superadmin/collection-report", icon: FileBarChart2 },
  { label: "Matches",            to: "/superadmin/matches",           icon: Swords },
  { label: "In Play Matches",    to: "/superadmin/in-play-matches",   icon: Radio },
  { label: "Change Password",    to: "/superadmin/change-password",   icon: KeyRound },
  { label: "Settings",           to: "/superadmin/settings",          icon: Settings },
];

const SIDEBAR_BG = "#2E4151";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          "flex flex-col z-30 shrink-0",
          "transition-transform duration-300 ease-in-out",
          "fixed left-0 top-[55px] h-[calc(100vh-55px)]",
          "lg:static lg:top-auto lg:h-auto lg:self-stretch lg:translate-x-0",
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
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end                  // ← crucial: only active on exact match
              onClick={onClose}
            >
              {({ isActive }) => (
                <span
                  className={[
                    "group flex items-center gap-3 px-3 py-5 rounded-md relative",
                    "transition-all duration-200 cursor-pointer select-none text-sm font-semibold",
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                      style={{ width: 3, height: "60%", backgroundColor: "#90B4D4" }}
                    />
                  )}

                  <Icon
                    size={17}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className="shrink-0"
                    style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.55)" }}
                  />

                  <span style={{ fontFamily: "var(--font-nunito)" }}>{label}</span>
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div
          className="px-3 pb-5 pt-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold
                       text-white/70 hover:bg-white/10 hover:text-white
                       transition-all duration-200"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            <LogOut size={17} strokeWidth={1.8} style={{ color: "rgba(255,255,255,0.55)" }} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}