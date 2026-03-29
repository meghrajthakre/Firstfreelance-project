import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar  = () => setSidebarOpen(false);

  return (
    /*
      h-screen + flex flex-col = full viewport height, no scroll on the shell.
      overflow-hidden on the shell prevents any layout bleed.
    */
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      {/* ── Navbar (shrink-0 so it never compresses) ── */}
      <Navbar onMenuClick={toggleSidebar} />

      {/*
        ── Body row ────────────────────────────────────────────────────────────
        flex-1        → takes all remaining height below navbar
        overflow-hidden → children manage their own scroll
      */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar handles its own mobile-fixed / desktop-static positioning */}
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        {/*
          ── Main content area ────────────────────────────────────────────────
          flex-1      → fills width next to sidebar on desktop
          overflow-y-auto → scrollable content, not the whole page
        */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: "var(--color-bg-main)" }}
        >
          {/* Responsive padding: tighter on mobile, roomier on desktop */}
          <div className="p-3 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}