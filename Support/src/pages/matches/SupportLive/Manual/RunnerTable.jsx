import { useState } from "react";
import { C } from "./constants";

const ODDS_OPTIONS = Array.from({ length: 98 }, (_, i) => i); // 0 to 97

export default function RunnerTable({ rateDiff = 1 }) {
  const [runners, setRunners] = useState([
    { name: "West Indies", odds: 0 },
    { name: "Sri Lanka", odds: 0 },
  ]);
  const [activeIndex, setActiveIndex] = useState(null);

  const openAllRates = () => {
    setRunners((prev) => prev.map((r) => ({ ...r, odds: 0 })));
    setActiveIndex(null);
  };

  const suspendAllRates = () => {
    setActiveIndex(null);
    setRunners((prev) => prev.map((r) => ({ ...r, odds: 0 })));
  };

  const handleOddsChange = (index, value) => {
    const num = Number(value);
    setActiveIndex(index);

    if (num === 97) {
      setRunners((prev) => prev.map((r) => ({ ...r, odds: 97 })));
    } else {
      setRunners((prev) =>
        prev.map((r, i) => ({
          ...r,
          odds: i === index ? num : 0,
        }))
      );
    }
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
              const lagai = runner.odds;
              const khai = runner.odds === 0 || runner.odds === 97
                ? 0
                : runner.odds + rateDiff;

              return (
                <tr
                  key={runner.name}
                  className="border-t border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-2 px-6 text-center text-gray-800 font-bold">
                    {runner.name}
                  </td>

                  {/* Lagai */}
                  <td
                    className="py-2 px-4 text-center font-bold relative"
                    style={{ background: C.laGaiCell }}
                  >
                    <select
                      value={runner.odds}
                      onChange={(e) => handleOddsChange(i, e.target.value)}
                      className="w-full border border-gray-300 bg-white p-1 outline-none rounded text-gray-900 font-bold"
                      style={{ cursor: "pointer" }}
                    >
                      {ODDS_OPTIONS.map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </td>

                  {/* Khai */}
                  <td
                    className="py-2 px-4 text-center font-bold"
                    style={{ background: C.khaiCell }}
                  >
                    <span className="text-gray-900">{khai}</span>
                  </td>

                  {/* Action */}
                  <td className="py-2 px-4 text-center">
                    {i === 0 ? (
                      <button
                        onClick={openAllRates}
                        className="text-white font-bold rounded px-3 py-2 transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95 active:brightness-90 shadow-sm hover:shadow-md"
                        style={{ background: C.openBtn, cursor: "pointer" }}
                      >
                        Open Rate
                      </button>
                    ) : (
                      <button
                        onClick={suspendAllRates}
                        className="text-white font-bold rounded px-3 py-2 transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95 active:brightness-90 shadow-sm hover:shadow-md"
                        style={{ background: C.suspendBtn, cursor: "pointer" }}
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