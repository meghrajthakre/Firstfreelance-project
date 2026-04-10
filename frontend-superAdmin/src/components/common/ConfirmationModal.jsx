import Modal from "./Modal";
import Icon from "./Icon";

export default function ConfirmationModal({ open, onClose, admin, actionType, onConfirm }) {
  if (!admin) return null;

  // Determine if this is a delete action
  const isDelete = actionType === 'delete';
  
  // For delete action
  if (isDelete) {
    return (
      <Modal open={open} title="Delete Admin" onClose={onClose}>
        <p className="text-gray-700 mb-2">
          Are you sure you want to <strong>delete</strong> the admin{" "}
          <strong>{admin.username?.toUpperCase()}</strong>?
        </p>
        <p className="text-red-500 text-sm mb-4">
          Warning: This action cannot be undone. All data associated with this admin will be permanently removed.
        </p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(admin._id)}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition-colors bg-red-500 hover:bg-red-600 text-white"
          >
            <Icon d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" size={11} />
            Delete Permanently
          </button>
        </div>
      </Modal>
    );
  }

  // For status toggle action (block/unblock)
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