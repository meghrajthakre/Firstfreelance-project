import { useState } from "react";
import { C, MANAGEMENT_INIT } from "./constants";

export default function SessionManagement() {
  const [sessions, setSessions] = useState(MANAGEMENT_INIT);

  const toggleVisible = (i) =>
    setSessions((p) =>
      p.map((s, idx) =>
        idx === i
          ? { ...s, visible: !s.visible, status: !s.visible ? "Showing" : "Not" }
          : s
      )
    );

  const updateDiff = (i, val) =>
    setSessions((p) => p.map((s, idx) => (idx === i ? { ...s, diff: val } : s)));

  return (
    <>
      {/* Options / Delete Session buttons */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          className="text-white text-sm font-semibold px-8 py-2 rounded"
          style={{ background: C.optionsBtn }}
        >
          Options
        </button>
        <button
          className="text-white text-sm font-semibold px-8 py-2 rounded"
          style={{ background: C.deleteBtn }}
        >
          Delete Session
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border border-gray-200 mb-10">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-200">
              <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Session</th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Status</th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Lock/Unlock</th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Rate Diff</th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Group</th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Max Amt</th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Odd Even</th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, i) => (
              <tr key={s.name} className="border-b border-gray-100 bg-white hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-800">{s.name}</td>
                <td
                  className="px-3 py-2 font-medium"
                  style={{ color: s.status === "Showing" ? C.showingText : C.notText }}
                >
                  {s.status}
                </td>
                <td className="px-3 py-2">
                  <select className="border border-gray-300 rounded px-1.5 py-0.5 text-xs bg-white text-gray-700 focus:outline-none">
                    <option>Unlock</option>
                    <option>Lock</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    value={s.diff}
                    onChange={(e) => updateDiff(i, e.target.value)}
                    className="w-10 border border-gray-300 rounded px-1.5 py-0.5 text-xs text-center bg-white focus:outline-none"
                  />
                </td>
                <td className="px-3 py-2">
                  <select className="border border-gray-300 rounded px-1.5 py-0.5 text-xs bg-white text-gray-700 focus:outline-none">
                    <option>Select</option>
                    <option>Group A</option>
                    <option>Group B</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <select className="border border-gray-300 rounded px-1.5 py-0.5 text-xs bg-white text-gray-700 focus:outline-none">
                    <option>Select</option>
                    <option>1000</option>
                    <option>5000</option>
                    <option>10000</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <select className="border border-gray-300 rounded px-1.5 py-0.5 text-xs bg-white text-gray-700 focus:outline-none">
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => toggleVisible(i)}
                    className="text-xs font-medium underline"
                    style={{ color: s.visible ? C.notText : "#2563eb" }}
                  >
                    {s.visible ? "Hide" : "Show"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}