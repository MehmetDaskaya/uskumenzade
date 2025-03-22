"use client";

import { useState, useEffect } from "react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchDiscounts } from "@/app/api/discount/discountApi";
import { fetchSettingByKey } from "@/app/api/setting/settingApi";

import Link from "next/link";

import { CreateOrderRequest, createOrder } from "@/app/api/order/orderApi";
import { initializePayment } from "@/app/api/payment/paymentApi";
import { Address } from "@/app/api/address/addressApi";
import { fetchCurrentUser } from "@/app/api/user/userApi";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import UserInformationModal from "../components/Modal/UserInformationModal";

export default function PlaceOrder() {
  const [showModal, setShowModal] = useState(false); // ✅ default to hidden

  const [minOrderValue, setMinOrderValue] = useState<number | null>(null);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleAddressUpdate = (updatedAddresses: Address[]) => {
    setAddresses(updatedAddresses); // Update addresses when the modal updates
  };

  const router = useRouter();
  const [paymentData, setPaymentData] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<
    string | null
  >(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<
    string | null
  >(null);
  const [useSameAddress, setUseSameAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [checkoutFormContent, setCheckoutFormContent] = useState<string | null>(
    null
  );

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    const loadMinOrderValue = async () => {
      try {
        const setting = await fetchSettingByKey("min_order_value");
        if (setting) {
          setMinOrderValue(parseFloat(setting.value));
        }
      } catch (error) {
        console.error("Minimum sepet tutarı alınamadı:", error);
      }
    };

    loadMinOrderValue();
  }, []);

  useEffect(() => {
    const checkUserInfo = async () => {
      if (!accessToken) return;

      try {
        const user = await fetchCurrentUser(accessToken);
        const hasAllFields = Boolean(
          user?.fname?.trim() &&
            user?.lname?.trim() &&
            user?.email?.trim() &&
            user?.gsm_number?.trim()
        );

        const hasAddresses = user?.addresses?.length > 0;

        if (!hasAllFields || !hasAddresses) {
          setShowModal(true);
        }
      } catch (error) {
        console.error("Kullanıcı bilgileri alınırken hata:", error);
        setShowModal(true); // Fallback: show modal
      }
    };

    checkUserInfo();
  }, [accessToken]);

  useEffect(() => {
    const fetchUserAddresses = async () => {
      if (!accessToken) return;

      try {
        const userData = await fetchCurrentUser(accessToken);
        const userAddresses = userData.addresses || [];
        setAddresses(userAddresses);

        if (userAddresses.length > 0) {
          setSelectedShippingAddress(userAddresses[0]?.id || null);
          setSelectedBillingAddress(userAddresses[0]?.id || null);
        }
      } catch (error) {
        console.error("Failed to fetch user addresses:", error);
      }
    };

    fetchUserAddresses();
  }, [accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!accessToken) {
        alert("Authentication token is missing.");
        setIsSubmitting(false);
        return;
      }

      if (
        !selectedShippingAddress ||
        (!useSameAddress && !selectedBillingAddress)
      ) {
        alert("Lütfen tüm adres bilgilerini seçin.");
        setIsSubmitting(false);
        return;
      }

      const basket = cartItems.map((item) => ({
        item_id: item.id,
        quantity: item.quantity,
      }));

      if (basket.length === 0) {
        alert("Sepetiniz boş. Lütfen ürün ekleyin.");
        setIsSubmitting(false);
        return;
      }

      const discountCodeFromStorage = localStorage.getItem("discountCode");

      // 👇 Validate discount's min_order_value before creating the order
      if (discountCodeFromStorage) {
        const allDiscounts = await fetchDiscounts(accessToken);
        const applied = allDiscounts.find(
          (d) => d.code.toLowerCase() === discountCodeFromStorage.toLowerCase()
        );

        // Calculate total price (before discount)
        // Step 1: Calculate original total
        const orderTotal = basket.reduce((sum, item) => {
          const matched = cartItems.find((c) => c.id === item.item_id);
          const price = matched?.discounted_price ?? matched?.price ?? 0;
          return sum + price * item.quantity;
        }, 0);

        // Step 2: Apply discount (if exists)
        let finalTotal = orderTotal;

        if (discountCodeFromStorage && applied) {
          const isPercentage = applied.is_percentage;
          const discountValue = applied.discount_value;

          const discountAmount = isPercentage
            ? (orderTotal * discountValue) / 100
            : discountValue;

          finalTotal = orderTotal - discountAmount;
        }

        // Step 3: Validate final total against min_order_value
        if (minOrderValue !== null && finalTotal < minOrderValue) {
          alert(
            `Sipariş oluşturmak için minimum sepet tutarı ₺${minOrderValue.toFixed(
              2
            )} olmalıdır.`
          );
          setIsSubmitting(false);
          return;
        }

        if (applied?.min_order_value && orderTotal < applied.min_order_value) {
          alert(
            `Bu indirim kodunu kullanmak için minimum sipariş tutarı ₺${applied.min_order_value}`
          );
          setIsSubmitting(false);
          return;
        }
        // Assuming you fetched settings and have `min_order`

        if (!applied) {
          alert("İndirim kodu geçerli değil veya bulunamadı.");
          setIsSubmitting(false);
          return;
        }
      }

      // Create Order Request
      const orderData: CreateOrderRequest = {
        shipping_address_id: selectedShippingAddress!,
        billing_address_id: useSameAddress
          ? selectedShippingAddress!
          : selectedBillingAddress!,
        basket,
        discount_code: discountCodeFromStorage || undefined, // ✅ Fix
      };

      // ✅ Send request to create order
      const newOrder = await createOrder(orderData, accessToken);
      console.log("✅ Order created successfully:", newOrder);

      if (!newOrder.total_amount || newOrder.total_amount <= 0) {
        alert("Hatalı toplam tutar! Lütfen tekrar deneyiniz.");
        setIsSubmitting(false);
        return;
      }

      // ✅ Initialize payment
      const paymentResponse = await initializePayment(newOrder.id, accessToken);

      if (paymentResponse?.paymentPageUrl) {
        window.open(paymentResponse.paymentPageUrl, "_blank");
        localStorage.removeItem("discountCode");

        // ✅ Maybe show a message like "Ödeme sayfası yeni sekmede açıldı"
        alert(
          "Ödeme sayfası yeni bir sekmede açıldı. Ödeme tamamlandıktan sonra siparişlerim sayfasından durumu kontrol edebilirsiniz."
        );
      } else {
        alert("Ödeme başlatılamadı. Lütfen tekrar deneyiniz.");
      }
    } catch (error) {
      console.error("🚨 Failed to create order or initialize payment:", error);
      alert("Siparişe devam edilemiyor. Lütfen tekrar deneyiniz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentMessage = (event: MessageEvent) => {
    console.log("Received message:", event.data);

    // Accept messages only from expected origins
    if (event.origin.includes("iyzipay.com")) {
      try {
        // Parse JSON response
        const paymentResponse =
          typeof event.data === "string"
            ? JSON.parse(event.data) // Parse if it's a string
            : event.data;

        console.log("Payment response parsed:", paymentResponse);

        // Save payment response data in state for display
        setPaymentData(paymentResponse);

        // Check the payment status
        if (paymentResponse?.paymentStatus === "SUCCESS") {
          setPaymentMessage(
            `Payment successful! Payment ID: ${paymentResponse.paymentId}`
          );

          // Close the payment modal
          setShowPaymentModal(false);
        } else {
          setPaymentMessage("Payment failed. Please try again.");
        }
      } catch (error) {
        console.error("Error processing payment response:", error);
        setPaymentMessage("An error occurred while processing the payment.");
      }
    } else {
      console.warn("Ignored message from unexpected origin:", event.origin);
    }
  };

  useEffect(() => {
    if (checkoutFormContent) {
      const container = document.getElementById("payment-form-container");
      if (container) {
        container.innerHTML = ""; // Clear existing content

        const iframe = document.createElement("iframe");
        iframe.width = "100%";
        iframe.height = "600px";
        iframe.style.border = "none";
        container.appendChild(iframe);

        const iframeDoc = iframe.contentWindow?.document;
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(`
        
              ${checkoutFormContent}
             
        `);
          iframeDoc.close();
        }
      }

      // Add event listener for messages
      window.addEventListener("message", handlePaymentMessage);

      // Cleanup to avoid duplicate listeners
      return () => {
        window.removeEventListener("message", handlePaymentMessage);
      };
    }
  }, [checkoutFormContent]);

  return (
    <div className="mx-auto px-6 py-12 bg-secondary">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Sipariş Bilgileri
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg space-y-10"
      >
        {/* Shipping Address Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            Teslimat Adresi
          </h2>
          <select
            value={selectedShippingAddress || ""}
            onChange={(e) => setSelectedShippingAddress(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary bg-gray-200 text-black"
            required
          >
            <option value="" disabled>
              Teslimat adresi seçin
            </option>
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.address_title} - {address.address}, {address.city}
              </option>
            ))}
          </select>
        </div>

        {/* Billing Address Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            Fatura Adresi
          </h2>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={useSameAddress}
              onChange={() => setUseSameAddress(!useSameAddress)}
              className="w-5 h-5 text-tertiary focus:ring-2 focus:ring-tertiary border-gray-300 rounded"
            />
            <label className="text-gray-600">Teslimat adresi ile aynı</label>
          </div>
          {!useSameAddress && (
            <select
              value={selectedBillingAddress || ""}
              onChange={(e) => setSelectedBillingAddress(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary bg-gray-200 text-black"
              required
            >
              <option value="" disabled>
                Fatura adresi seçin
              </option>
              {addresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.address_title} - {address.address}, {address.city} (
                  {address.contact_number})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link href="/sepet">
            <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300">
              Geri
            </button>
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-lg text-white transition duration-300 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSubmitting ? "İşlem Devam Ediyor..." : "Ödeme Adımına Geç"}
          </button>
        </div>
      </form>

      <div className="container mx-auto px-6 py-12 ">
        {/* Display payment message */}
        {paymentMessage && (
          <div
            className={`p-4 rounded mb-4 ${
              paymentMessage.includes("successful")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {paymentMessage}
          </div>
        )}

        {paymentData && (
          <div className="p-4 rounded mb-4 bg-blue-100 text-blue-700">
            <h3>Payment Details:</h3>
            <pre>{JSON.stringify(paymentData, null, 2)}</pre>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl h-[700px] relative">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setIsSubmitting(true); // Set loading state
                  router.push("/siparislerim");
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
              >
                ×
              </button>
              {checkoutFormContent ? (
                <div
                  id="payment-form-container"
                  className="w-full h-full"
                ></div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p>Ödeme formu yükleniyor...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {isSubmitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <LoadingSpinner />
        </div>
      )}
      {showModal && (
        <UserInformationModal
          isVisible={showModal}
          onClose={handleModalClose}
          onUpdateAddresses={handleAddressUpdate}
        />
      )}
    </div>
  );
}
