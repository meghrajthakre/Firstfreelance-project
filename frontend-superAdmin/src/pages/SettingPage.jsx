import { useState } from "react";

const DEFAULT_SETTINGS = {
  entryFee: 10,
  playFee: 10,
  notice: "!! WELCOME TO Top11.COM !!",
  dusKaDum: 1,
  andarBahar: 1,
  roulette: 1,
  patti2020: 1,
  patti2020Old: 1,
  pattiTest: 0,
  pattiOneday: 0,
  logout: 0,
  betLock: 0,
};

const GAME_FIELDS = [
  { key: "dusKaDum",     label: "Dus Ka Dum" },
  { key: "andarBahar",   label: "Andar Bahar" },
  { key: "roulette",     label: "Roulette" },
  { key: "patti2020",    label: "3 Patti 20-20" },
  { key: "patti2020Old", label: "3 Patti 20-20 (OLD)" },
  { key: "pattiTest",    label: "3 Patti Test" },
  { key: "pattiOneday",  label: "3 Patti Oneday" },
];

function Icon({ d, size = 15, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      <path d={d} />
    </svg>
  );
}

/* ── responsive field row: stacks on mobile, side-by-side on sm+ ── */
function FieldRow({ label, value, onChange, isText = false }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
      <label className="text-sm font-medium text-gray-700 sm:w-52 sm:shrink-0">
        {label}
      </label>
      <input
        type={isText ? "text" : "number"}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800
          focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition bg-white"
      />
    </div>
  );
}

function SectionNote({ text }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="flex-1 h-px bg-gray-100" />
      <span className="text-xs font-semibold text-teal-600 bg-teal-50 border border-teal-100
        rounded-full px-3 py-1 whitespace-nowrap text-center">
        {text}
      </span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

/* ══════════════════════════════════════════
   EDIT SETTINGS FORM
══════════════════════════════════════════ */
function EditSettingsForm({ settings, onBack, onSave }) {
  const [form, setForm]       = useState({ ...settings });
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    onSave(form);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">

        <div className="mb-5 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Update platform fees, notices, and game statuses.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-teal-400 to-teal-600" />

          <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-5">

            <FieldRow label="Entry Fee" value={form.entryFee} onChange={v => set("entryFee", v)} />
            <FieldRow label="Play Fee"  value={form.playFee}  onChange={v => set("playFee", v)} />
            <FieldRow label="Notice"    value={form.notice}   onChange={v => set("notice", v)} isText />

            <SectionNote text="0 = Games Suspended · 1 = Games Open for play" />
            {GAME_FIELDS.map(({ key, label }) => (
              <FieldRow key={key} label={label} value={form[key]} onChange={v => set(key, v)} />
            ))}

            <SectionNote text="0 = Login Users · 1 = Logout Users" />
            <FieldRow label="Logout"   value={form.logout}  onChange={v => set("logout", v)} />

            <SectionNote text="0 = Unlock · 1 = Bet Lock" />
            <FieldRow label="Bet Lock" value={form.betLock} onChange={v => set("betLock", v)} />

            {/* Action buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end
              gap-3 pt-3 border-t border-gray-100 mt-1">
              <button onClick={onBack}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-gray-600
                  border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                ← Back
              </button>
              <button onClick={handleSubmit} disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2
                  bg-teal-500 hover:bg-teal-600 disabled:opacity-60
                  text-white font-semibold text-sm px-6 py-2.5 rounded-lg
                  transition-all shadow-sm hover:shadow-md active:scale-95">
                {loading ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </svg>
                    Saving…
                  </>
                ) : (
                  <>
                    <Icon d="M20 6L9 17l-5-5" size={14} />
                    Submit
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SETTINGS TABLE  (main view)
══════════════════════════════════════════ */
export default function SettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [editing, setEditing]   = useState(false);
  const [search, setSearch]     = useState("");
  const [toast, setToast]       = useState(null);

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSave = updated => {
    setSettings(updated);
    setEditing(false);
    showToast("Settings saved successfully!");
  };

  const visible =
    !search ||
    String(settings.entryFee).includes(search) ||
    String(settings.playFee).includes(search) ||
    settings.notice.toLowerCase().includes(search.toLowerCase());

  if (editing) {
    return (
      <EditSettingsForm
        settings={settings}
        onBack={() => setEditing(false)}
        onSave={handleSave}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="mb-5 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Manage platform fees, notices, and game configuration.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-end
            px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 gap-2">
            <div className="flex items-center gap-2 w-full xs:w-auto">
              <span className="text-sm text-gray-500 shrink-0">Search:</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 xs:w-48 border border-gray-200 rounded-lg px-3 py-1.5 text-sm
                  text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              />
            </div>
          </div>

          {/* ── Desktop table (hidden on mobile) ── */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">
                    Entry Fee <span className="text-gray-400 text-xs">↑</span>
                  </th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Play Fee</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Notice / Message</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {visible ? (
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-gray-700 tabular-nums">{settings.entryFee}</td>
                    <td className="px-5 py-4 text-gray-700 tabular-nums">{settings.playFee}</td>
                    <td className="px-5 py-4 text-gray-700">{settings.notice}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => setEditing(true)}
                        className="flex items-center gap-1.5 text-teal-600 hover:text-teal-800
                          font-semibold text-sm transition-colors group">
                        <Icon
                          d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                          size={14} className="group-hover:scale-110 transition-transform"
                        />
                        Edit Settings
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-gray-400">No results found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Mobile card (visible only on mobile) ── */}
          <div className="block sm:hidden">
            {visible ? (
              <div className="p-4 border-b border-gray-100 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1 min-w-0 mr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-20 shrink-0">Entry Fee</span>
                      <span className="text-sm font-semibold text-gray-700">{settings.entryFee}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-20 shrink-0">Play Fee</span>
                      <span className="text-sm font-semibold text-gray-700">{settings.playFee}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-20 shrink-0 mt-0.5">Notice</span>
                      <span className="text-sm text-gray-700 break-words">{settings.notice}</span>
                    </div>
                  </div>
                  <button onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 text-teal-600 hover:text-teal-800
                      font-semibold text-sm transition-colors shrink-0">
                    <Icon
                      d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                      size={14}
                    />
                    Edit
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">No results found.</div>
            )}
          </div>

          {/* Summary cards — 2 cols on mobile, 4 on sm+ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5
            border-t border-gray-100 bg-gray-50/60">
            {[
              { label: "Entry Fee", value: `₹${settings.entryFee}`,
                icon: "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" },
              { label: "Play Fee",  value: `₹${settings.playFee}`,
                icon: "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" },
              { label: "Bet Lock",  value: settings.betLock === 1 ? "Locked 🔒" : "Unlocked 🔓",
                icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
              { label: "Logout",    value: settings.logout === 1 ? "Forced" : "Normal",
                icon: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" },
            ].map(({ label, value, icon }) => (
              <div key={label}
                className="bg-white rounded-xl border border-gray-200 px-3 sm:px-4 py-3
                  flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-teal-50 border border-teal-100
                  grid place-items-center text-teal-500 flex-shrink-0">
                  <Icon d={icon} size={14} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-400 font-medium truncate">{label}</div>
                  <div className="text-xs sm:text-sm font-bold text-gray-800 truncate">{value}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 flex items-center gap-2
          px-4 sm:px-5 py-2.5 sm:py-3 bg-emerald-500 text-white text-sm font-semibold
          rounded-xl shadow-xl z-50">
          <Icon d="M20 6L9 17l-5-5" size={14} />
          {toast}
        </div>
      )}
    </div>
  );
}