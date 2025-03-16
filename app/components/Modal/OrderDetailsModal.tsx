"use client";
import React from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { Order } from "@/app/api/order/orderApi";
import { useState } from "react";

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: string) => void;
  //   onInitiateRefund: (orderId: string) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
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

  const handleStatusChange = () => {
    onUpdateStatus(order.id, selectedStatus);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-4/5 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold mb-6">Sipariş Yönetimi</h2>

        {/* Order Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Sipariş Bilgileri
            </h3>
            <p className="text-sm text-gray-600">Sipariş ID: {order.id}</p>
            <p className="text-sm text-gray-600">
              Sipariş Tarihi: {new Date(order.created_at).toLocaleDateString()}
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
              - ₺
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Kullanıcı Bilgileri
            </h3>
            <p className="text-sm text-gray-600">
              İsim: {order.user.fname} {order.user.lname}
            </p>
            <p className="text-sm text-gray-600">E-posta: {order.user.email}</p>
            <p className="text-sm text-gray-600">
              Telefon Numarası: {order.user.gsm_number}
            </p>
            <p className="text-sm text-gray-600">
              TC Kimlik Numarası: {order.user.national_id}
            </p>
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
              {order.billing_address.zip_code}, {order.billing_address.country}
            </p>
          </div>
        </div>

        {/* Product List */}
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
                  <p className="text-gray-800 font-medium">{item.item?.name}</p>
                  <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                  <p className="text-sm text-gray-600">
                    Fiyat:{" "}
                    {item.item?.discounted_price?.toFixed(2) ||
                      item.item?.price?.toFixed(2)}{" "}
                    ₺
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Admin Actions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700">
            Ürün Durumunu Güncelle
          </h3>
          <div className="flex flex-row">
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

            <div className="flex items-center justify-between">
              <button
                onClick={handleStatusChange}
                className="ml-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Güncelle
              </button>
              {/* <button
            onClick={() => onInitiateRefund(order.id)}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            İade Başlat
          </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
