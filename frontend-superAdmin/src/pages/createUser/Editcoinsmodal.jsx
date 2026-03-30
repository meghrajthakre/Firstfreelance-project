import { useState, useEffect } from "react";
import { updateUser } from "../../services/userService";

export default function EditCoinsModal({ isOpen, user, onClose, onSuccess }) {
  const [coins, setCoins] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setCoins(user.coins ?? 0);
      setError("");
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async () => {
    const value = Number(coins);
    if (isNaN(value) || value < 0) {
      setError("Please enter a valid non-negative number.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await updateUser(user._id, { coins: value });
      onSuccess(user._id, value);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update coins.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Edit Coins</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Updating coins for{" "}
              <span className="font-medium text-gray-600">{user.firstName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Current balance */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
          <span className="text-xs text-amber-600 font-medium">Current Balance</span>
          <span className="text-sm font-bold text-amber-700">🪙 {user.coins ?? 0}</span>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            New Coin Value
          </label>
          <input
            type="number"
            min="0"
            value={coins}
            onChange={(e) => setCoins(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
            placeholder="Enter coins amount"
          />
          {error && (
            <p className="text-xs text-red-500 mt-1.5">{error}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-60 transition-colors"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}