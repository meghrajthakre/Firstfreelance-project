import { useState } from "react";
import toast from "react-hot-toast";
import { updateSuperadminProfile } from "../../services/superadminService";
import Spinner from "../../components/common/Spinner";

export default function UpdateUsernameCard({ profile, onUpdate }) {
  const [username, setUsername] = useState(profile?.username ?? "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmed = username.trim().toLowerCase();
    if (!trimmed) return toast.error("Username cannot be empty.");
    if (trimmed === profile?.username) return toast.error("That's already your username.");

    setLoading(true);
    try {
      const res = await updateSuperadminProfile({ username: trimmed });
      toast.success(res.message ?? "Username updated successfully.");
      onUpdate?.(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to update username.");
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
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Update Username</h2>
            <p className="text-xs text-gray-400 mt-0.5">Change your login username</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-4">
        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
          <span className="text-xs text-gray-400 font-medium">Current username</span>
          <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            {profile?.username ?? "—"}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            New Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter new username"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800
              placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400
              focus:border-transparent transition"
          />
          <p className="text-[11px] text-gray-400 mt-1.5 ml-0.5">Stored in lowercase. Must be unique.</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50
            disabled:cursor-not-allowed text-white font-semibold text-sm
            py-2.5 rounded-xl transition-colors shadow-sm"
        >
          {loading
            ? <span className="flex items-center justify-center gap-2"><Spinner />Saving…</span>
            : "Save Username"}
        </button>
      </div>
    </div>
  );
}