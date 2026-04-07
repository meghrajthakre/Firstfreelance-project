import { useState } from "react";
import toast from "react-hot-toast";
import { updateSuperadminProfile } from "../../services/superAdminService";
import Spinner from "../../components/common/Spinner";

function EyeIcon({ open }) {
  return open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function PasswordInput({ label, value, onChange, placeholder, show, onToggle }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
        {label}
      </label>
      <div className="flex items-center border border-gray-200 rounded-xl px-4 py-2.5 gap-2
        focus-within:ring-2 focus-within:ring-teal-400 focus-within:border-transparent transition">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 min-w-0 outline-none text-sm text-gray-800 placeholder:text-gray-300 bg-transparent"
        />
        <button type="button" onClick={onToggle} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  );
}

export default function UpdatePasswordCard() {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const toggle = (field) => setShow((p) => ({ ...p, [field]: !p[field] }));

  const handleSubmit = async () => {
    if (!oldPassword) return toast.error("Current password is required.");
    if (!password) return toast.error("New password is required.");
    if (password.length < 6) return toast.error("Password must be at least 6 characters.");
    if (password !== confirmPassword) return toast.error("Passwords do not match.");
    if (oldPassword === password) return toast.error("New password must differ from current.");

    setLoading(true);
    try {
      const res = await updateSuperadminProfile({ oldPassword, password, confirmPassword });
      toast.success(res.message ?? "Password updated successfully.");
      setOldPassword(""); setPassword(""); setConfirmPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Update Password</h2>
            <p className="text-xs text-gray-400 mt-0.5">Use a strong, unique password</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-4">
        <PasswordInput
          label="Current Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Enter current password"
          show={show.old}
          onToggle={() => toggle("old")}
        />
        <PasswordInput
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 6 characters"
          show={show.new}
          onToggle={() => toggle("new")}
        />
        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter new password"
          show={show.confirm}
          onToggle={() => toggle("confirm")}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50
            disabled:cursor-not-allowed text-white font-semibold text-sm
            py-2.5 rounded-xl transition-colors shadow-sm mt-1"
        >
          {loading
            ? <span className="flex items-center justify-center gap-2"><Spinner />Saving…</span>
            : "Save Password"}
        </button>
      </div>
    </div>
  );
}