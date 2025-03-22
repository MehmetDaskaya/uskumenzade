"use client";

import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { clearCartOnSuccess } from "@/redux/slices/cartSlice";
import { fetchCurrentUser } from "@/app/api/auth/authApi";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const statusParam = searchParams.get("status");

      setStatus(statusParam);

      if (statusParam === "success") {
        handlePaymentSuccess();
      }
    }
  }, []);

  const handlePaymentSuccess = async () => {
    try {
      const accessToken = localStorage.getItem("authToken");
      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const userData = await fetchCurrentUser(accessToken);
      const userEmail = userData?.email || null;

      // Clear the cart
      dispatch(clearCartOnSuccess(userEmail));
      localStorage.removeItem("discountCode");

      // Optional: store payment status to sync with other parts of app
      localStorage.setItem("paymentStatus", "success");

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/siparislerim");
      }, 3000);
    } catch (error) {
      console.error("Error handling payment success:", error);
    }
  };

  if (status !== "success") {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
      <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-green-500 mb-4">Ödeme Başarılı</h1>
      <p className="text-gray-700 mb-6">
        Siparişiniz başarıyla alınmıştır. Bizi tercih ettiğiniz için teşekkür
        ederiz.
      </p>
      <p className="text-gray-500 text-sm">
        Siparişlerim sayfasına yönlendiriliyorsunuz...
      </p>
    </div>
  );
};

export default PaymentSuccess;
