import { useState, useEffect } from "react";
import { getUsers, toggleUserStatus } from "../../services/userService"; // Add toggleUserStatus import
import PageHeader from "./PageHeader";
import SearchBar from "./SearchBar";
import UsersTable from "./UsersTable";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function UsersList({ onGoCreate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [toggleLoading, setToggleLoading] = useState(false); // Optional: track toggle loading state

  const [pwModal, setPwModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

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

  const handleToggle = async (id) => {
    // Optional: Add confirmation dialog
    const user = users.find(u => u._id === id);
    const action = user?.isActive ? 'block' : 'activate';
    const confirmed = window.confirm(`Are you sure you want to ${action} this user?`);
    
    if (!confirmed) return;
    
    try {
      setToggleLoading(true);
      // Call the API to toggle user status
      await toggleUserStatus(id);
      
      // Update local state after successful API call
      setUsers((u) =>
        u.map((x) => (x._id === id ? { ...x, isActive: !x.isActive } : x))
      );
      
      // Optional: Show success message
      // You can add a toast notification here
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      // Optional: Show error message
      alert("Failed to update user status. Please try again.");
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
    u.firstName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 font-sans">
      <PageHeader title="Users" buttonText="+ Create User" onButtonClick={onGoCreate} />
      
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
        />
        
        {filteredUsers.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400 font-medium bg-gray-50/30">
            Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      <ChangePasswordModal
        isOpen={!!pwModal}
        user={pwModal}
        onClose={() => setPwModal(null)}
        onSuccess={handlePasswordChange}
      />

      <DeleteConfirmModal
        isOpen={!!deleteModal}
        user={deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}