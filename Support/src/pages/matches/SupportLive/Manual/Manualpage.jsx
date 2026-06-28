import { useState } from "react";
import MatchHeader from "./MatchHeader";
import RunnerTable from "./RunnerTable";
import SessionTable from "./SessionTable";
import Controls from "./Controls";
import SessionManagement from "./SessionManagement";
import { C, MATCH } from "./constants";

export default function ManualPage() {
    const [rateDiff, setRateDiff] = useState(1);

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-sm">
            <div className="max-w-5xl mx-auto py-6 px-4">
                <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-1 md:p-6">
                    <MatchHeader />
                    <RunnerTable rateDiff={rateDiff} />
                    <SessionTable />
                    <Controls rateDiff={rateDiff} setRateDiff={setRateDiff} />
                    <SessionManagement />
                </div>
            </div>
        </div>
    );
}