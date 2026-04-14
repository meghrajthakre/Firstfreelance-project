import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getUsers, toggleUserStatus } from "../../services/userService";
import PageHeader from "./PageHeader";
import SearchBar from "./SearchBar";
import UsersTable from "./UsersTable";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import EditCoinsModal from "./Editcoinsmodal";
import Spinner from "../../components/common/Spinner";

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
      toast.error("Failed to load users");
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
      toast.success(`User ${action}d successfully`);
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      toast.error("Failed to update user status. Please try again.");
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

        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <Spinner size={48} variant="rainbow" />
              <p className="mt-4 text-gray-500 text-sm font-medium">
                Loading users...
              </p>
            </div>
          </div>
        ) : (
          <>
            <UsersTable
              users={filteredUsers}
              loading={toggleLoading}
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

            {filteredUsers.length === 0 && !loading && (
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">No users found</p>
                  <p className="text-gray-400 text-xs mt-1">Try adjusting your search</p>
                </div>
              </div>
            )}
          </>
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
        showToast={(msg, err) => err ? toast.error(msg) : toast.success(msg)}
      />

      <Toaster position="bottom-right" />
    </div>
  );
}