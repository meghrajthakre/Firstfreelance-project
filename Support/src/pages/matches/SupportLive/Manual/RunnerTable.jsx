import { useState } from "react";
import { C } from "./constants";

const RUNNERS_INIT = [
  { name: "West Indies", status: "open" },
  { name: "Sri Lanka", status: "open" },
];

const ODDS_OPTIONS = Array.from({ length: 97 }, (_, i) => i + 1); // 1 to 97

export default function RunnerTable() {
  const [runners, setRunners] = useState(RUNNERS_INIT);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeOdds, setActiveOdds] = useState(1);

  // Open all rates
  const openAllRates = () => {
    setRunners((prev) =>
      prev.map((runner) => ({ ...runner, status: "open" }))
    );
    setActiveIndex(null);
    setActiveOdds(1);
  };

  // Suspend all rates
  const suspendAllRates = () => {
    setRunners((prev) =>
      prev.map((runner) => ({ ...runner, status: "suspend" }))
    );
    setActiveIndex(null);
    setActiveOdds(1);
  };

  const handleOddsChange = (index, value) => {
    // If the runner is suspended, don't allow odds change
    if (runners[index].status === "suspend") return;

    setActiveIndex(index);
    setActiveOdds(value);
  };

  const isMaxOdds = activeOdds >= 97 && activeIndex !== null;

  const getLagai = (i) => {
    // If selected runner is suspended, show 0
    if (runners[i].status === "suspend") return 0;
    if (activeIndex === null) return 0;
    if (isMaxOdds) return 97; // both teams show 97 at max
    return activeIndex === i ? activeOdds : 0;
  };

  const getKhai = (i) => {
    // If selected runner is suspended, show 0
    if (runners[i].status === "suspend") return 0;
    if (activeIndex === null) return 0;
    if (isMaxOdds) return 97; // both teams show 97 at max
    return activeIndex === i ? activeOdds + 1 : 0;
  };

  // Check if any runner is currently selected
  const hasActiveSelection = activeIndex !== null;
  const selectedRunner = hasActiveSelection ? runners[activeIndex] : null;
  const isSelectedSuspended = selectedRunner?.status === "suspend";

  // Check if all runners are suspended
  const allSuspended = runners.every(runner => runner.status === "suspend");

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-3 px-2">
        Rate Management
      </h2>

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
              const isActive = activeIndex === i;
              const isOtherSelected = hasActiveSelection && !isActive;
              const isSelectedAndSuspended = isActive && isSuspended;

              // Check if should show dropdown
              const showDropdown = !isSuspended && (!hasActiveSelection || isActive);

              let lagai = getLagai(i);
              let khai = getKhai(i);

              // If selected runner is suspended, show 0 for both
              if (isSelectedAndSuspended) {
                lagai = 0;
                khai = 0;
              }

              return (
                <tr
                  key={runner.name}
                  className="border-t border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-150"
                >
                  {/* Runner */}
                  <td className="py-2 px-6 text-center text-gray-800 font-bold">
                    {runner.name}
                  </td>

                  {/* Lagai */}
                  <td
                    className="py-2 px-4 text-center font-bold relative"
                    style={{ background: C.laGaiCell }}
                  >
                    {isSuspended ? (
                      <span className="text-red-600 tracking-widest text-xs">
                        SUSPENDED
                      </span>
                    ) : isOtherSelected && !isMaxOdds ? (
                      <span className="text-red-600 tracking-widest text-xs font-bold">
                        SUSPENDED
                      </span>
                    ) : showDropdown ? (
                      <select
                        value={isActive ? activeOdds : 1}
                        onChange={(e) =>
                          handleOddsChange(i, Number(e.target.value))
                        }
                        className="w-full border border-gray-300 bg-white p-1 outline-none rounded text-gray-900 font-bold cursor-pointer"
                        disabled={isSuspended}
                      >
                        {ODDS_OPTIONS.map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-gray-900 font-bold">{lagai}</span>
                    )}
                  </td>

                  {/* Khai */}
                  <td
                    className="py-2 px-4 text-center font-bold"
                    style={{ background: C.khaiCell }}
                  >
                    {isSuspended ? (
                      <span className="text-red-600 tracking-widest text-xs">
                        SUSPENDED
                      </span>
                    ) : isOtherSelected && !isMaxOdds ? (
                      <span className="text-red-600 tracking-widest text-xs font-bold">
                        SUSPENDED
                      </span>
                    ) : (
                      <span className="text-gray-900">{khai}</span>
                    )}
                  </td>

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