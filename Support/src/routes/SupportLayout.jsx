import { Outlet } from "react-router-dom";
import SupportNavbar from "../components/common/SupportNavbar";

export default function SupportLayout() {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <SupportNavbar />
      <Outlet />
    </div>
  );
}