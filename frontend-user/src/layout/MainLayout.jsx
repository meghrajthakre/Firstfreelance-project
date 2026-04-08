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


      </header>

      {/* Content */}
      <main
      >

        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-auto">
        <MarqueeBanner />

        <Footer />
      </footer>
      

    </div>
  );
};

export default MainLayout;