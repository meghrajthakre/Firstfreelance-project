import React from "react";
import { Outlet } from "react-router-dom";
import MarqueeBanner from '../components/MarqueeBanner';
import Footer from "../pages/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-dvh bg-gray-50">

      <header className="fixed top-0 left-0 right-0 z-50">
        {/* <Navbar /> */}
      <MarqueeBanner />

      </header>

      {/* pt-24 = h-16 navbar + h-8 banner */}
      <main className="pt-5">
        <Outlet />
      </main>

      <footer className="mt-auto">
        <Footer />
      </footer>

    </div>
  );
};

export default MainLayout;