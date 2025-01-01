"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { CreateOrderRequest, createOrder } from "@/app/api/order/orderApi";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { Address } from "@/app/api/address/addressApi";
import { fetchCurrentUser } from "@/app/api/user/userApi";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { initializePayment } from "@/app/api/payment/paymentApi";
import { useRouter } from "next/navigation";

export default function PlaceOrder() {
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
        quantity: item.quantity,
        item_id: item.id,
      }));

      if (basket.length === 0) {
        alert("Sepetiniz boş. Lütfen ürün ekleyin.");
        setIsSubmitting(false);
        return;
      }

      const orderData: CreateOrderRequest = {
        shipping_address_id: selectedShippingAddress!,
        billing_address_id: useSameAddress
          ? selectedShippingAddress!
          : selectedBillingAddress!,
        basket,
      };

      const newOrder = await createOrder(orderData, accessToken);
      console.log("Order created successfully:", newOrder);

      const paymentResponse = await initializePayment(newOrder.id, accessToken);
      setCheckoutFormContent(paymentResponse.checkoutFormContent);
      setShowPaymentModal(true);
    } catch (error) {
      console.error("Failed to create order or initialize payment:", error);
      alert("Failed to proceed with the order. Please try again.");
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
    <div className="container mx-auto px-6 py-12 bg-yellow-500">
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
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-200 text-black"
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
              className="w-5 h-5 text-yellow-400 focus:ring-2 focus:ring-yellow-400 border-gray-300 rounded"
            />
            <label className="text-gray-600">Teslimat adresi ile aynı</label>
          </div>
          {!useSameAddress && (
            <select
              value={selectedBillingAddress || ""}
              onChange={(e) => setSelectedBillingAddress(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-200 text-black"
              required
            >
              <option value="" disabled>
                Fatura adresi seçin
              </option>
              {addresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.address_title} - {address.address}, {address.city}
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
    </div>
  );
}
