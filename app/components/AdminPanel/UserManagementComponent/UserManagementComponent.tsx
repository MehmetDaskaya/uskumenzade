"use client";

import React, { useEffect, useState } from "react";
import { FaSearch, FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  fetchAllUsers,
  deleteUser,
  fetchUserById,
  User,
  updateUser,
} from "@/app/api/user/userApi";
import { fetchAddresses, Address } from "@/app/api/address/addressApi";
import UserDetailsModal from "../../Modal/UserDetailsModal";
import { Snackbar } from "../../index";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export const UserManagementComponent = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserAddress, setSelectedUserAddress] =
    useState<Address | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<
    string | null
  >(null);
  const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
    setTimeout(() => {
      setSnackbar(null);
    }, 3000); // Automatically hide the snackbar after 3 seconds
  };

  const usersPerPage = 5;

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // Ensure cleanup of delete timer on unmount
  useEffect(() => {
    return () => {
      if (deleteTimer) clearTimeout(deleteTimer);
    };
  }, [deleteTimer]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        if (!accessToken) {
          setError("Authentication token is missing.");
          setLoading(false);
          return;
        }
        const fetchedUsers = await fetchAllUsers(accessToken);
        setUsers(fetchedUsers);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [accessToken]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = async (id: string) => {
    try {
      if (!accessToken) return;

      const user = await fetchUserById(id, accessToken);

      // Fetch the user's address
      const addresses = await fetchAddresses(accessToken);
      const userAddress =
        addresses.find((addr) => addr.user_id === user.id) || null;

      setSelectedUser(user);
      setSelectedUserAddress(userAddress);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
      alert("Failed to load user details. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!accessToken) return;
      await deleteUser(id, accessToken);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      setDeleteConfirmationId(null); // Clear confirmation
      showSnackbar("Kullanıcı başarıyla silindi.", "success");
    } catch (err) {
      console.error("Failed to delete user:", err);
      showSnackbar("Kullanıcı silinirken bir hata oluştu.", "error");
    }
  };

  const handleDeleteClick = (id: string) => {
    if (deleteConfirmationId === id) {
      clearTimeout(deleteTimer!);
      setDeleteConfirmationId(null);
      handleDelete(id);
    } else {
      setDeleteConfirmationId(id);
      const timer = setTimeout(() => {
        setDeleteConfirmationId(null);
      }, 5000);
      setDeleteTimer(timer);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Kullanıcıları Yönet</h2>

      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Kullanıcı Ara..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FaSearch className="ml-2 text-gray-500" />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Yükleniyor...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-600">
                  ID
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  İsim
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  E-posta
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Rol
                </th>
                <th className="p-4 text-center font-semibold text-gray-600">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-4 text-gray-600">{user.id}</td>
                  <td className="p-4 text-gray-600">{`${user.fname} ${user.lname}`}</td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4 text-gray-600">{user.role}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="mr-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user.id)}
                        className={`${
                          deleteConfirmationId === user.id
                            ? "bg-red-500 text-white mt-1 px-3 py-1 rounded-lg"
                            : "bg-red-500 text-white p-2 rounded-lg"
                        } hover:bg-red-600`}
                      >
                        {deleteConfirmationId === user.id ? (
                          "Silme işlemini onaylamak için tıklayın."
                        ) : (
                          <FaTrashAlt />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length > usersPerPage && (
            <div className="mt-4 flex justify-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`mx-1 p-2 border rounded-lg ${
                      page === currentPage
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          userAddress={selectedUserAddress} // ✅ Now correctly fetched
          onClose={() => {
            setSelectedUser(null);
            setSelectedUserAddress(null); // Reset address when closing modal
          }}
          onUpdateRole={async (userId, newRole, password) => {
            try {
              if (!accessToken) {
                throw new Error("Authentication token is missing.");
              }

              // Update user role
              const updatedUser = await updateUser(
                { role: newRole, password },
                accessToken
              );

              setUsers((prevUsers) =>
                prevUsers.map((user) =>
                  user.id === userId
                    ? { ...user, role: updatedUser.role }
                    : user
                )
              );

              setSnackbar({
                message: "Kullanıcı rolü başarıyla güncellendi.",
                type: "success",
              });
            } catch (error) {
              console.error("Failed to update user role:", error);
              setSnackbar({
                message: "Kullanıcı rolü güncellenirken bir hata oluştu.",
                type: "error",
              });
            }
          }}
        />
      )}

      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  );
};
