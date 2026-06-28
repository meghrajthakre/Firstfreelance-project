import { useState } from "react";
import { C } from "./constants";

const ODDS_OPTIONS = Array.from({ length: 98 }, (_, i) => i); // 0 to 97

export default function RunnerTable() {
  const [runners, setRunners] = useState([
    { name: "West Indies", status: "open", odds: 0 },
    { name: "Sri Lanka", status: "open", odds: 0 },
  ]);
  const [activeIndex, setActiveIndex] = useState(null);

  const openAllRates = () => {
    setRunners((prev) => prev.map((r) => ({ ...r, status: "open" })));
  };

  const suspendAllRates = () => {
    setActiveIndex(null);
    setRunners((prev) => prev.map((r) => ({ ...r, status: "suspend", odds: 0 })));
  };

  const handleOddsChange = (index, value) => {
    setActiveIndex(index);
    setRunners((prev) =>
      prev.map((r, i) => ({
        ...r,
        status: "open",
        odds: i === index ? Number(value) : 0,
      }))
    );
  };

  return (
    <div className="py-8">
      <div className="overflow-hidden rounded border border-gray-300 w-full">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th
                className="py-2 px-6 text-white text-center font-bold text-xs uppercase tracking-wide"
                style={{ background: C.headerBg }}
              >
                RUNNER
              </th>
              <th
                className="py-2 px-4 text-center font-bold text-xs uppercase"
                style={{ background: C.laGaiBg, color: "#1a3a5c" }}
              >
                LAGAI
              </th>
              <th
                className="py-2 px-4 text-center font-bold text-xs uppercase"
                style={{ background: C.khaiBg, color: "#7a1a2e" }}
              >
                KHAI
              </th>
              <th
                className="py-2 px-4 text-center font-bold text-xs uppercase"
                style={{ background: C.actionHeader, color: "#333" }}
              >
                ACTION
              </th>
            </tr>
          </thead>

          <tbody>
            {runners.map((runner, i) => {
              const isSuspended = runner.status === "suspend";
              const lagai = runner.odds;
              const khai = runner.odds === 0 ? 0 : runner.odds + 1;

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
                    className="py-2 px-4 text-center font-bold relative"
                    style={{ background: C.laGaiCell }}
                  >
                    {isSuspended ? (
                      <span className="text-red-600 tracking-widest text-xs">SUSPENDED</span>
                    ) : (
                      <select
                        value={runner.odds}
                        onChange={(e) => handleOddsChange(i, e.target.value)}
                        className="w-full border border-gray-300 bg-white p-1 outline-none rounded text-gray-900 font-bold cursor-pointer"
                      >
                        {ODDS_OPTIONS.map((num) => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
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
                      <span className="text-gray-900">{khai}</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-2 px-4 text-center">
                    {i === 0 ? (
                      <button
                        onClick={openAllRates}
                        className="text-white font-bold rounded px-3 py-2 transition-all hover:scale-105"
                        style={{ background: C.openBtn }}
                      >
                        Open Rate
                      </button>
                    ) : (
                      <button
                        onClick={suspendAllRates}
                        className="text-white font-bold rounded px-3 py-2 transition-all hover:scale-105"
                        style={{ background: C.suspendBtn }}
                      >
                        Suspend Rate
                      </button>
                    )}
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