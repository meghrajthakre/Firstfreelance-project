import MatchHeader from "./MatchHeader";
import RunnerTable from "./RunnerTable";
import SessionTable from "./SessionTable";
import Controls from "./Controls";
import SessionManagement from "./SessionManagement";
import { C, MATCH } from "./constants";

export default function ManualPage() {
    return (
        <div className="min-h-screen bg-gray-100 font-sans text-sm">
            <div className="max-w-5xl mx-auto py-6 px-4">
                <div className="flex justify-center mb-4">
                    <div
                        className="text-white font-bold text-base px-10 py-2 rounded-full shadow"
                        style={{ background: C.matchBadge }}
                    >
                        Match : {MATCH.homeTeam} VS {MATCH.awayTeam}
                    </div>
                </div>

                <div className="rounded-t h-12 mb-0" style={{ background: C.openBtn }} />
                <div className="h-3 mb-4 rounded-b" style={{ background: C.startManual }} />

                <div className="mb-4 rounded border border-gray-200 bg-gray-50 p-3 text-gray-700 shadow-sm">
                    <p className="text-sm font-semibold text-gray-800">Manual Market</p>
                    <p className="text-xs text-gray-500">This page uses the same SupportLive layout and local manual controls as the live module.</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-1 md:p-6">
                    <MatchHeader />
                    <RunnerTable />
                    <SessionTable />
                    <Controls />
                    <SessionManagement />
                </div>
            </div>
        </div>
    );
}