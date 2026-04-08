import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import MarqueeBanner from "../components/MarqueeBanner";
import Footer from "../pages/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-dvh bg-gray-50">

      {/* Fixed header: Navbar + Banner stacked naturally */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
        <MarqueeBanner />
      </header>

      {/* pt-24 = navbar (64px) + banner (32px) */}
      <main className="pt-24">
        <Outlet />
      </main>

      <footer className="mt-auto">
        <Footer />
      </footer>

    </div>
  );
};

export default MainLayout;