import { useState, useMemo } from "react";

const INITIAL_ADMINS = [
  { id: 1, username: "ADMIN679", name: "Akash",   password: "Akhari", ledger: 50, myShare: 10,  adminShare: 90, status: "Active" },
  { id: 2, username: "ADMIN675", name: "TestSMC", password: "1122",   ledger: 50, myShare: 88,  adminShare: 12, status: "Active" },
  { id: 3, username: "ADMIN659", name: "TESTSM",  password: "1122",   ledger: 10, myShare: 10,  adminShare: 90, status: "Active" },
  { id: 4, username: "ADMIN642", name: "Ravi",    password: "ravi99", ledger: 60, myShare: 20,  adminShare: 80, status: "Inactive" },
  { id: 5, username: "ADMIN610", name: "Priya",   password: "priya1", ledger: 40, myShare: 15,  adminShare: 85, status: "Active" },
];

const EMPTY_FORM = { name: "", username: "", password: "", ledger: "", myShare: "", adminShare: "", status: "Active" };

function Icon({ d, size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl shadow-2xl w-[460px] max-w-[95vw] p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <Icon d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition";

export default function AdminsPage() {
  const [admins, setAdmins]   = useState(INITIAL_ADMINS);
  const [search, setSearch]   = useState("");
  const [sortKey, setSortKey] = useState("id");
  const [sortAsc, setSortAsc] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId]       = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);

  const [passOpen, setPassOpen]       = useState(false);
  const [passId, setPassId]           = useState(null);
  const [newPass, setNewPass]         = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [toast, setToast] = useState(null);
  const showToast = (msg, err = false) => {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 2400);
  };

  const rows = useMemo(() => {
    const q = search.toLowerCase();
    let list = admins.filter(a =>
      a.username.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
    );
    return [...list].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const r = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortAsc ? r : -r;
    });
  }, [admins, search, sortKey, sortAsc]);

  const handleSort = key => {
    if (sortKey === key) setSortAsc(p => !p);
    else { setSortKey(key); setSortAsc(true); }
  };

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setModalOpen(true); };
  const openEdit = id => {
    const a = admins.find(x => x.id === id);
    setForm({ name: a.name, username: a.username, password: a.password,
      ledger: a.ledger, myShare: a.myShare, adminShare: a.adminShare, status: a.status });
    setEditId(id); setModalOpen(true);
  };

  const saveAdmin = () => {
    if (!form.name.trim() || !form.username.trim()) return showToast("Name & Username are required", true);
    const payload = { ...form, ledger: +form.ledger || 0, myShare: +form.myShare || 0, adminShare: +form.adminShare || 0 };
    if (editId) {
      setAdmins(p => p.map(a => a.id === editId ? { ...a, ...payload } : a));
      showToast("Admin updated successfully");
    } else {
      setAdmins(p => [...p, { id: Date.now(), ...payload }]);
      showToast("Admin created successfully");
    }
    setModalOpen(false);
  };

  const openPass = id => { setPassId(id); setNewPass(""); setConfirmPass(""); setPassOpen(true); };
  const savePass = () => {
    if (!newPass) return showToast("Enter a new password", true);
    if (newPass !== confirmPass) return showToast("Passwords don't match", true);
    setAdmins(p => p.map(a => a.id === passId ? { ...a, password: newPass } : a));
    setPassOpen(false); showToast("Password updated");
  };

  const Arrow = ({ k }) => (
    <span className={`ml-1 text-xs ${sortKey === k ? "text-teal-600" : "text-gray-400"}`}>
      {sortKey === k ? (sortAsc ? "↑" : "↓") : "↕"}
    </span>
  );

  const Th = ({ label, k }) => (
    <th onClick={() => k && handleSort(k)}
      className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-gray-200 bg-gray-50 whitespace-nowrap
        ${k ? "cursor-pointer select-none hover:bg-gray-100" : ""}`}>
      {label}{k && <Arrow k={k} />}
    </th>
  );

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }`}
      </style>

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-2xl font-bold text-gray-800 mb-5">Admins</h1>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">

            {/* Toolbar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-wrap gap-3">
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-500">Search:</span>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  className="border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 w-44" />
              </div>
              <button onClick={openCreate}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-sm">
                <Icon d="M12 5v14M5 12h14" size={14} />
                Create Admin
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <Th label="Sr. No." k="id" />
                    <Th label="Username" k="username" />
                    <Th label="Name" k="name" />
                    <Th label="Password" k={null} />
                    <Th label="Ledger Share" k="ledger" />
                    <Th label="My Share %" k="myShare" />
                    <Th label="Admin Share %" k="adminShare" />
                    <Th label="Status" k="status" />
                    <Th label="Action" k={null} />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a, i) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 border border-gray-100 text-gray-500 text-center">{i + 1}</td>
                      <td className="px-4 py-3 border border-gray-100 text-gray-700">{a.username}</td>
                      <td className="px-4 py-3 border border-gray-100 font-medium text-gray-800">{a.name}</td>
                      <td className="px-4 py-3 border border-gray-100 text-gray-600">{a.password}</td>
                      <td className="px-4 py-3 border border-gray-100 text-gray-700 text-right">{a.ledger.toFixed(2)}</td>
                      <td className="px-4 py-3 border border-gray-100 text-gray-700 text-right">{a.myShare.toFixed(2)}</td>
                      <td className="px-4 py-3 border border-gray-100 text-gray-700 text-right">{a.adminShare.toFixed(2)}</td>
                      <td className="px-4 py-3 border border-gray-100">
                        {a.status === "Active" ? (
                          <span className="inline-flex items-center gap-1.5 bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded">
                            <Icon d="M20 6L9 17l-5-5" size={11} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded">
                            <Icon d="M18 6L6 18M6 6l12 12" size={11} /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 border border-gray-100">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button onClick={() => openEdit(a.id)}
                            className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors">
                            <Icon d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" size={11} />
                            Edit
                          </button>
                          <button onClick={() => openPass(a.id)}
                            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors whitespace-nowrap">
                            <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" size={11} />
                            Change Password
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-10 text-center text-gray-400 text-sm">No admins found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal open={modalOpen} title={editId ? "Edit Admin" : "Create Admin"} onClose={() => setModalOpen(false)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Name">
              <input className={inputCls} placeholder="Full name" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </Field>
          </div>
          <Field label="Username">
            <input className={inputCls} placeholder="ADMIN000" value={form.username}
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
          </Field>
          <Field label="Password">
            <input className={inputCls} placeholder="Password" value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
          </Field>
          <Field label="Ledger Share">
            <input className={inputCls} type="number" placeholder="0.00" value={form.ledger}
              onChange={e => setForm(p => ({ ...p, ledger: e.target.value }))} />
          </Field>
          <Field label="My Share %">
            <input className={inputCls} type="number" placeholder="0.00" value={form.myShare}
              onChange={e => setForm(p => ({ ...p, myShare: e.target.value }))} />
          </Field>
          <div className="col-span-2">
            <Field label="Admin Share %">
              <input className={inputCls} type="number" placeholder="0.00" value={form.adminShare}
                onChange={e => setForm(p => ({ ...p, adminShare: e.target.value }))} />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Status">
              <select className={inputCls} value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </Field>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={saveAdmin}
            className="px-5 py-2 text-sm font-semibold bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors">
            Save Admin
          </button>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal open={passOpen} title="Change Password" onClose={() => setPassOpen(false)}>
        <div className="flex flex-col gap-4">
          <Field label="New Password">
            <input className={inputCls} placeholder="Enter new password" value={newPass}
              onChange={e => setNewPass(e.target.value)} />
          </Field>
          <Field label="Confirm Password">
            <input className={inputCls} placeholder="Confirm password" value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)} />
          </Field>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setPassOpen(false)}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={savePass}
            className="px-5 py-2 text-sm font-semibold bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors">
            Update Password
          </button>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-sm font-semibold shadow-xl z-[200] text-white
          ${toast.err ? "bg-red-500" : "bg-teal-500"}`}>
          {toast.msg}
        </div>
      )}
    </>
  );
}