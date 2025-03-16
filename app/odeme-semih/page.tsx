"use client";

import { useState, useEffect } from "react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

import Link from "next/link";

import { CreateOrderRequest, createOrder } from "@/app/api/order/orderApi";
import { initializePayment } from "@/app/api/payment/paymentApi";
import { Address } from "@/app/api/address/addressApi";
import { fetchCurrentUser } from "@/app/api/user/userApi";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import UserInformationModal from "../components/Modal/UserInformationModal";

export default function PlaceOrderPopup() {
  const [showModal, setShowModal] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<
    string | null
  >(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<
    string | null
  >(null);
  const [useSameAddress, setUseSameAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutFormContent, setCheckoutFormContent] = useState<string | null>(
    null
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [discountCode, setDiscountCode] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("discountCode") || null;
    }
    return null;
  });

  // If no addresses exist, show the modal to update user information.
  useEffect(() => {
    if (!addresses.length && accessToken) {
      setShowModal(true);
    }
  }, [addresses, accessToken]);

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
        unit_price:
          item.discounted_price && item.discounted_price > 0
            ? item.discounted_price
            : item.price,
        total_price:
          (item.discounted_price && item.discounted_price > 0
            ? item.discounted_price
            : item.price) * item.quantity,
      }));
      if (basket.length === 0) {
        alert("Sepetiniz boş. Lütfen ürün ekleyin.");
        setIsSubmitting(false);
        return;
      }
      setDiscountCode(localStorage.getItem("discountCode") || null);
      const orderData: CreateOrderRequest = {
        shipping_address_id: selectedShippingAddress!,
        billing_address_id: useSameAddress
          ? selectedShippingAddress!
          : selectedBillingAddress!,
        basket,
        discount_code: discountCode || undefined,
      };

      // Create the order
      const newOrder = await createOrder(orderData, accessToken);
      console.log("✅ Order created successfully:", newOrder);

      if (!newOrder.total_amount || newOrder.total_amount <= 0) {
        alert("Hatalı toplam tutar! Lütfen tekrar deneyiniz.");
        setIsSubmitting(false);
        return;
      }

      // Initialize payment
      const paymentResponse = await initializePayment(newOrder.id, accessToken);

      if (paymentResponse.checkoutFormContent) {
        // Build the correct callback URL based on the current frontend origin.
        const correctCallbackUrl = `${window.location.origin}/payment-result?status=success&order_id=${newOrder.id}`;

        // Replace the incorrect callback URL in the returned HTML.
        const fixedContent = paymentResponse.checkoutFormContent.replace(
          "http://localhost:8000/uskumenzade/api/payments/None/payment-result",
          correctCallbackUrl
        );

        // Save the fixed content in state and show the payment modal.
        setCheckoutFormContent(fixedContent);
        setShowPaymentModal(true);
      }
    } catch (error) {
      console.error("🚨 Failed to create order or initialize payment:", error);
      alert("Siparişe devam edilemiyor. Lütfen tekrar deneyiniz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Once checkoutFormContent is available and the payment modal is open, insert the content.
  useEffect(() => {
    if (checkoutFormContent && showPaymentModal) {
      const container = document.getElementById("iyzipay-checkout-form");
      if (container) {
        container.innerHTML = checkoutFormContent;
      }
    }
  }, [checkoutFormContent, showPaymentModal]);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleAddressUpdate = (updatedAddresses: Address[]) => {
    setAddresses(updatedAddresses);
  };

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
      {isSubmitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <LoadingSpinner />
        </div>
      )}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
            >
              ×
            </button>
            {/* Container for the Iyzico checkout form popup */}
            <div id="iyzipay-checkout-form" className="popup"></div>
          </div>
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
