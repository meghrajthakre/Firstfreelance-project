import MatchHeader      from "./MatchHeader";
import RunnerTable      from "./RunnerTable";
import SessionTable     from "./SessionTable";
import Controls         from "./Controls";
import SessionManagement from "./SessionManagement";

export default function SupportLive() {
  return (
    <div className="min-h-screen bg-gray-300 py-4 px-3 font-sans text-sm">
      <div className="max-w-6xl bg-white px-3 sm:px-1 md:px-6   mx-auto">
        <MatchHeader />
        <RunnerTable />
        <SessionTable />
        <Controls />
        <SessionManagement />      
      </div>
    </div>
  );
}