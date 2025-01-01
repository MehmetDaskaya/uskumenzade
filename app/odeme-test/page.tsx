"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

import { CreateOrderRequest, createOrder } from "@/app/api/order/orderApi";
import { fetchCurrentUser } from "@/app/api/user/userApi";
import { initializePayment } from "@/app/api/payment/paymentApi";

import type { Address } from "@/app/api/address/addressApi";
import type { RootState } from "@/redux/store";

export default function PlaceOrder() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<
    string | null
  >(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<
    string | null
  >(null);
  const [useSameAddress, setUseSameAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Instead of checkoutFormContent, we store the paymentPageUrl
  const [iframeUrl, setIframeUrl] = useState<string>("");

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
          setSelectedShippingAddress(userAddresses[0].id || null);
          setSelectedBillingAddress(userAddresses[0].id || null);
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

      // 1) Create the order
      const orderData: CreateOrderRequest = {
        shipping_address_id: selectedShippingAddress!,
        billing_address_id: useSameAddress
          ? selectedShippingAddress!
          : selectedBillingAddress!,
        basket,
      };
      const newOrder = await createOrder(orderData, accessToken);
      console.log("Order created successfully:", newOrder);

      // 2) Initialize the Iyzico Payment Session
      const initResult = await initializePayment(newOrder.id, accessToken);
      // Typically, initResult.paymentPageUrl or initResult.payWithIyzicoPageUrl
      // is the link to the actual iFrame content.
      if (initResult?.paymentPageUrl) {
        setIframeUrl(initResult.paymentPageUrl);
      } else if (initResult?.payWithIyzicoPageUrl) {
        setIframeUrl(initResult.payWithIyzicoPageUrl);
      } else {
        alert("Ödeme sayfası için bir URL bulunamadı.");
      }
    } catch (error) {
      console.error("Failed to create order or initialize payment:", error);
      alert("Failed to proceed with the order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Sipariş Bilgileri
      </h1>

      {/* If we don't have an iframeUrl, show the form to create the order */}
      {!iframeUrl && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg space-y-10"
        >
          {/* Shipping Address */}
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

          {/* Billing Address */}
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
              {isSubmitting ? "İşlem Devam Ediyor..." : "Sipariş Ver"}
            </button>
          </div>
        </form>
      )}

      {/* Once we have the iFrame URL, embed it */}
      {iframeUrl && (
        <div className="bg-white p-8 mt-8 rounded-lg shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700">Ödeme Formu</h2>
          <iframe
            src={iframeUrl}
            width="100%"
            height="600"
            frameBorder="0"
            allow="payment"
            id="payment-iframe"
          />

          {/* Listen for payment gateway messages */}
          <script>
            {`
        window.addEventListener("message", (event) => {
          // Ensure the message comes from a trusted origin (your payment gateway)
          if (event.origin.includes("trusted-payment-gateway.com")) {
            try {
              const data = JSON.parse(event.data);
              if (data.status === "success" && data.order_id) {
                // Redirect to payment-result page
                window.location.href = \`${window.location.origin}/payment-result?status=\${data.status}&order_id=\${data.order_id}\`;
              } else if (data.status === "failure") {
                // Handle failure
                window.location.href = \`${window.location.origin}/payment-result?status=failure\`;
              }
            } catch (error) {
              console.error("Failed to process payment result:", error);
            }
          }
        });
      `}
          </script>
        </div>
      )}
    </div>
  );
}
