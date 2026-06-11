import MatchHeader      from "./MatchHeader";
import RunnerTable      from "./RunnerTable";
import SessionTable     from "./SessionTable";
import Controls         from "./Controls";
import SessionManagement from "./SessionManagement";

export default function SupportLive() {
  return (
    <div className="min-h-screen bg-gray-100 py-4 px-3 font-sans text-sm">
      <div className="max-w-5xl mx-auto">
        <MatchHeader />
        <RunnerTable />
        <SessionTable />
        <Controls />
        <SessionManagement />
      </div>
    </div>
  );
}