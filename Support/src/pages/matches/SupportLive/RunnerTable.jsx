import { useState } from "react";
import { C, RUNNERS_INIT } from "./constants";

export default function RunnerTable() {
  const [runners, setRunners] = useState(RUNNERS_INIT);

  const toggle = (i) =>
    setRunners((p) =>
      p.map((r, idx) =>
        idx === i ? { ...r, status: r.status === "open" ? "suspend" : "open" } : r
      )
    );

  return (
    <div className="overflow-hidden rounded border border-gray-300 mb-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th
              className="py-2.5 px-4 text-white text-center font-semibold text-xs uppercase tracking-wide"
              style={{ background: C.headerBg }}
            >
              RUNNER
            </th>
            <th
              className="py-2.5 px-4 text-center font-semibold text-xs uppercase"
              style={{ background: C.laGaiBg, color: "#1a3a5c" }}
            >
              LAGAI
            </th>
            <th
              className="py-2.5 px-4 text-center font-semibold text-xs uppercase"
              style={{ background: C.khaiBg, color: "#7a1a2e" }}
            >
              KHAI
            </th>
            <th
              className="py-2.5 px-4 text-center font-semibold text-xs"
              style={{ background: C.actionHeader, color: "#333" }}
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {runners.map((r, i) => (
            <tr key={r.name} className="border-t border-gray-200 bg-white">
              <td className="py-2.5 px-4 text-center text-gray-800">{r.name}</td>
              <td
                className="py-2.5 px-4 text-center font-medium text-gray-900"
                style={{ background: C.laGaiCell }}
              >
                {r.lagai}
              </td>
              <td
                className="py-2.5 px-4 text-center font-medium text-gray-900"
                style={{ background: C.khaiCell }}
              >
                {r.khai}
              </td>
              <td className="py-2.5 px-4 text-center">
                <button
                  onClick={() => toggle(i)}
                  className="text-white text-xs px-3 py-1 rounded font-medium"
                  style={{ background: r.status === "open" ? C.openBtn : C.suspendBtn }}
                >
                  {r.status === "open" ? "Open Rate" : "Suspend Rate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}