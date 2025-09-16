"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";
import { User } from "../../api/auth/authApi";
import { Snackbar } from "../../components/index";
import { updateOrder } from "../../api/order/orderApi";
import { fetchPayOnDeliveryPricings } from "../../api/pay-on-delivery-pricing/payOnDeliveryPricingApi";
import Image from "next/image";
import Link from "next/link";
import {
  FaTruckMoving,
  FaTag,
  FaCreditCard,
  FaCheckCircle,
} from "react-icons/fa";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

interface CartConfirmationData {
  items: Array<{
    id: string;
    name: string;
    price: number;
    discounted_price?: number;
    quantity: number;
    imageUrl: string;
    stock: number;
  }>;
  pricing: {
    item_total: number;
    shipment_cost: number;
    pay_on_delivery_cost: number;
    final_total: number;
    total_volume: number;
  };
  min_order_value?: number;
  free_shipment_threshold?: number;
}

export default function CartConfirm() {
  const router = useRouter();

  const [confirmationData, setConfirmationData] =
    useState<CartConfirmationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { getAuthenticatedUser } = useAuthRedirect();
  const [user, setUser] = useState<User | null>(null);
  const [userError, setUserError] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authenticatedUser = await getAuthenticatedUser();
        if (!authenticatedUser) {
          setUserError(true);
        } else {
          setUser(authenticatedUser);
        }
      } catch {
        setUserError(true);
      }
    };

    fetchUser();
  }, [getAuthenticatedUser]);

  useEffect(() => {
    if (userError) {
      router.push("/giris");
    }
  }, [userError, router]);

  useEffect(() => {
    const orderId = localStorage.getItem("pendingOrderId");
    if (!orderId) {
      router.push("/sepet");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Authentication required");
          return;
        }

        // Fetch order details from backend
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const orderData = await response.json();

        // Calculate pay on delivery cost and separate shipping cost
        let payOnDeliveryCost = 0;
        let actualShippingCost = orderData.shipping_total || 0;

        if (orderData.payment_on_delivery) {
          try {
            // Try to get POD pricing from backend
            const podPricings = await fetchPayOnDeliveryPricings(token);
            const orderTotal = orderData.items_total || 0;

            // Find appropriate pricing tier based on items total only
            const applicablePricing = podPricings.find(
              (pricing) =>
                orderTotal >= pricing.min_cost && orderTotal <= pricing.max_cost
            );

            if (applicablePricing) {
              payOnDeliveryCost = Number(applicablePricing.price) || 0;
              // Subtract POD cost from shipping_total to get actual shipping cost
              actualShippingCost = Math.max(
                0,
                (orderData.shipping_total || 0) - payOnDeliveryCost
              );
            } else {
              // Fallback: estimate POD cost as percentage of items total
              payOnDeliveryCost = Math.round(
                (orderData.items_total || 0) * 0.05
              ); // 5% of items
              actualShippingCost = Math.max(
                0,
                (orderData.shipping_total || 0) - payOnDeliveryCost
              );
            }
          } catch (error) {
            console.warn(
              "Failed to fetch POD pricing, using fallback calculation:",
              error
            );
            // Fallback: estimate POD cost as percentage of items total
            payOnDeliveryCost = Math.round((orderData.items_total || 0) * 0.05); // 5% of items
            actualShippingCost = Math.max(
              0,
              (orderData.shipping_total || 0) - payOnDeliveryCost
            );
          }
        }

        // Ensure values are valid numbers
        payOnDeliveryCost = Number(payOnDeliveryCost) || 0;
        actualShippingCost = Number(actualShippingCost) || 0;

        // Debug: Log order data to see what backend returns
        console.log("🔍 Order Data from Backend:", {
          total_amount: orderData.total_amount,
          items_total: orderData.items_total,
          shipping_total: orderData.shipping_total,
          payment_on_delivery: orderData.payment_on_delivery,
          calculated_pod_cost: payOnDeliveryCost,
          actual_shipping_cost: actualShippingCost,
          breakdown: {
            items: orderData.items_total,
            shipping: actualShippingCost,
            pod: payOnDeliveryCost,
            total:
              (orderData.items_total || 0) +
              actualShippingCost +
              payOnDeliveryCost,
          },
        });

        // Transform order data to match confirmation format
        const confirmationData: CartConfirmationData = {
          items: orderData.basket.map(
            (item: {
              item_id: string;
              item?: {
                name: string;
                price: number;
                discounted_price?: number;
                images?: Array<{ url: string }>;
                stock: number;
              };
              quantity: number;
              unit_price: number;
              total_price: number;
            }) => ({
              id: item.item_id,
              name: item.item?.name || "Unknown Product",
              price: item.unit_price || item.item?.price || 0,
              discounted_price: item.item?.discounted_price,
              quantity: item.quantity,
              imageUrl: item.item?.images?.[0]?.url || "/placeholder.png",
              stock: item.item?.stock || 0,
            })
          ),
          pricing: {
            item_total: orderData.items_total || 0,
            shipment_cost: actualShippingCost,
            pay_on_delivery_cost: payOnDeliveryCost,

            final_total: orderData.total_amount || 0,
            total_volume: orderData.total_volume || 0,
          },
          min_order_value: 50.0, // Default value
          free_shipment_threshold: 200.0, // Default value
        };

        setConfirmationData(confirmationData);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
        setError("Sipariş detayları alınamadı. Lütfen tekrar deneyin.");
        setSnackbarMessage(
          "Sipariş detayları alınamadı. Lütfen tekrar deneyin."
        );
        setSnackbarType("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchOrderDetails();
    }
  }, [user?.email, router]);

  const handleContinueToPayment = async () => {
    const paymentMethod = localStorage.getItem("paymentMethod");

    if (paymentMethod === "pay_on_delivery") {
      // For pay on delivery, update order status to confirmed and redirect to orders page
      try {
        const token = localStorage.getItem("authToken");
        const orderId = localStorage.getItem("pendingOrderId");

        if (token && orderId) {
          // Update order status to confirmed for pay on delivery orders
          await updateOrder(orderId, { status: "confirmed" }, token);
          console.log("✅ Pay on delivery order confirmed:", orderId);
        }
      } catch (error) {
        console.error("❌ Failed to confirm pay on delivery order:", error);
        // Continue with redirect even if update fails
      }

      // Clear pending order data
      localStorage.removeItem("pendingOrderId");
      localStorage.removeItem("paymentMethod");

      // Redirect to orders page
      router.push("/siparislerim");
    } else {
      // For credit card, initiate payment directly
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setSnackbarMessage("Kimlik doğrulama hatası.");
          setSnackbarType("error");
          setSnackbarOpen(true);
          return;
        }

        const orderId = localStorage.getItem("pendingOrderId");
        if (!orderId) {
          setSnackbarMessage("Sipariş bilgisi bulunamadı.");
          setSnackbarType("error");
          setSnackbarOpen(true);
          return;
        }

        // Import and use initializePayment
        const { initializePayment } = await import(
          "../../api/payment/paymentApi"
        );
        const paymentResponse = await initializePayment(orderId, token);

        if (paymentResponse?.paymentPageUrl) {
          window.open(paymentResponse.paymentPageUrl, "_blank");
          localStorage.removeItem("discountCode");
          localStorage.removeItem("pendingOrderId");

          setSnackbarMessage(
            "Ödeme sayfası yeni bir sekmede açıldı. Ödeme tamamlandıktan sonra siparişlerim sayfasından durumu kontrol edebilirsiniz."
          );
          setSnackbarType("success");
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage("Ödeme başlatılamadı. Lütfen tekrar deneyiniz.");
          setSnackbarType("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Payment initialization failed:", error);
        setSnackbarMessage("Ödeme başlatılamadı. Lütfen tekrar deneyiniz.");
        setSnackbarType("error");
        setSnackbarOpen(true);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-quaternary to-tertiary flex items-center justify-center">
        <div className="bg-white bg-opacity-95 rounded-xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-gray-700">Sepet onaylanıyor...</p>
        </div>
      </div>
    );
  }

  if (error || !confirmationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-quaternary to-tertiary flex items-center justify-center">
        <div className="bg-white bg-opacity-95 rounded-xl shadow-xl p-8 text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Hata Oluştu</h2>
          <p className="text-gray-600 mb-6">
            {error || "Sepet onayı alınamadı."}
          </p>
          <Link href="/sepet">
            <button className="bg-secondary hover:bg-tertiary text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 mx-auto">
              <AiOutlineArrowLeft />
              Sepete Dön
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-quaternary to-tertiary px-4 md:px-16 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/sepet">
            <button className="text-white hover:text-secondary transition-colors duration-300 mr-4">
              <AiOutlineArrowLeft size={24} />
            </button>
          </Link>
          <h1 className="text-4xl font-bold text-white border-l-4 border-secondary pl-4">
            Sepet Onayı
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="w-full lg:w-2/3 space-y-6">
            <div className="bg-white bg-opacity-95 rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Sepetinizdeki Ürünler
              </h2>

              {confirmationData.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center">
                    <Image
                      src={item.imageUrl || "/placeholder.png"}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Adet: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {item.discounted_price &&
                      item.discounted_price < item.price ? (
                        <>
                          <span className="line-through text-red-400 text-sm">
                            {(item.price * item.quantity).toFixed(2)} ₺
                          </span>
                          <br />
                          <span className="text-green-600">
                            {(item.discounted_price * item.quantity).toFixed(2)}{" "}
                            ₺
                          </span>
                        </>
                      ) : (
                        `${(item.price * item.quantity).toFixed(2)} ₺`
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary Section */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white bg-opacity-95 rounded-xl shadow-xl p-6 space-y-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-4 flex items-center gap-2">
                <FaCreditCard className="text-secondary" />
                Fiyat Özeti
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600 py-2">
                  <span>Ürünler Toplamı</span>
                  <span className="font-medium">
                    {confirmationData.pricing.item_total.toFixed(2)} ₺
                  </span>
                </div>

                <div className="flex justify-between text-gray-600 py-2 items-center">
                  <span className="flex items-center gap-2">
                    <FaTruckMoving className="text-secondary" />
                    Kargo Ücreti
                    <span className="text-xs text-gray-400">
                      ({confirmationData.pricing.total_volume.toFixed(2)} desi)
                    </span>
                  </span>
                  <span className="font-medium">
                    {confirmationData.pricing.shipment_cost > 0
                      ? `${confirmationData.pricing.shipment_cost.toFixed(2)} ₺`
                      : "Ücretsiz"}
                  </span>
                </div>

                {confirmationData.pricing.pay_on_delivery_cost > 0 && (
                  <div className="flex justify-between text-gray-600 py-2 items-center">
                    <span className="flex items-center gap-2">
                      <FaTag className="text-orange-500" />
                      Kapıda Ödeme Ücreti
                    </span>
                    <span className="font-medium text-orange-600">
                      {(
                        confirmationData.pricing.pay_on_delivery_cost || 0
                      ).toFixed(2)}{" "}
                      ₺
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Genel Toplam</span>
                  <span className="text-secondary">
                    {confirmationData.pricing.final_total.toFixed(2)} ₺
                  </span>
                </div>
              </div>

              {confirmationData.min_order_value &&
                confirmationData.pricing.item_total <
                  confirmationData.min_order_value && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-sm text-red-600 font-medium">
                      Minimum sepet tutarı:{" "}
                      {confirmationData.min_order_value.toFixed(2)} ₺
                      <br />
                      Ödeme yapabilmek için{" "}
                      {(
                        confirmationData.min_order_value -
                        confirmationData.pricing.item_total
                      ).toFixed(2)}{" "}
                      ₺ değerinde daha ürün eklemelisiniz.
                    </p>
                  </div>
                )}

              {confirmationData.pricing.pay_on_delivery_cost > 0 ? (
                // Pay on Delivery - Show order complete button
                <button
                  onClick={() => router.push("/siparislerim")}
                  className="w-full py-4 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transform hover:scale-105 shadow-lg"
                >
                  <span>Siparişi Tamamla</span>
                  <FaCheckCircle />
                </button>
              ) : (
                // Credit Card - Show payment button
                <button
                  onClick={handleContinueToPayment}
                  disabled={
                    !!(
                      confirmationData.min_order_value &&
                      confirmationData.pricing.item_total <
                        confirmationData.min_order_value
                    )
                  }
                  className={`w-full py-4 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    confirmationData.min_order_value &&
                    confirmationData.pricing.item_total <
                      confirmationData.min_order_value
                      ? "bg-gray-400 cursor-not-allowed opacity-70"
                      : "bg-green-600 hover:bg-green-700 transform hover:scale-105 shadow-lg"
                  }`}
                >
                  <span>Ödemeyi Başlat</span>
                  <AiOutlineArrowRight />
                </button>
              )}

              <div className="text-center">
                <Link href="/sepet">
                  <button className="text-tertiary hover:text-secondary transition-colors duration-300 font-medium hover:underline flex items-center gap-2 mx-auto">
                    <AiOutlineArrowLeft />
                    Sepete Dön
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {snackbarOpen && (
          <Snackbar
            message={snackbarMessage}
            type={snackbarType}
            onClose={() => setSnackbarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
