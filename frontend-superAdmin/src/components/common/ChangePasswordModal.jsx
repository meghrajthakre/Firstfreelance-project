import { useState } from "react";
import Modal from "./Modal";
import Field from "./Field";
import Spinner from "./Spinner";
import { changeAdminPassword } from "../../services/adminService";

export default function ChangePasswordModal({ open, onClose, adminId, showToast }) {
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!newPass) return showToast("Enter a new password", true);
    if (newPass.length < 6) return showToast("Password must be at least 6 characters", true);
    if (newPass !== confirmPass) return showToast("Passwords don't match", true);

    setLoading(true);
    try {
      const res = await changeAdminPassword(adminId, newPass, confirmPass);
      showToast(res.message || "Password updated");
      onClose();
    } catch (err) {
      showToast(err?.response?.data?.message ?? err.message, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} title="Change Password" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Field label="New Password">
          <input
            className="border border-gray-200 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
            type="password"
            placeholder="Enter new password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
        </Field>
        <Field label="Confirm Password">
          <input
            className="border border-gray-200 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
            type="password"
            placeholder="Confirm password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
        </Field>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white rounded-lg transition-colors"
        >
          {loading && <Spinner />}
          {loading ? "Updating…" : "Update Password"}
        </button>
      </div>
    </Modal>
  );
}