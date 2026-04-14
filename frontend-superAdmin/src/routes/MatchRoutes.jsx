import { Route } from "react-router-dom";
import MatchesPage from "../pages/matches/MatchesPage";
import InPlayMatchesPage from "../pages/InPlayMatchesPage";
import MatchLiveReport from "../pages/matches/MatchLiveReport";

export default function MatchRoutes() {
  return (
    <>
      <Route path="matches" element={<MatchesPage />} />
      <Route path="matches/:id/live-report" element={<MatchLiveReport />} />
      <Route path="in-play-matches" element={<InPlayMatchesPage />} />
    </>
  );
}