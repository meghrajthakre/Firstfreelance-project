  import LoadingSpinner from "./LoadingSpinner";
  import EmptyState from "./EmptyState";
  import UserRow from "./UserRow";

  export default function UsersTable({ users, loading, onToggle, onChangePassword, onDelete ,onEditCoins}) {
    if (loading) {
      return <LoadingSpinner colSpan={6} />;
    }

    if (users.length === 0) {
      return <EmptyState colSpan={6} message="No users found." />;
    }

    return (
      <div className="overflow-x-auto p-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 text-left font-semibold">SR. NO.</th>
              <th className="px-6 py-4 text-left font-semibold">NAME</th>
              <th className="px-6 py-4 text-left font-semibold">USERNAME</th>
              <th className="px-6 py-4 text-left font-semibold">COINS</th>
              <th className="px-6 py-4 text-left font-semibold">STATUS</th>
              <th className="px-6 py-4 text-left font-semibold">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user, index) => (
              <UserRow
                key={user._id}
                user={user}
                index={index}
                onToggle={onToggle}
                onChangePassword={onChangePassword}
                onDelete={onDelete}
                onEditCoins={onEditCoins}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }