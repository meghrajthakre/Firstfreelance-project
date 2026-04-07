import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import MarqueeBanner from "../components/MarqueeBanner";
import Footer from "../pages/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Fixed Top Section */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
        <MarqueeBanner />
      </div>

      {/* Main Content */}
      <main className="flex-1 pt-[100px] px-3 sm:px-4 md:px-6">
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