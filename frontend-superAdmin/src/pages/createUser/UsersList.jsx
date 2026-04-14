import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast"; // ✅ added
import { getUsers, toggleUserStatus } from "../../services/userService";
import PageHeader from "./PageHeader";
import SearchBar from "./SearchBar";
import UsersTable from "./UsersTable";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import EditCoinsModal from "./Editcoinsmodal";

export default function UsersList({ onGoCreate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [toggleLoading, setToggleLoading] = useState(false);

  const [pwModal, setPwModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [coinsModal, setCoinsModal] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers({ search });
      setUsers(res.data || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = () => {
    fetchUsers();
  };

  const handleCoinsUpdate = (id, newCoins) => {
    setUsers((u) =>
      u.map((x) => (x._id === id ? { ...x, coins: newCoins } : x))
    );
    setCoinsModal(null);
  };

  const handleToggle = async (id) => {
    const user = users.find((u) => u._id === id);
    const action = user?.isActive ? "block" : "activate";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} this user?`,
    );

    if (!confirmed) return;

    try {
      setToggleLoading(true);
      await toggleUserStatus(id);
      setUsers((u) =>
        u.map((x) => (x._id === id ? { ...x, isActive: !x.isActive } : x)),
      );
      toast.success(`User ${action}d successfully`); // ✅ added
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      toast.error("Failed to update user status. Please try again."); // ✅ added
    } finally {
      setToggleLoading(false);
    }
  };

  const handlePasswordChange = (id, newPassword) => {
    setUsers((u) => u.map((x) => (x._id === id ? { ...x } : x)));
    setPwModal(null);
  };

  const handleDelete = (id) => {
    setUsers((u) => u.filter((x) => x._id !== id));
    setDeleteModal(null);
  };

  const filteredUsers = users.filter((u) =>
    u.firstName?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-1 font-sans bg-transparent">
      <PageHeader
        buttonText="+ Create User"
        onButtonClick={onGoCreate}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <SearchBar
          search={search}
          onSearchChange={setSearch}
          onSearch={handleSearch}
          loading={loading}
        />

        <UsersTable
          users={filteredUsers}
          loading={loading || toggleLoading}
          onToggle={handleToggle}
          onChangePassword={(user) => setPwModal(user)}
          onDelete={(user) => setDeleteModal(user)}
          onEditCoins={(user) => setCoinsModal(user)}
        />

        {filteredUsers.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400 font-medium bg-gray-50/30">
            Showing {filteredUsers.length} user
            {filteredUsers.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      <ChangePasswordModal
      isOpen={!!pwModal}
      user={pwModal}
      onClose={() => setPwModal(null)}
      onSuccess={handlePasswordChange}
      showToast={(msg, err) => err ? toast.error(msg) : toast.success(msg)} 
/>

    <DeleteConfirmModal
      isOpen={!!deleteModal}
      user={deleteModal}
      onClose={() => setDeleteModal(null)}
      onConfirm={handleDelete}
      showToast={(msg, err) => err ? toast.error(msg) : toast.success(msg)} 
    />

      <EditCoinsModal
        isOpen={!!coinsModal}
        user={coinsModal}
        onClose={() => setCoinsModal(null)}
        onSuccess={handleCoinsUpdate}
        showToast={(msg, err) => err ? toast.error(msg) : toast.success(msg)} // ✅ added
      />

      <Toaster position="bottom-right" /> {/* ✅ added */}
    </div>
  );
}