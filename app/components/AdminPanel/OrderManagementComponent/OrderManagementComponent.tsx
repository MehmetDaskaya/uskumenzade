"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaEye, FaTrashAlt } from "react-icons/fa";
import { fetchOrders, deleteOrder, Order } from "@/app/api/order/orderApi";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import OrderDetailsModal from "../../Modal/OrderDetailsModal";

export const OrderManagementComponent = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ordersPerPage = 5;

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        if (!accessToken) {
          throw new Error("Authentication token is missing.");
        }
        const fetchedOrders = await fetchOrders(accessToken);
        setOrders(fetchedOrders);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [accessToken]);

  // Handle order search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.user.fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Handle Delete Order
  const handleDelete = async (id: string) => {
    try {
      if (!accessToken) {
        throw new Error("Authentication token'ınız bulunmuyor.");
      }
      await deleteOrder(id, accessToken);
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
      alert("Sipariş başarılı bir şekilde silindi.");
    } catch (err) {
      console.error("Failed to delete order:", err);
      alert("Siparişi silerken bir hata oluştu. Tekrar deneyiniz.");
    }
  };

  if (loading) {
    return <p>Siparişler Yükleniyor...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Siparişleri Yönet</h2>

      {/* Search Bar */}
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Sipariş ara..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <FaSearch className="ml-2 text-gray-500" />
      </div>

      {/* Order Table */}
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left font-semibold text-gray-600">ID</th>
            <th className="p-4 text-left font-semibold text-gray-600">
              Müşteri
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">Tarih</th>
            <th className="p-4 text-left font-semibold text-gray-600">
              Sipariş Durumu
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">
              Toplam
            </th>
            <th className="p-4 text-center font-semibold text-gray-600">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-4 text-gray-600">{order.id}</td>
                <td className="p-4 text-gray-600">
                  {order.user.fname} {order.user.lname}
                </td>
                <td className="p-4 text-gray-600">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-gray-600">
                  {order.status === "paid" ? "Ödeme Yapıldı" : order.status}
                </td>

                <td className="p-4 text-gray-600">
                  {order.amount.toFixed(2)} ₺
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="mr-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm("Siparişi silmek istediğinize emin misiniz?")
                      ) {
                        handleDelete(order.id);
                      }
                    }}
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
                Sistemde Sipariş Bulunamadı.
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
      {isModalOpen && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={handleCloseModal}
          onUpdateStatus={(orderId, status) => {
            // Handle updating order status logic
            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order.id === orderId ? { ...order, status } : order
              )
            );
          }}
          onInitiateRefund={(orderId) => {
            // Handle refund initiation logic
            alert(`Refund initiated for order: ${orderId}`);
          }}
        />
      )}
    </div>
  );
};
