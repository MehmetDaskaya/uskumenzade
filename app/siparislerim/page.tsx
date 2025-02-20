"use client";

import { useEffect, useState } from "react";
import { Order } from "@/app/api/order/orderApi";
import { fetchCurrentUser } from "@/app/api/user/userApi";

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Image from "next/image";

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        if (!accessToken) {
          setError("Authentication token is missing.");
          setLoading(false);
          return;
        }
        const userData = await fetchCurrentUser(accessToken); // Fetch user data
        const ordersWithUser = userData.orders
          .map((order) => ({
            ...order,
            user: userData, // Add the user data manually
            shipping_address_id: order.shipping_address.id, // Include shipping_address_id
            billing_address_id: order.billing_address.id, // Include billing_address_id
          }))
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          ); // Sort orders last to first
        setOrders(ordersWithUser || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Siparişler yüklenemedi. Giriş yapmayı deneyiniz.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [accessToken]);

  return (
    <div className="mx-auto px-6 py-12 bg-secondary min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Sipariş Geçmişim
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Siparişler yükleniyor...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600">Henüz siparişiniz yok.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
              {/* Order Header */}
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Sipariş Detayı
                  </h2>
                  <p className="text-sm text-gray-600">
                    Sipariş Tarihi:{" "}
                    {new Date(order.created_at).toLocaleDateString()}{" "}
                  </p>
                  <p className="text-sm text-gray-600">
                    Sipariş No: {order.id}
                  </p>
                </div>
                {/* <div className="text-right">
                  <button className="px-4 py-2 ml-4 text-sm text-white bg-gray-600 rounded hover:bg-gray-700">
                    İade Talebi
                  </button>
                </div> */}
              </div>

              {/* Order Status */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-3">
                  <span
                    className={`font-medium ${
                      order.status === "paid"
                        ? "text-green-600"
                        : order.status === "cancelled"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {{
                      paid: "Ödeme Yapıldı",
                      pending: "Ödeme Yapılmadı",
                      processing: "İşleniyor",
                      shipped: "Kargolandı",
                      delivered: "Teslim Edildi",
                      cancelled: "İptal Edildi",
                    }[order.status] || "Durum Bilinmiyor"}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <p className="text-sm text-gray-500">Toplam Tutar:</p>
                  <p className="text-lg font-bold text-gray-800">
                    {order.amount.toFixed(2)} ₺
                  </p>
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-2">
                    Teslimat Adresi
                  </h3>
                  <p className="text-sm text-gray-600">
                    {order.shipping_address.address_title} -{" "}
                    {order.shipping_address.address},{" "}
                    {order.shipping_address.city},{" "}
                    {order.shipping_address.state},{" "}
                    {order.shipping_address.zip_code},{" "}
                    {order.shipping_address.country}
                  </p>
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-2">
                    Fatura Adresi
                  </h3>
                  <p className="text-sm text-gray-600">
                    {order.billing_address.address_title} -{" "}
                    {order.billing_address.address},{" "}
                    {order.billing_address.city}, {order.billing_address.state},{" "}
                    {order.billing_address.zip_code},{" "}
                    {order.billing_address.country}
                  </p>
                </div>
              </div>

              {/* Products */}
              <div className="mt-4">
                <h3 className="text-md font-semibold text-gray-700">Ürünler</h3>
                <ul className="space-y-4 mt-2">
                  {order.basket.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-4 border-b pb-4"
                    >
                      <Image
                        src={
                          item.item?.images[0]?.url ||
                          "https://via.placeholder.com/100"
                        }
                        alt={item.item?.images[0]?.alt_text || "Ürün resmi"}
                        width={80} // Specify width
                        height={80} // Specify height
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">
                          {item.item?.name || "Ürün adı bilinmiyor"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Adet: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Birim Fiyatı:{" "}
                          {item.item?.discounted_price
                            ? `${item.item.discounted_price.toFixed(2)} ₺`
                            : "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">
                          Toplam:{" "}
                          {(
                            item.quantity * (item.item?.discounted_price || 0)
                          ).toFixed(2)}{" "}
                          ₺
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
