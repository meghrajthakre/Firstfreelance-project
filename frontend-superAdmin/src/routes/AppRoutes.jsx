import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login";
import SuperAdminRoutes from "./SuperAdminRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />

      {/* Super Admin */}
      {SuperAdminRoutes()}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}