"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    // Ensure the code runs on the client-side
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const statusParam = searchParams.get("status");

      setStatus(statusParam);
    }
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
      <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-green-500 mb-4">Ödeme Başarılı</h1>
      <p className="text-gray-700 mb-6">
        Siparişiniz başarıyla alınmıştır. Bizi tercih ettiğiniz için teşekkür
        ederiz.
      </p>
    </div>
  );
};

export default PaymentSuccess;
