"use client";

import React, { useState } from "react";
import { FaSearch, FaEdit, FaTrashAlt } from "react-icons/fa";

interface Order {
  id: number;
  customerName: string;
  orderDate: string;
  status: string;
  total: number;
}

const initialOrders: Order[] = [
  {
    id: 1,
    customerName: "John Doe",
    orderDate: "2023-05-01",
    status: "Shipped",
    total: 99.99,
  },
  {
    id: 2,
    customerName: "Jane Smith",
    orderDate: "2023-05-02",
    status: "Processing",
    total: 149.99,
  },
  {
    id: 3,
    customerName: "Bob Johnson",
    orderDate: "2023-05-03",
    status: "Delivered",
    total: 79.99,
  },
  {
    id: 4,
    customerName: "Alice Brown",
    orderDate: "2023-05-04",
    status: "Cancelled",
    total: 199.99,
  },
  {
    id: 5,
    customerName: "Charlie Davis",
    orderDate: "2023-05-05",
    status: "Processing",
    total: 129.99,
  },
];

export const OrderManagementComponent = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Handle order search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle Delete Order
  const handleDelete = (id: number) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));

    // Reset to first page if current page becomes empty
    const updatedOrders = orders.filter((order) => order.id !== id);
    const updatedFilteredOrders = updatedOrders.filter(
      (order) =>
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const newTotalPages = Math.ceil(
      updatedFilteredOrders.length / ordersPerPage
    );
    if (currentPage > newTotalPages) {
      setCurrentPage(1);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>

      {/* Search Bar */}
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <FaSearch className="ml-2 text-gray-500" />
      </div>

      {/* Order Table */}
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left font-semibold text-gray-600">ID</th>
            <th className="p-4 text-left font-semibold text-gray-600">
              Customer
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">Date</th>
            <th className="p-4 text-left font-semibold text-gray-600">
              Status
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">Total</th>
            <th className="p-4 text-center font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-4 text-gray-600">{order.id}</td>
                <td className="p-4 text-gray-600">{order.customerName}</td>
                <td className="p-4 text-gray-600">{order.orderDate}</td>
                <td className="p-4 text-gray-600">{order.status}</td>
                <td className="p-4 text-gray-600">${order.total.toFixed(2)}</td>
                <td className="p-4 text-center">
                  <button className="mr-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {filteredOrders.length > ordersPerPage && (
        <div className="mt-4 flex justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
          ))}
        </div>
      )}
    </div>
  );
};
