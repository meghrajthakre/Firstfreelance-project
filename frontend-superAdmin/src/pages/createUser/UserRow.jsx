import StatusBadge from "./StatusBadge";
import ActionButtons from "./ActionButtons";

export default function UserRow({ user, index, onToggle, onChangePassword, onDelete }) {
  return (
    <tr className="hover:bg-gray-50/80 transition-colors">
      <td className="px-6 py-4 text-gray-400 font-medium">{index + 1}</td>
      <td className="px-6 py-4 font-semibold text-gray-800">{user.firstName}</td>
      <td className="px-6 py-4 text-gray-500 font-mono text-xs">{user.username}</td>
      <td className="px-6 py-4 text-gray-700 font-mono">
        {Number(user.coins ?? 0).toFixed(2)}
      </td>
      <td className="px-6 py-4">
        <StatusBadge isActive={user.isActive} />
      </td>
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