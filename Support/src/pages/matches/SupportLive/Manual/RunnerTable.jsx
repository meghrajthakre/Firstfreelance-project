import { useState } from "react";
import { C } from "./constants";

const RUNNERS_INIT = [
  { name: "West Indies", lagai: 0.94, khai: 0.96, status: "open" },
  { name: "Sri Lanka",   lagai: 1.10, khai: 1.12, status: "open" },
];

export default function RunnerTable() {
  const [runners, setRunners] = useState(RUNNERS_INIT);

  const toggleStatus = (index) => {
    setRunners((prev) =>
      prev.map((runner, i) =>
        i === index
          ? { ...runner, status: runner.status === "open" ? "suspend" : "open" }
          : runner
      )
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-3 px-2">Rate Management</h2>

      <div className="overflow-hidden rounded border border-gray-300 w-full">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th
                className="py-2 px-6 text-white text-center font-bold text-xs uppercase tracking-wide w-1/4"
                style={{ background: C.headerBg }}
              >
                RUNNER
              </th>
              <th
                className="py-2 px-4 text-center font-bold text-xs uppercase w-1/4"
                style={{ background: C.laGaiBg, color: "#1a3a5c" }}
              >
                LAGAI
              </th>
              <th
                className="py-2 px-4 text-center font-bold text-xs uppercase w-1/4"
                style={{ background: C.khaiBg, color: "#7a1a2e" }}
              >
                KHAI
              </th>
              <th
                className="py-2 px-4 text-center font-bold text-xs w-1/4"
                style={{ background: C.actionHeader, color: "#333" }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {runners.map((runner, i) => {
              const isSuspended = runner.status === "suspend";
              return (
                <tr
                  key={runner.name}
                  className="border-t border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-150"
                >
                  {/* Runner Name */}
                  <td className="py-2 px-6 text-center text-gray-800 font-bold">
                    {runner.name}
                  </td>

                  {/* Lagai */}
                  <td
                    className="py-2 px-4 text-center font-bold"
                    style={{ background: C.laGaiCell }}
                  >
                    {isSuspended ? (
                      <span className="text-red-600 tracking-widest text-xs">SUSPENDED</span>
                    ) : (
                      <span className="text-gray-900">{Number(runner.lagai).toFixed(2)}</span>
                    )}
                  </td>

                  {/* Khai */}
                  <td
                    className="py-2 px-4 text-center font-bold"
                    style={{ background: C.khaiCell }}
                  >
                    {isSuspended ? (
                      <span className="text-red-600 tracking-widest text-xs">SUSPENDED</span>
                    ) : (
                      <span className="text-gray-900">{Number(runner.khai).toFixed(2)}</span>
                    )}
                  </td>

                  {/* Action Button */}
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => toggleStatus(i)}
                      className="text-white font-bold rounded whitespace-nowrap transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md active:scale-95 active:shadow-sm cursor-pointer min-w-[110px] px-2.5 py-0.5 text-[15px]"
                      style={{ background: isSuspended ? C.suspendBtn : C.openBtn }}
                    >
                      {isSuspended ? "Suspend Rate" : "Open Rate"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}