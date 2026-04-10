import { Route, Navigate } from "react-router-dom";
import Layout from "../layout/Layout";

import Dashboard from "../pages/Dashboard";
import AdminsPage from "../pages/AdminPages/AdminsPage";
import CollectionReport from "../pages/CollectionReport";
import SuperadminProfilePage from "../pages/changeSuperPassword/Superadminprofilepage";
import SettingsPage from "../pages/SettingPage";
import CreateUserPage from "../pages/createUser/CreateUserPage";

import MatchRoutes from "./MatchRoutes";

export default function SuperAdminRoutes() {
  return (
    <Route path="/superadmin" element={<Layout />}>
      <Route index element={<Navigate to="dashboard" replace />} />

      <Route path="dashboard" element={<Dashboard />} />
      <Route path="admins" element={<AdminsPage />} />
      <Route path="create-user" element={<CreateUserPage />} />
      <Route path="collection-report" element={<CollectionReport />} />
      <Route path="profile" element={<SuperadminProfilePage />} />
      <Route path="settings" element={<SettingsPage />} />

      {/* 🔥 Match routes imported cleanly */}
      {MatchRoutes()}
    </Route>
  );
}