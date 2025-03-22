"use client";

import { useEffect, useState } from "react";
import { Order, fetchOrderById } from "@/app/api/order/orderApi";
import { fetchCurrentUser } from "@/app/api/user/userApi";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Image from "next/image";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import {
  FaChevronDown,
  FaChevronUp,
  FaBox,
  FaShippingFast,
  FaCheck,
  FaTimes,
  FaRegClock,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    active: true,
    completed: true,
    failed: false,
  });
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
    {}
  );
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

        const userData = await fetchCurrentUser(accessToken);

        const fullOrders = await Promise.all(
          userData.orders.map(async (order) => {
            try {
              const fullOrder = await fetchOrderById(order.id, accessToken);
              return {
                ...fullOrder,
                user: {
                  fname: userData.fname,
                  lname: userData.lname,
                  email: userData.email,
                },
                discount: fullOrder.discount || null,
              };
            } catch (error) {
              console.error("Failed to fetch full order:", order.id, error);
              return null;
            }
          })
        );

        const filteredOrders = fullOrders.filter((o) => o !== null) as Order[];
        const sortedOrders = filteredOrders.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setOrders(sortedOrders);

        // Initialize expanded state for each order
        const initialExpandedState: Record<string, boolean> = {};
        sortedOrders.forEach((order) => {
          // Auto-expand active orders
          initialExpandedState[order.id] = [
            "paid",
            "processing",
            "shipped",
          ].includes(order.status);
        });
        setExpandedOrders(initialExpandedState);

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

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const toggleSection = (section: "active" | "completed" | "failed") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <FaRegClock className="text-yellow-500" />;
      case "processing":
        return <FaBox className="text-blue-500" />;
      case "shipped":
        return <FaShippingFast className="text-indigo-500" />;
      case "delivered":
        return <FaCheck className="text-green-500" />;
      case "cancelled":
      case "pending":
        return <FaTimes className="text-red-500" />;
      default:
        return <FaRegClock className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      paid: "Ödeme Yapıldı",
      pending: "Ödeme Yapılmadı",
      processing: "İşleniyor",
      shipped: "Kargolandı",
      delivered: "Teslim Edildi",
      cancelled: "İptal Edildi",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 border-green-500 text-green-700";
      case "shipped":
        return "bg-indigo-100 border-indigo-500 text-indigo-700";
      case "processing":
        return "bg-blue-100 border-blue-500 text-blue-700";
      case "paid":
        return "bg-yellow-100 border-yellow-500 text-yellow-700";
      case "cancelled":
      case "pending":
        return "bg-red-100 border-red-500 text-red-700";
      default:
        return "bg-gray-100 border-gray-500 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const orderCard = (order: Order) => (
    <motion.div
      key={order.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Order Header - Always visible */}
      <div
        onClick={() => toggleOrderExpand(order.id)}
        className="flex justify-between items-center p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <div className={`rounded-full p-3 ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-800">
                Sipariş #{order.id.slice(-8)}
              </h3>
              <span
                className={`text-sm px-2 py-1 rounded-full ${
                  ["cancelled", "pending"].includes(order.status)
                    ? "bg-red-100 text-red-800"
                    : order.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {getStatusText(order.status)}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {formatDate(order.created_at)}
            </p>
            <p className="font-medium text-gray-800">
              {order.total_amount?.toFixed(2)} ₺
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {["shipped", "delivered"].includes(order.status) &&
            order.shipment_code && (
              <div className="hidden sm:block mr-4 px-3 py-1 bg-gray-100 rounded-lg text-sm">
                <span className="font-medium">Kargo Kodu:</span>{" "}
                {order.shipment_code}
              </div>
            )}
          {expandedOrders[order.id] ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>

      {/* Order Details - Expandable */}
      <AnimatePresence>
        {expandedOrders[order.id] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-gray-200"
          >
            <div className="p-4 sm:p-6 space-y-6">
              {/* Addresses Section */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Teslimat Adresi
                  </h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">
                      {order.shipping_address.address_title}
                    </span>
                    <br />
                    {order.shipping_address.address}
                    <br />
                    {order.shipping_address.city},{" "}
                    {order.shipping_address.state},{" "}
                    {order.shipping_address.zip_code}
                    <br />
                    {order.shipping_address.country}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Fatura Adresi
                  </h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">
                      {order.billing_address.address_title}
                    </span>
                    <br />
                    {order.billing_address.address}
                    <br />
                    {order.billing_address.city}, {order.billing_address.state},{" "}
                    {order.billing_address.zip_code}
                    <br />
                    {order.billing_address.country}
                  </p>
                </div>
              </div>

              {/* Products Section */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Ürünler</h4>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  {order.basket
                    .filter((item) => item.item?.name !== "Kargo Ücreti")
                    .map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-center p-4 ${
                          index !==
                          order.basket.filter(
                            (i) => i.item?.name !== "Kargo Ücreti"
                          ).length -
                            1
                            ? "border-b border-gray-200"
                            : ""
                        }`}
                      >
                        <div className="flex-shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg overflow-hidden">
                          <Image
                            src={
                              item.item?.images[0]?.url ||
                              "/placeholder-tea.jpg"
                            }
                            alt={item.item?.images[0]?.alt_text || "Çay ürünü"}
                            fill
                            sizes="(max-width: 768px) 64px, 80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h5 className="font-medium text-gray-800">
                            {item.item?.name || "Ürün adı bilinmiyor"}
                          </h5>
                          <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-gray-600">
                            <p>Adet: {item.quantity}</p>
                            <p>
                              Birim:{" "}
                              {item.item?.discounted_price
                                ? `${item.item.discounted_price.toFixed(2)} ₺`
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-gray-800">
                            {(
                              item.quantity * (item.item?.discounted_price || 0)
                            ).toFixed(2)}{" "}
                            ₺
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Ara Toplam:</span>
                  <span className="font-medium">
                    {(
                      (order.total_amount || 0) - (order.shipping_total || 0)
                    ).toFixed(2)}{" "}
                    ₺
                  </span>
                </div>

                {order.discount && (
                  <div className="flex justify-between mb-2 text-red-600">
                    <span>İndirim:</span>
                    <span className="font-medium">
                      {order.discount.is_percentage
                        ? `-${order.discount.discount_value}%`
                        : `-${order.discount.discount_value.toFixed(2)} ₺`}
                    </span>
                  </div>
                )}

                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Kargo:</span>
                  <span className="font-medium">
                    {(order.shipping_total ?? 0) === 0
                      ? "Ücretsiz"
                      : `${order.shipping_total?.toFixed(2)} ₺`}
                  </span>
                </div>

                <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
                  <span className="font-semibold text-gray-800">Toplam:</span>
                  <span className="font-bold text-lg text-gray-800">
                    {order.total_amount?.toFixed(2)} ₺
                  </span>
                </div>
              </div>

              {/* Shipment Tracking Visible for Mobile */}
              {["shipped", "delivered"].includes(order.status) &&
                order.shipment_code && (
                  <div className="sm:hidden bg-blue-50 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-blue-700 mb-1">
                      Kargo Takip Kodu
                    </h4>
                    <p className="font-medium text-blue-900">
                      {order.shipment_code}
                    </p>
                  </div>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const activeOrders = orders.filter((o) =>
    ["paid", "processing", "shipped"].includes(o.status)
  );
  const completedOrders = orders.filter((o) => o.status === "delivered");
  const failedOrders = orders.filter((o) =>
    ["pending", "cancelled"].includes(o.status)
  );

  const SectionHeader = ({
    title,
    count,
    isExpanded,
    toggleFn,
  }: {
    title: string;
    count: number;
    isExpanded: boolean;
    toggleFn: () => void;
  }) => (
    <div
      onClick={toggleFn}
      className="flex items-center justify-between bg-white bg-opacity-10 rounded-lg p-4 mb-4 cursor-pointer hover:bg-opacity-15 transition-all"
    >
      <div className="flex items-center">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <span className="ml-3 bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">
          {count}
        </span>
      </div>
      <div className="text-white">
        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
      </div>
    </div>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="bg-white bg-opacity-10 rounded-lg p-8 text-center">
      <p className="text-white text-lg">{message}</p>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-quaternary to-tertiary min-h-screen px-4 sm:px-8 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Sipariş Geçmişim
        </h1>

        {loading ? (
          <div className="flex flex-col items-center space-y-4 bg-white bg-opacity-10 rounded-xl p-12">
            <LoadingSpinner aboveText="Siparişler yükleniyor..." />
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-center">{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Orders Section */}
            <section>
              <SectionHeader
                title="Aktif Siparişler"
                count={activeOrders.length}
                isExpanded={expandedSections.active}
                toggleFn={() => toggleSection("active")}
              />

              <AnimatePresence>
                {expandedSections.active && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 overflow-hidden"
                  >
                    {activeOrders.length > 0 ? (
                      activeOrders.map(orderCard)
                    ) : (
                      <EmptyState message="Aktif siparişiniz bulunmamaktadır." />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Completed Orders Section */}
            <section>
              <SectionHeader
                title="Tamamlanan Siparişler"
                count={completedOrders.length}
                isExpanded={expandedSections.completed}
                toggleFn={() => toggleSection("completed")}
              />

              <AnimatePresence>
                {expandedSections.completed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 overflow-hidden"
                  >
                    {completedOrders.length > 0 ? (
                      completedOrders.map(orderCard)
                    ) : (
                      <EmptyState message="Tamamlanan siparişiniz bulunmamaktadır." />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Failed Orders Section */}
            {failedOrders.length > 0 && (
              <section>
                <SectionHeader
                  title="Başarısız Siparişler"
                  count={failedOrders.length}
                  isExpanded={expandedSections.failed}
                  toggleFn={() => toggleSection("failed")}
                />

                <AnimatePresence>
                  {expandedSections.failed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 overflow-hidden"
                    >
                      {failedOrders.map(orderCard)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
