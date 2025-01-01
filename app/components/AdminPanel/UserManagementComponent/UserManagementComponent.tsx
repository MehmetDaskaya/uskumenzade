"use client";

import React, { useEffect, useState } from "react";
import { FaSearch, FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  fetchAllUsers,
  deleteUser,
  fetchUserById,
  User,
} from "@/app/api/user/userApi";
import UserDetailsModal from "../../Modal/UserDetailsModal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export const UserManagementComponent = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const usersPerPage = 5;

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

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

  const handleDelete = async (id: string) => {
    try {
      if (!accessToken) return;
      await deleteUser(id, accessToken);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("User deletion failed. Please try again.");
    }
  };

  const handleEdit = async (id: string) => {
    try {
      if (!accessToken) return;
      const user = await fetchUserById(id, accessToken);
      setSelectedUser(user);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
      alert("Failed to load user details. Please try again.");
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
          className="w-full p-2 border border-gray-300 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                    <button
                      onClick={() => handleEdit(user.id)}
                      className="mr-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-200"
                    >
                      <FaTrashAlt />
                    </button>
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
                        ? "bg-yellow-500 text-white"
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

      <div className="mt-6">
        <button className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300">
          Yeni Kullanıcı Ekle
        </button>
      </div>

      {/* Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};
