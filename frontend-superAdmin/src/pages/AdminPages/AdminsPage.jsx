import { useState, useMemo, useEffect, useCallback } from "react";
import Icon from "../../components/common/Icon";
import Spinner from "../../components/common/Spinner";
import Field from "../../components/common/Field";
import Modal from "../../components/common/Modal";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import ChangePasswordModal from "../../components/common/ChangePasswordModal";
import {
  getAdmins,
  createAdmin,
  toggleAdminStatus,
} from "../../services/adminService";
import { EMPTY_FORM, inputCls, readonlyCls } from "../../constants/adminConstants";

export default function AdminsPage() {
  /* ── State ── */
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortKey, setSortKey] = useState("username");
  const [sortAsc, setSortAsc] = useState(true);

  const [myDownlineShare, setMyDownlineShare] = useState(100); // fetch from API

  // create modal
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  // modals
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [passOpen, setPassOpen] = useState(false);
  const [passAdminId, setPassAdminId] = useState(null);

  // toast
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg, err = false) => {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 2500);
  }, []);

  /* ── Derived: adminShare shown live in form ── */
  const adminShare = useMemo(() => {
    const master = Number(form.masterShare);
    const ms = Number(form.myShare);
    if (isNaN(master) || isNaN(ms) || form.masterShare === "" || form.myShare === "")
      return "";
    const result = master - ms;
    return result < 0 ? "Invalid" : result;
  }, [form.masterShare, form.myShare]);

  /* ── Open create modal: pre‑fill masterShare from superadmin's budget ── */
  const openCreateModal = () => {
    setForm({ ...EMPTY_FORM, masterShare: String(myDownlineShare) });
    setModalOpen(true);
  };

  /* ── Fetch admins ── */
  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdmins({ page, limit: 10, search });
      setAdmins(res.data ?? []);
      setTotalPages(res.pagination?.totalPages ?? 1);
    } catch (err) {
      showToast(err?.response?.data?.message ?? err.message, true);
    } finally {
      setLoading(false);
    }
  }, [page, search, showToast]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);
  useEffect(() => {
    setPage(1);
  }, [search]);

  /* ── Client-side sort ── */
  const rows = useMemo(
    () =>
      [...admins].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        const r =
          typeof av === "number" ? av - bv : String(av ?? "").localeCompare(String(bv ?? ""));
        return sortAsc ? r : -r;
      }),
    [admins, sortKey, sortAsc]
  );

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc((p) => !p);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  /* ── Create admin ── */
  const handleCreate = async () => {
    const master = Number(form.masterShare);
    const ms = Number(form.myShare);
    const ls = Number(form.ledgerShare || 0);
    const fl = Number(form.fixLimit || 0);

    if (!form.password.trim()) return showToast("Password is required", true);
    if (form.password !== form.confirmPassword) return showToast("Passwords do not match", true);
    if (form.password.length < 6) return showToast("Password must be at least 6 characters", true);
    if (form.myShare === "") return showToast("My Share is required", true);
    if (ms > master) return showToast(`My Share (${ms}) cannot exceed Master Share (${master})`, true);
    if (adminShare === "Invalid" || adminShare < 0)
      return showToast("Admin Share cannot be negative — reduce My Share", true);

    setSaving(true);
    try {
      const res = await createAdmin({
        firstName: form.firstName.trim(),
        masterShare: master,
        myShare: ms,
        ledgerShare: ls,
        fixLimit: fl,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      showToast(res.message ?? "Admin created successfully");
      setModalOpen(false);
      setForm(EMPTY_FORM);
      fetchAdmins();
    } catch (err) {
      showToast(err?.response?.data?.message ?? err.message, true);
    } finally {
      setSaving(false);
    }
  };

  /* ── Toggle status with confirmation ── */
  const handleToggle = (id) => {
    const admin = admins.find((a) => a._id === id);
    if (admin) {
      setSelectedAdmin(admin);
      setConfirmOpen(true);
    }
  };

  const handleConfirmToggle = async (id) => {
    try {
      const res = await toggleAdminStatus(id);
      showToast(res.message);
      setAdmins((p) =>
        p.map((a) => (a._id === id ? { ...a, isActive: res.data.isActive } : a))
      );
      setConfirmOpen(false);
      setSelectedAdmin(null);
    } catch (err) {
      showToast(err?.response?.data?.message ?? err.message, true);
    }
  };

  /* ── Change password modal ── */
  const openPassModal = (id) => {
    setPassAdminId(id);
    setPassOpen(true);
  };

  /* ── Table header ── */
  const Th = ({ label, k }) => (
    <th
      onClick={() => k && handleSort(k)}
      className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase
        tracking-wider border border-gray-200 bg-gray-50 whitespace-nowrap
        ${k ? "cursor-pointer select-none hover:bg-gray-100" : ""}`}
    >
      {label}
      {k && (
        <span className={`ml-1 text-xs ${sortKey === k ? "text-teal-600" : "text-gray-400"}`}>
          {sortKey === k ? (sortAsc ? "↑" : "↓") : "↕"}
        </span>
      )}
    </th>
  );

  /* ════════════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }`}</style>

      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-5">Admins</h1>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* ── Toolbar ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-wrap gap-3">
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-500">Search:</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Username…"
                  className="border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-700
                    focus:outline-none focus:ring-2 focus:ring-teal-400 w-44"
                />
              </div>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white
                  font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                <Icon d="M12 5v14M5 12h14" size={14} />
                Create Admin
              </button>
            </div>

            {/* ── Table ── */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <Th label="Sr. No." k={null} />
                    <Th label="Username" k="username" />
                    <Th label="Name" k="firstName" />
                    <Th label="Ledger Share" k="ledgerShare" />
                    <Th label="My Share %" k="myShare" />
                    <Th label="Admin Share %" k="downlineShare" />
                    <Th label="Status" k="isActive" />
                    <Th label="Action" k={null} />
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-gray-400 text-sm">
                        <span className="inline-flex items-center gap-2">
                          <Spinner /> Loading admins…
                        </span>
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-gray-400 text-sm">
                        No admins found.
                      </td>
                    </tr>
                  ) : (
                    rows.map((a, i) => (
                      <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 border border-gray-100 text-gray-500 text-center">
                          {(page - 1) * 10 + i + 1}
                        </td>
                        <td className="px-4 py-3 border border-gray-100 font-medium text-gray-800">
                          {a.username?.toUpperCase()}
                        </td>
                        <td className="px-4 py-3 border border-gray-100 text-gray-600">
                          {a.firstName || "—"}
                        </td>
                        <td className="px-4 py-3 border border-gray-100 text-gray-700 text-right">
                          {(a.ledgerShare ?? 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 border border-gray-100 text-gray-700 text-right">
                          {(a.myShare ?? 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 border border-gray-100 text-gray-700 text-right">
                          {(a.downlineShare ?? 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 border border-gray-100">
                          {a.isActive ? (
                            <span className="inline-flex items-center gap-1.5 bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded">
                              <Icon d="M20 6L9 17l-5-5" size={11} /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded">
                              <Icon d="M18 6L6 18M6 6l12 12" size={11} /> Blocked
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 border border-gray-100">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => handleToggle(a._id)}
                              className={`flex items-center gap-1.5 text-white text-xs font-semibold
                                px-3 py-1.5 rounded transition-colors
                                ${a.isActive
                                  ? "bg-red-500 hover:bg-red-600"
                                  : "bg-green-500 hover:bg-green-600"
                                }`}
                            >
                              <Icon
                                d={a.isActive ? "M18 6L6 18M6 6l12 12" : "M20 6L9 17l-5-5"}
                                size={11}
                              />
                              {a.isActive ? "Block" : "Unblock"}
                            </button>
                            <button
                              onClick={() => openPassModal(a._id)}
                              className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700
                                text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors whitespace-nowrap"
                            >
                              <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" size={11} />
                              Change Password
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-gray-100">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800
                    disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-sm rounded font-medium transition-colors
                      ${page === p ? "bg-teal-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800
                    disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          CREATE ADMIN MODAL (unchanged)
      ════════════════════════════════════════════════════════════════════ */}
      <Modal open={modalOpen} title="Create Admin" onClose={() => setModalOpen(false)}>
        <div className="grid grid-cols-2 gap-4">
          {/* First Name */}
          <div className="col-span-2">
            <Field label="First Name">
              <input
                className={inputCls}
                placeholder="Akash"
                value={form.firstName}
                onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
              />
            </Field>
          </div>

          {/* Username — auto-generated, shown as info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-lg px-3 py-2">
              <Icon d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={14} />
              <span className="text-xs text-teal-700 font-medium">
                Username will be auto-generated (e.g. ADMIN693)
              </span>
            </div>
          </div>

          {/* Master Share — read-only, is superadmin's downlineShare */}
          <Field label="Master Share % (Your Budget)">
            <input
              className={readonlyCls}
              type="number"
              readOnly
              value={form.masterShare}
              title="This is your available downline share — cannot be changed here"
            />
          </Field>

          {/* My Share */}
          <Field label="My Share %">
            <input
              className={inputCls}
              type="number"
              placeholder="0"
              value={form.myShare}
              min={0}
              max={Number(form.masterShare)}
              onChange={(e) => setForm((p) => ({ ...p, myShare: e.target.value }))}
            />
          </Field>

          {/* Admin Share — auto-calculated, read-only */}
          <Field label="Admin Share % (Auto)">
            <input
              className={readonlyCls}
              type="number"
              readOnly
              value={adminShare}
              title="Auto-calculated: Master Share − My Share"
            />
          </Field>

          {/* Ledger Share */}
          <Field label="Ledger Share">
            <input
              className={inputCls}
              type="number"
              placeholder="0"
              value={form.ledgerShare}
              min={0}
              max={100}
              onChange={(e) => setForm((p) => ({ ...p, ledgerShare: e.target.value }))}
            />
          </Field>

          {/* Fix Limit */}
          <Field label="Fix Limit">
            <input
              className={inputCls}
              type="number"
              placeholder="0"
              value={form.fixLimit}
              min={0}
              onChange={(e) => setForm((p) => ({ ...p, fixLimit: e.target.value }))}
            />
          </Field>

          {/* Password */}
          <Field label="Password">
            <input
              className={inputCls}
              type="password"
              placeholder="••••••"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            />
          </Field>

          {/* Confirm Password */}
          <Field label="Confirm Password">
            <input
              className={inputCls}
              type="password"
              placeholder="••••••"
              value={form.confirmPassword}
              onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
            />
          </Field>
        </div>

        {/* Live share breakdown */}
        <div className="mt-4 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Master Share</span>
            <span className="font-semibold text-gray-700">{form.masterShare || 0}%</span>
          </div>
          <div className="flex justify-between">
            <span>− My Share</span>
            <span className="font-semibold text-gray-700">{form.myShare || 0}%</span>
          </div>
          <div className="border-t border-gray-200 pt-1 flex justify-between">
            <span>= Admin Share</span>
            <span
              className={`font-bold ${adminShare === "Invalid" ? "text-red-500" : "text-teal-600"
                }`}
            >
              {adminShare === "" ? "—" : `${adminShare}%`}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={saving || adminShare === "Invalid"}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold
              bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white rounded-lg transition-colors"
          >
            {saving && <Spinner />}
            {saving ? "Creating…" : "Create Admin"}
          </button>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        admin={selectedAdmin}
        onConfirm={handleConfirmToggle}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={passOpen}
        onClose={() => setPassOpen(false)}
        adminId={passAdminId}
        showToast={showToast}
      />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-sm font-semibold
          shadow-xl z-[200] text-white ${toast.err ? "bg-red-500" : "bg-teal-500"}`}
        >
          {toast.msg}
        </div>
      )}
    </>
  );
}