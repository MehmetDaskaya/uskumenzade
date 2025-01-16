"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaEye, FaTrashAlt } from "react-icons/fa";
import {
  fetchOrders,
  deleteOrder,
  Order,
  updateOrder,
} from "@/app/api/order/orderApi";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Snackbar } from "../../index";
import OrderDetailsModal from "../../Modal/OrderDetailsModal";

export const OrderManagementComponent = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
    setTimeout(() => {
      setSnackbar(null);
    }, 3000);
  };

  const [deleteConfirmationId, setDeleteConfirmationId] = useState<
    string | null
  >(null);
  const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null);

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
        setError("Siparişler Yüklenemedi. Lütfen Tekrar Deneyin.");
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
        throw new Error(
          "Doğrulama kodunuzun süresi dolmuş. Yeniden Giriş Yapın."
        );
      }
      await deleteOrder(id, accessToken);
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
      setDeleteConfirmationId(null); // Clear confirmation state
      showSnackbar("Sipariş başarılı bir şekilde silindi.", "success");
    } catch (err) {
      console.error("Failed to delete order:", err);
      showSnackbar(
        "Siparişi silerken bir hata oluştu. Tekrar deneyiniz.",
        "error"
      );
    }
  };

  const handleDeleteClick = (id: string) => {
    if (deleteConfirmationId === id) {
      // Proceed with deletion
      clearTimeout(deleteTimer!);
      setDeleteConfirmationId(null);
      handleDelete(id);
    } else {
      // Set confirmation state
      setDeleteConfirmationId(id);
      const timer = setTimeout(() => {
        setDeleteConfirmationId(null); // Reset after 5 seconds
      }, 5000);
      setDeleteTimer(timer);
    }
  };

  useEffect(() => {
    return () => {
      if (deleteTimer) clearTimeout(deleteTimer);
    };
  }, [deleteTimer]);

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
          className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  {{
                    pending: "Beklemede",
                    processing: "İşleniyor",
                    shipped: "Kargolandı",
                    delivered: "Teslim Edildi",
                    cancelled: "İptal Edildi",
                    paid: "Ödeme Yapıldı",
                  }[order.status] || order.status}
                </td>

                <td className="p-4 text-gray-600">
                  {order.amount.toFixed(2)} ₺
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="mr-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(order.id);
                      }}
                      className={`${
                        deleteConfirmationId === order.id
                          ? "bg-red-500 text-white mt-1 px-3 py-1 rounded-lg"
                          : "bg-red-500 text-white p-2 rounded-lg"
                      } hover:bg-red-600`}
                    >
                      {deleteConfirmationId === order.id ? (
                        "Silme işlemini onaylamak için tıklayın."
                      ) : (
                        <FaTrashAlt />
                      )}
                    </button>
                  </div>
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
                  ? "bg-blue-500 text-white"
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
          onUpdateStatus={async (orderId, status) => {
            try {
              if (!accessToken) {
                throw new Error("Authentication token is missing.");
              }

              // Extract necessary IDs from the selected order
              const shippingAddressId = selectedOrder?.shipping_address?.id;
              const billingAddressId = selectedOrder?.billing_address?.id;

              if (!shippingAddressId || !billingAddressId) {
                throw new Error(
                  "Shipping address ID or billing address ID is missing."
                );
              }

              // Ensure basket items are properly structured
              const basket = selectedOrder?.basket
                .filter((item) => item.item?.id) // Ensure item IDs exist
                .map((item) => ({
                  item_id: item.item!.id, // Use non-null assertion
                  quantity: item.quantity,
                }));

              if (!basket || basket.length === 0) {
                throw new Error("Basket is invalid or empty.");
              }

              // Send the payload with required fields
              await updateOrder(
                orderId,
                {
                  status,
                  shipping_address_id: shippingAddressId, // Include only the ID
                  billing_address_id: billingAddressId, // Include only the ID
                  basket, // Pass the validated basket
                },
                accessToken
              );

              setOrders((prevOrders) =>
                prevOrders.map((order) =>
                  order.id === orderId ? { ...order, status } : order
                )
              );

              showSnackbar("Sipariş durumu başarıyla güncellendi.", "success");
            } catch (error) {
              console.error("Failed to update order status:", error);
              showSnackbar(
                "Sipariş durumu güncellenirken bir hata oluştu.",
                "error"
              );
            }
          }}
          // onInitiateRefund={(orderId) => {
          //   alert(`Refund initiated for order: ${orderId}`);
          // }}
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
