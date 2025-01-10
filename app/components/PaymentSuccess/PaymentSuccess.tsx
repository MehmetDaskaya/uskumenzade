"use client";

import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { clearCartOnSuccess } from "@/redux/slices/cartSlice";
import { fetchCurrentUser } from "@/app/api/auth/authApi";

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    // Ensure the code runs on the client-side
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const statusParam = searchParams.get("status");

      setStatus(statusParam);

      if (statusParam === "success") {
        handlePaymentSuccess();
        console.log(status);
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

      // Dispatch the clearCartOnSuccess action with userEmail
      dispatch(clearCartOnSuccess(userEmail));
    } catch (error) {
      console.error("Error handling payment success:", error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
      <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-green-500 mb-4">Ödeme Başarılı</h1>
      <p className="text-gray-700 mb-6">
        Siparişiniz başarıyla alınmıştır. Bizi tercih ettiğiniz için teşekkür
        ederiz.
      </p>
      <p className="text-gray-700 mb-6">Bu sayfayı kapatabilirsiniz.</p>
    </div>
  );
};

export default PaymentSuccess;
