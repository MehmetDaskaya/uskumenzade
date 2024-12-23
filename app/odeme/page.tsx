"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CreateOrderRequest, createOrder } from "@/app/api/order/orderApi";
import { fetchAddresses, Address } from "@/app/api/address/addressApi";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { initializePayment } from "@/app/api/payment/paymentApi";

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    const fetchUserAddresses = async () => {
      if (!accessToken) return;

      try {
        const userAddresses = await fetchAddresses(accessToken);
        setAddresses(userAddresses);
        if (userAddresses.length > 0) {
          setSelectedShippingAddress(userAddresses[0]?.id || null);
          setSelectedBillingAddress(userAddresses[0]?.id || null);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
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

      // Transform cart items into the required basket format
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

      // Initialize payment
      const paymentResponse = await initializePayment(newOrder.id, accessToken);
      setCheckoutUrl(paymentResponse.checkout_url);
      setShowPaymentModal(true);
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
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
      {/* Payment Modal */}
      {showPaymentModal && checkoutUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>
            <iframe
              src={checkoutUrl}
              className="w-full h-96 rounded"
              title="Payment"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
