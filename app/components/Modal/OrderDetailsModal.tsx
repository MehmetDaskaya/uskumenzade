"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { Order, updateOrder } from "@/app/api/order/orderApi";
import { Snackbar } from "../index";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: string) => void;
  //   onInitiateRefund: (orderId: string) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  //   onInitiateRefund,
}) => {
  const statuses = [
    { key: "pending", label: "Beklemede" },
    { key: "paid", label: "Ödeme Yapıldı" },
    { key: "shipped", label: "Kargolandı" },
    { key: "delivered", label: "Teslim Edildi" },
    { key: "cancelled", label: "İptal Edildi" },
  ];

  const [selectedStatus, setSelectedStatus] = useState(order.status);

  const handleStatusChange = async () => {
    try {
      await updateOrder(
        order.id,
        {
          status: selectedStatus,
          ...(shipmentCode.trim() && { shipment_code: shipmentCode }),
        },
        accessToken ?? ""
      );
      showSnackbar(
        "Sipariş durumu ve kargo kodu başarıyla güncellendi.",
        "success"
      );

      setSelectedOrder((prevOrder) =>
        prevOrder
          ? {
              ...prevOrder,
              status: selectedStatus,
              shipment_code: shipmentCode,
            }
          : prevOrder
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
      showSnackbar("Sipariş durumu güncellenirken bir hata oluştu.", "error");
    }
  };

  const [shipmentCode, setShipmentCode] = useState(order.shipment_code || "");
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(order);

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
    setTimeout(() => setSnackbar(null), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-4/5 max-h-[90vh] overflow-y-auto shadow-lg relative flex flex-row">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          <FaTimes />
        </button>

        <div className="flex flex-col space-y-6 pr-8">
          <h2 className="text-2xl font-bold mb-6">Sipariş Bilgileri</h2>
          {/* Order Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Sipariş Detayları
              </h3>
              <p className="text-sm text-gray-600">Sipariş ID: {order.id}</p>
              <p className="text-sm text-gray-600">
                Sipariş Tarihi:{" "}
                {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Durum:{" "}
                {{
                  pending: "Beklemede",
                  processing: "İşleniyor",
                  shipped: "Kargolandı",
                  delivered: "Teslim Edildi",
                  cancelled: "İptal Edildi",
                  paid: "Ödeme Yapıldı",
                }[order.status] || order.status}
              </p>

              <p className="text-sm text-gray-600">
                Toplam:{" "}
                {order.total_amount
                  ? order.total_amount.toFixed(2)
                  : "Hesaplanıyor"}
                ₺
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Kullanıcı Detayları
              </h3>
              <p className="text-sm text-gray-600">
                İsim: {order.user.fname} {order.user.lname}
              </p>
              <p className="text-sm text-gray-600">
                E-posta: {order.user.email}
              </p>
              <p className="text-sm text-gray-600">
                Telefon Numarası: {order.user.gsm_number}
              </p>
              {/* <p className="text-sm text-gray-600">
                TC Kimlik Numarası: {order.user.national_id}
              </p> */}
            </div>
          </div>

          {/* Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Müşteri Adresi
              </h3>
              <p className="text-sm text-gray-600">
                {order.shipping_address.address_title}
              </p>
              <p className="text-sm text-gray-600">
                {order.shipping_address.address}
              </p>
              <p className="text-sm text-gray-600">
                {order.shipping_address.city}, {order.shipping_address.state}
              </p>
              <p className="text-sm text-gray-600">
                {order.shipping_address.zip_code},{" "}
                {order.shipping_address.country}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Fatura Adresi
              </h3>
              <p className="text-sm text-gray-600">
                {order.billing_address.address_title}
              </p>
              <p className="text-sm text-gray-600">
                {order.billing_address.address}
              </p>
              <p className="text-sm text-gray-600">
                {order.billing_address.city}, {order.billing_address.state}
              </p>
              <p className="text-sm text-gray-600">
                {order.billing_address.zip_code},{" "}
                {order.billing_address.country}
              </p>
            </div>
          </div>

          {/* Product List with Shipment Cost */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700">Ürünler</h3>
            <ul className="space-y-4 mt-4">
              {order.basket.map((item, index) => (
                <li key={index} className="flex items-center border-b pb-4">
                  <Image
                    src={item.item?.images[0]?.url || "/placeholder.png"}
                    alt={item.item?.images[0]?.alt_text || "Product Image"}
                    width={80}
                    height={80}
                    className="mr-4 rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">
                      {item.item?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Adet: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      Fiyat:{" "}
                      {item.item?.discounted_price?.toFixed(2) ||
                        item.item?.price?.toFixed(2)}{" "}
                      ₺
                    </p>
                  </div>
                </li>
              ))}
              {/* Shipment Cost */}
              <li className="flex items-center">
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">Kargo Ücreti</p>
                  <p className="text-sm text-gray-600">
                    Fiyat: {(order.shipping_total ?? 0).toFixed(2)} ₺
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="flex flex-col space-y-4 border-l pl-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Ürün Durumunu Güncelle
          </h3>
          <select
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full p-3 bg-gray-200 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedStatus}
          >
            {statuses.map((status) => (
              <option key={status.key} value={status.key}>
                {status.label}
              </option>
            ))}
          </select>

          {["shipped", "delivered", "cancelled"].includes(selectedStatus) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Kargo Takip Kodu
              </h3>
              <input
                type="text"
                value={shipmentCode}
                onChange={(e) => setShipmentCode(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <button
            onClick={handleStatusChange}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Güncelle
          </button>
        </div>
      </div>
      {/* Add Snackbar component to render notifications */}
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

export default OrderDetailsModal;
