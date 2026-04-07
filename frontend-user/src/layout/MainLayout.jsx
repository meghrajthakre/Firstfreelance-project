import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import MarqueeBanner from "../components/MarqueeBanner";
import Footer from "../pages/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-dvh bg-gray-50">

      {/* Header (Fixed like DHV) */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
        <MarqueeBanner />
      </header>

      {/* Content */}
      <main
        className="
          flex-1
          pt-[calc(56px+36px)]
          px-3
          pb-4
        "
      >
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-auto">
        <Footer />
      </footer>

    </div>
  );
};

export default MainLayout;