import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import AdminsPage from "./pages/AdminPages/AdminsPage";
import CollectionReport from "./pages/CollectionReport";
import MatchesPage from "./pages/matches/MatchesPage";
import InPlayMatchesPage from "./pages/InPlayMatchesPage";
import SuperadminProfilePage from "./pages/changeSuperPassword/Superadminprofilepage";
import SettingsPage from "./pages/SettingPage";
import LoginPage from "./pages/Login";
import CreateUserPage from "./pages/createUser/CreateUserPage";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected layout */}
        <Route path="/superadmin" element={<Layout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"         element={<Dashboard />} />
        <Route path="admins"            element={<AdminsPage />} />
        <Route path="create-user"       element={<CreateUserPage />} />
        <Route path="collection-report" element={<CollectionReport />} />
        <Route path="matches"           element={<MatchesPage />} />
        <Route path="in-play-matches"   element={<InPlayMatchesPage />} />
        <Route path="profile"           element={<SuperadminProfilePage />} /> 
        <Route path="settings"          element={<SettingsPage />} />
</Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}