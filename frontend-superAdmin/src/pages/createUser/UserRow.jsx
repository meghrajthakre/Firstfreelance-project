import StatusBadge from "./StatusBadge";
import ActionButtons from "./ActionButtons";

export default function UserRow({
  user,
  index,
  onToggle,
  onChangePassword,
  onDelete,
  onEditCoins,
}) {
  return (
    <tr className="hover:bg-gray-50/80 transition-colors group">
      {/* SR. NO. */}
      <td className="px-6 py-4 text-gray-400 font-medium text-sm">
        {index + 1}
      </td>

      {/* NAME */}
      <td className="px-6 py-4">
        <span className="font-semibold text-gray-800 text-sm">
          {user.firstName}
        </span>
      </td>

      {/* USERNAME */}
      <td className="px-6 py-4">
        <span className="font-mono text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
          {user.username}
        </span>
      </td>

      {/* COINS */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold text-gray-700">
            {Number(user.coins ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <button
            onClick={() => onEditCoins(user)}
            title="Edit Coins"
            className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-3 h-3"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </button>
        </div>
      </td>

      {/* STATUS */}
      <td className="px-6 py-4">
        <StatusBadge isActive={user.isActive} />
      </td>

      {/* ACTIONS */}
      <td className="px-6 py-4">
        <ActionButtons
          user={user}
          onToggle={onToggle}
          onChangePassword={onChangePassword}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}