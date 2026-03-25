import Modal from "./Modal";
import Icon from "./Icon";

export default function ConfirmationModal({ open, onClose, admin, onConfirm }) {
  if (!admin) return null;

  const action = admin.isActive ? "block" : "unblock";
  const message = admin.isActive
    ? "Blocking will prevent this admin from logging in or performing any actions."
    : "Unblocking will restore full access to this admin.";

  return (
    <Modal open={open} title="Confirm Action" onClose={onClose}>
      <p className="text-gray-700 mb-2">
        Are you sure you want to <strong>{action}</strong> the admin{" "}
        <strong>{admin.username?.toUpperCase()}</strong>?
      </p>
      <p className="text-gray-500 text-sm mb-4">{message}</p>
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm(admin._id)}
          className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${
            admin.isActive
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {action === "block" ? (
            <Icon d="M18 6L6 18M6 6l12 12" size={11} />
          ) : (
            <Icon d="M20 6L9 17l-5-5" size={11} />
          )}
          {action === "block" ? "Block" : "Unblock"}
        </button>
      </div>
    </Modal>
  );
}