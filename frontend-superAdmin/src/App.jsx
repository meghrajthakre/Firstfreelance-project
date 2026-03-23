import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import AdminsPage from "./pages/AdminsPage";
import CollectionReport from "./pages/CollectionReport";
import MatchesPage from "./pages/matches/MatchesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/superadmin" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="admins" element={<AdminsPage />} />
          <Route path="collection-report" element={<CollectionReport />} />
          <Route path="matches" element={<MatchesPage />} />
        </Route>

      </Routes>
    </BrowserRouter >
  );
}